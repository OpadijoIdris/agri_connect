import nodemailer from "nodemailer";
import { configDotenv } from "dotenv";

configDotenv();

export const sendEmail = async (to, subject, html) => {
    try{
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            },
        });

        const info = await transport.sendMail({
            from: "agri connect",
            to,
            subject,
            html
        })
        console.log("message sent", info.messageId )

    }catch(error){
        console.log("could not send email", error)
    }
}

export default sendEmail