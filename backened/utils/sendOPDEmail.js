const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendOPDEmail = async ({
    email,
    name,
    tokenNumber,
    department,
    appointmentDate,
    estimatedTime,
    queuePosition,
    status
}) => {
    try {
        await transporter.sendMail({
            from: `"Abhimanyu Health Assistant" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "OPD Token Generated Successfully",

            html: `
                <div style="font-family: Arial; max-width: 600px; margin: auto; padding: 30px;">

                    <h2 style="color:#2f80ed;">
                        Abhimanyu Health Assistant
                    </h2>

                    <p>Hello <b>${name}</b>,</p>

                    <p>Your OPD token has been successfully generated.</p>

                    <hr>

                    <h3>OPD Appointment Details</h3>

                    <p>
                        <b>Token Number:</b>
                        <span style="font-size: 24px;">
                            ${tokenNumber}
                        </span>
                    </p>

                    <p>
                        <b>Department:</b> ${department}
                    </p>

                    <p>
                        <b>Appointment Date:</b>
                        ${new Date(appointmentDate).toLocaleDateString("en-IN")}
                    </p>

                    <p>
                        <b>Estimated Time:</b> ${estimatedTime}
                    </p>

                    <p>
                        <b>Queue Position:</b> ${queuePosition}
                    </p>

                    <p>
                        <b>Status:</b> ${status}
                    </p>

                    <hr>

                    <p>
                        Please reach the hospital before your estimated
                        consultation time.
                    </p>

                    <p>
                        Thank you for using <b>Abhimanyu Health Assistant</b>.
                    </p>

                </div>
            `
        });

        console.log("OPD email sent successfully");

        return true;

    } catch (error) {
        console.error("OPD Email Error:", error);
        throw error;
    }
};

module.exports = sendOPDEmail;