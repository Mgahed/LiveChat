const nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');

const transporter = nodemailer.createTransport(smtpTransport({
    // host: 'mail.mrtechnawy.com',
    // port: 26,
    // secure: false, // true for 465, false for other ports
    service: 'gmail',
    host: 'smtp.gmail.com',
    tls: {
        rejectUnauthorized:false
    },
    auth: {
        user: process.env.email,
        pass: process.env.password,
    },
}));

exports.transporter = transporter;