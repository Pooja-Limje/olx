const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/dad5vdnmy/image/upload/v1721291295/jj_b55e0j.png"
    },
    password: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    code: {
        type: String,
    },
    active: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    mobile: {
        type: Number,
        required: false
    },
}, { timestamps: true })

module.exports = mongoose.model("user", userSchema)