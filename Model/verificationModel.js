import mongoose, { Schema } from "mongoose";

const verificationSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: Number,
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 600
    }
})

const verificationModel = mongoose.model("verificationSchema", verificationSchema);

export default verificationModel;