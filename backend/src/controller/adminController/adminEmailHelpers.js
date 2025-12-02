import transporter from "../../config/mail.js";

export function sendBanNotificationEmail(toEmail) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: "Your Student Marketplace account has been banned",
        text:
            "Your Student Marketplace account has been banned for violating our terms and conditions. " +
            "If you believe this is a mistake or want more information, please contact the admin panel.",
        html: `
      <p>Dear user,</p>
      <p>
        Your <b>Student Marketplace</b> account has been <b>banned</b> for violating our
        terms and conditions.
      </p>
      <p>
        If you believe this is a mistake or would like more information, please contact the
        admin panel.
      </p>
      <p>Regards,<br/>Student Marketplace Admin Team</p>
    `,
    };

    return transporter.sendMail(mailOptions);
}

export function sendPostRemovalEmail(toEmail, postName, postType) {
    const prettyType =
        postType === "event"
            ? "event post"
            : postType === "market"
                ? "marketplace post"
                : "post";

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: "Your post has been removed from Student Marketplace",
        text:
            `Your ${prettyType} "${postName}" has been removed for violating our terms and conditions. ` +
            "If you believe this is a mistake or want more information, please contact the admin panel.",
        html: `
      <p>Dear user,</p>
      <p>
        Your ${prettyType} <b>"${postName}"</b> has been removed for violating our
        terms and conditions.
      </p>
      <p>
        If you believe this is a mistake or would like more information, please contact the
        admin panel.
      </p>
      <p>Regards,<br/>Student Marketplace Admin Team</p>
    `,
    };

    return transporter.sendMail(mailOptions);
}
