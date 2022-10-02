import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    firstname: {
        type: String,
        require: true
    },
    lastname: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    companyname: {
        type: String,
        default: "UnNamed"
    }
})

const userModel = mongoose.model("userModel", userSchema);
export default userModel;