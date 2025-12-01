// backend/src/config/mail.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // email we are using
        pass: process.env.EMAIL_PASS, //  Gmail app password key
    },
});

transporter.verify((err, success) => {
    if (err) {
        console.error("Error setting up mail transporter:", err);
    } else {
        console.log("Mail transporter is ready to send messages");
    }
});

export default transporter;
