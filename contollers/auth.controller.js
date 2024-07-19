// admin register
// admin login
// admin verify otp
// admin logout

// user register
// user verify email
// user lohin
// user logout

const asyncHandler = require("express-async-handler")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { checkEmpty } = require("../utils/checkEmpty")
const Admin = require("../models/Admin")
const sendEmail = require("../utils/email")

exports.registerAdmin = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body
    const { isError, error } = checkEmpty({ name, email, password })
    if (isError) {
        return res.status(400).json({ message: "all fields required", error })
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "invalid email" })
    }
    // if (!validator.isStrongPassword(password)) {
    //     return res.status(400).json({ message: "provide strong password" })
    // }
    const isFound = await Admin.findOne({ email })
    if (isFound) {
        return res.status(400).json({ message: "email already registered with us" })
    }
    const hash = await bcrypt.hash(password, 10)
    await Admin.create({ name, email, password: hash })

    res.json({ message: "register success" })

})

exports.loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const { error, isError } = checkEmpty({ email, password })
    if (isError) {
        return res.status(401).json({ message: "all fields required", error })
    }
    if (!validator.isEmail(email)) {
        return res.status(401).json({ message: "invalid email" })
    }
    const result = await Admin.findOne({ email })
    if (!result) {
        return res.status(401).json({ message: process.env.NODE_ENV === "development" ? " invalid email" : "invalid credentials" })
    }
    const isVerify = await bcrypt.compare(password, result.password)
    if (!isVerify) {
        return res.status(401).json({ message: process.env.NODE_ENV === "development" ? " invalid password" : "invalid credentials" })
    }
    // send otp
    const otp = Math.floor(10000 + Math.random() * 900000) //nanoid

    await Admin.findByIdAndUpdate(result._id, { otp })

    await sendEmail({
        to: email, subject: `login otp`, message: `
        <h1>do not share your account otp</h1>
        <p>your login otp ${otp}</p>
        ` })

    res.json({ message: "credentials verify success, otp send to your registered email." })

})

exports.verifyOTP = asyncHandler(async (req, res) => {
    const { otp, email } = req.body
    const { isError, error } = checkEmpty({ otp, email })
    if (isError) {
        return res.status(401).json({ message: "all fields required", error })
    }
    if (!validator.isEmail(email)) {
        return res.status(401).json({ message: "invalid email" })
    }
    const result = await Admin.findOne({ email })
    if (!result) {
        return res.status(401).json({ message: process.env.NODE_ENV === "development" ? " invalid email" : "invalid credentials" })
    }
    if (otp !== result.otp) {
        return res.status(401).json({ message: "invalid otp" })
    }
    const token = jwt.sign({ userId: result._id }, process.env.JWT_KEY, { expiresIn: "1d" })
    // JWT
    res.cookie("admin", token, { maxAge: 86400000, httpOnly: true, secure: process.env.NODE_ENV === "production" })
    // cookie
    res.json({
        message: "otp verify success ", result: {
            _id: result._id,
            name: result.name,
            email: result.email
        }
    })
    // res
})