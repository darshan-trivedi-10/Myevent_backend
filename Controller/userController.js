import bcrypt from 'bcrypt'
import userModel from "../Model/userModel.js";
import verificationModel from "../Model/verificationModel.js";
import sendEmail from "../Utils/sendEmail.js";
import jwt from 'jsonwebtoken';
import axios from 'axios';


function generateOTP() {
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

function generatePassword() {
    var pass = '';
    var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
        'abcdefghijklmnopqrstuvwxyz0123456789@#$';

    for (let i = 1; i <= 8; i++) {
        var char = Math.floor(Math.random()
            * str.length + 1);

        pass += str.charAt(char)
    }
    return pass;
}

export const sendOtp = async (req, res) => {
    const email = req.body.email;
    try {
        const verifyUser = await verificationModel.findOne({
            "email": email
        })
        const user = await userModel.findOne({
            "email": email
        })
        if (user) {
            res.status(200).json("Please logIn");
        } else {
            const otp = generateOTP();
            const message = "Your Verification OTP is :- " + otp;
            if (verifyUser) {
                await verifyUser.updateOne({
                    "otp": otp,
                    createdAt: Date.now()
                });
                await sendEmail(email, "My Event Login OTP", message);
                res.status(200).json("OTP Send On Email ID")
            } else {
                const newUser = new verificationModel(
                    {
                        otp: otp,
                        email: req.body.email,
                    }
                )
                await newUser.save();
                await sendEmail(email, "My Event Login OTP", message);
                res.status(200).json("OTP Send On Email ID ")
            }
        }

    } catch (error) {
        // console.log(error)
        res.status(500).json(error.message)
    }
}

export const createUser = async (req, res) => {
    if (req.body.googleAccessToken) {
        const { googleAccessToken } = req.body;
        axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                "Authorization": `Bearer ${googleAccessToken}`
            }
        })
            .then(async response => {
                const firstname = response.data.given_name;
                const lastname = response.data.family_name;
                const email = response.data.email;
                const password = generatePassword();

                const existingUser = await userModel.findOne({ "email": email })
                console.log(existingUser);
                if (existingUser) {
                    return res.status(400).json("User already exist!")
                } else {
                    await sendEmail(email, "My Event Password ", `Your My Event Email is ${email} and password is ${password}.`);
                    const salt = await bcrypt.genSalt(10);
                    const newPassword = await bcrypt.hash(password, salt);
                    const user = new userModel({
                        "firstname": firstname,
                        "lastname": lastname,
                        "email": email,
                        "password": newPassword,
                    })

                    await user.save();
                    const token = jwt.sign({
                        email: email,
                        id: user._id
                    }, process.env.JWT_SCREATE_KEY, { expiresIn: '720h' })
                    user.password = undefined;
                    res.status(200).json(
                        { "user": user, "token": token }
                    );
                }
            }).catch(err => {
                res.status(400).json({ message: "Invalid access token!" });
            })
    } else {
        const { firstname, lastname, email, otp, password, companyname } = req.body;
        try {
            const verify = await verificationModel.findOne({
                "email": email
            })
            if (verify) {
                const verifyOtp = verify.otp;
                if (verifyOtp == otp) {
                    console.log("password")
                    console.log(password)
                    const salt = await bcrypt.genSalt(10);
                    const newPassword = await bcrypt.hash(password, salt);
                    const user = new userModel({
                        "firstname": firstname,
                        "lastname": lastname,
                        "email": email,
                        "password": newPassword,
                        "companyname": companyname
                    })
                    await user.save();
                    await verificationModel.findByIdAndDelete(verify._id);
                    const token = jwt.sign({
                        email: email,
                        id: user._id
                    }, process.env.JWT_SCREATE_KEY, { expiresIn: '720h' })
                    user.password = undefined;
                    res.status(200).json(
                        { "user": user, "token": token }
                    );
                } else {
                    console.log("password1")
                    res.status(401).json("Please Enter Correct OTP")
                }
            } else {
                const user = await userModel.findOne({
                    "email": email
                })
                if (user) {
                    res.status(200).json("Please logIn");
                } else {
                    res.status(401).json("Please Generate New OTP");
                }
            }
        } catch (error) {
            res.status(500).json(error.message)
        }
    }
}

export const loginUser = async (req, res) => {
    if (req.body.googleAccessToken) {
        const { googleAccessToken } = req.body;

        axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                "Authorization": `Bearer ${googleAccessToken}`
            }
        }).then(async response => {
            const firstname = response.data.given_name;
            const lastname = response.data.family_name;
            const email = response.data.email;
            const existingUser = await userModel.findOne({ email })

            if (!existingUser) {
                return res.status(404).json("User don't exist!")
            } else {
                const token = jwt.sign({
                    email: email,
                    id: existingUser._id
                }, process.env.JWT_SCREATE_KEY, { expiresIn: '720h' })

                existingUser.password = undefined;
                res.status(200).json(
                    { "user": existingUser, "token": token }
                );
            }
        }).catch(err => {
            res.status(400).json("Invalid access token!");
        })

    } else {
        const email = req.body.email, password = req.body.password;
        try {
            const user = await userModel.findOne({ "email": email });
            if (user) {
                const userValidation = await bcrypt.compare(password, user.password);
                if (userValidation) {
                    const token = jwt.sign({
                        email: email,
                        id: user._id
                    }, process.env.JWT_SCREATE_KEY, { expiresIn: '720h' })
                    user.password = undefined;
                    res.status(200).json(
                        { "user": user, "token": token }
                    );
                } else {
                    res.status(401).json('Please Enter Correct Credentials');
                }

            } else {
                res.status(401).json("Please Create Account First :) ");
            }
        } catch (error) {
            res.status(500).json(error.message)
        }
    }

}