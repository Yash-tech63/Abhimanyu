const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendOTPEmail = async (email, otp) => {
    try {
        await transporter.sendMail({
            from: `"Abhimanyu Health Assistant" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Your Abhimanyu OTP Verification Code',


            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #eeeeee; border-radius: 15px;">

            <h2 style="color:#2f80ed;">
                Abhimanyu Health Assistant
          </h2>

      <p>Your OTP verification code is:</p>

      <div style="
        font-size: 32px;
        font-weight: bold;
        letter-spacing: 8px;
        color: #2f80ed;
        padding: 20px;
        text-align: center;
        background: #f4f9ff;
        border-radius: 10px;
      ">
        ${otp}
      </div>

      <p style="margin-top:20px;">
        This OTP will expire in <b>5 minutes</b>.
      </p>

      <p>
        Do not share this OTP with anyone.
      </p>

    </div>
    `,
        });

        console.log('OTP email sent successfully');

        return true;


    } catch (error) {


        console.error('Email Error:', error);

        throw error;


    }
};

module.exports = sendOTPEmail;
