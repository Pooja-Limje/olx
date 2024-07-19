const nodeMailer = require("nodemailer")

const sendEmail = ({ to, subject, message, from }) => new Promise((resolve, reject) => {
    const tranport = nodeMailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.FORM_EMAIL, pass: process.env.EMAIL_PASS
        }
    })
    tranport.sendMail({
        from: process.env.FORM_EMAIL,
        to,
        subject,
        text: message,
        html: message
    }, err => {
        if (err) {
            reject(false)
        } else {
            resolve(true)
        }
    })
})

module.exports = sendEmail