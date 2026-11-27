const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        fullname:{
            type: String,
            required: true,
            trim: true,
        },
        username:{
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
        },
        password:{
            type: String,
            required: true,
             select: false
        },
        resetPasswordToken: {
            type: String,
            trim: true,
        },
        resetPasswordExpires: {
            type: String,
            trim: true,
        }



    },
    {timestamps: true}
)

module.exports = mongoose.model("User", userSchema);