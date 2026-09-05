const crypto = require('crypto');
const sendOTPEmail = require('../../utils/sendEmail');

const otpStore = new Map();

/*
SEND OTP
*/
const sendOTP = async (req, res) => {

    try {


        const { email } = req.body;


        if (!email) {

            return res.status(400).json({
                success: false,
                message: 'Email is required',
            });

        }


        /*
          Generate 6 digit OTP
        */
        const otp = crypto
            .randomInt(100000, 999999)
            .toString();


        /*
          OTP expires in 5 minutes
        */
        const expiresAt =
            Date.now() + 5 * 60 * 1000;


        /*
          Store OTP temporarily
        */
        otpStore.set(email, {
            otp,
            expiresAt,
        });


        /*
          Send OTP Email
        */
        await sendOTPEmail(
            email,
            otp
        );


        return res.status(200).json({

            success: true,

            message:
                'OTP sent successfully to your email',

        });


    } catch (error) {


        console.error(
            'Send OTP Error:',
            error
        );


        return res.status(500).json({

            success: false,

            message:
                'Failed to send OTP',

            error:
                error.message,

        });

    }

};

/*
VERIFY OTP
*/
const verifyOTP = async (req, res) => {

    try {


        const {
            email,
            otp,
        } = req.body;


        if (!email || !otp) {

            return res.status(400).json({

                success: false,

                message:
                    'Email and OTP are required',

            });

        }


        /*
          Get stored OTP
        */
        const storedData =
            otpStore.get(email);


        if (!storedData) {

            return res.status(400).json({

                success: false,

                message:
                    'OTP not found. Please request a new OTP.',

            });

        }


        /*
          Check expiration
        */
        if (
            Date.now() >
            storedData.expiresAt
        ) {

            otpStore.delete(email);


            return res.status(400).json({

                success: false,

                message:
                    'OTP expired. Please request a new OTP.',

            });

        }


        /*
          Check OTP
        */
        if (
            storedData.otp !== otp
        ) {

            return res.status(400).json({

                success: false,

                message:
                    'Invalid OTP',

            });

        }


        /*
          Delete OTP after successful verification
        */
        otpStore.delete(email);


        return res.status(200).json({

            success: true,

            message:
                'OTP verified successfully',

            user: {
                email,
            },

        });


    } catch (error) {


        console.error(
            'Verify OTP Error:',
            error
        );


        return res.status(500).json({

            success: false,

            message:
                'OTP verification failed',

        });


    }

};

module.exports = {

    sendOTP,

    verifyOTP,

};
