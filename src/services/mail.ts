import nodemailer from "nodemailer"

type SendMailOptions = {
    to: string
    subject: string
    html: string
    text?: string
}
 
let transporter: nodemailer.Transporter

export const getTransporter = () => {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.NODEMAILER_USER,
                pass: process.env.NODEMAILER_APP_PASSWORD,
            },
        })
    }
    return transporter
}

export const sendEmail = async ({ to, subject, html, text }: SendMailOptions) => {
    const transporter = getTransporter()

    try {
        const info = await transporter.sendMail({
            from: `"AWL India" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
            to,
            subject,
            text,
            html,
        })

        console.log("✅ Email sent:", info.messageId)
        return { success: true, messageId: info.messageId }
    } catch (error) {
        console.error("❌ Email failed:", error)
        return { success: false, error }
    }
}
