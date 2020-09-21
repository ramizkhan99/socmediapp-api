import nodemailer from "nodemailer";

export const sendVerificationEmail = async (
    email: string,
    username: string
) => {
    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });

    let info = await transporter.sendMail({
        from: "Commconn <testmail@commconn.com>",
        to: email,
        subject: "Welcome to Commconn! Please verify your email.",
        text: `Welcome to Commconn ${username}! Please verify your email.`,
        html: "Click here to verify account",
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};

sendVerificationEmail("ramiz.cop@gmail.com", "testuser").catch(console.error);
