const nodemailer = require('nodemailer');
const config = require("../config/dbConfig");

const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
        user: config.MAILUSER,// "36213843360@mby.co.il",
        pass: config.MAILPASSWORD// "Student@264",
    }
});

const sendEmail = async (to, subject, body) => {
    const mailOptions = {
        from: config.MAILUSER,
        to: to,
        subject: subject,
        text: body
    };
    return await transporter.sendMail(mailOptions);
}

async function sendEmailWithAttachment(to, subject, body, filename, path) {
    let mailOptions = {
        from: config.MAILUSER,
        to: to,
        subject: subject,
        text: body,
        attachments: [
            {
                filename: filename,//'example.pdf',
                path: path//'/path/to/example.pdf'
            }
        ]
    };
    return await transporter.sendMail(mailOptions);
}

module.exports = {
    sendEmail,
    sendEmailWithAttachment
};