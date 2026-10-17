const jwt = require('jsonwebtoken');
const Doctor = require('../models/doctor.model');

/**
 * Middleware to protect private routes
 * Verifies the incoming Bearer JWT and adds the authenticated Doctor to the request object
 */
exports.protect = async (req, res, next) => {
    try {
        let token;

        // 1. Check if token exists in the Authorization header
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                status: 'fail',
                message: 'You are not logged in. Please log in to get access.'
            });
        }

        // 2. Verify token validity
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'your_fallback_secret_key_32_chars_long'
        );

        // 3. Check if the doctor profile still exists in the database
        const currentDoctor = await Doctor.findById(decoded.id);
        if (!currentDoctor) {
            return res.status(401).json({
                status: 'fail',
                message: 'The doctor belonging to this token no longer exists.'
            });
        }

        // 4. Check if the doctor's account is still active
        if (!currentDoctor.isActive) {
            return res.status(403).json({
                status: 'fail',
                message: 'Your account is deactivated. Access denied.'
            });
        }

        // 5. Grant access to the protected route and attach doctor info to req.user
        req.user = currentDoctor;
        next();

    } catch (err) {
        // Catch expired token issues or invalid token signatures cleanly
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                status: 'fail',
                message: 'Your token has expired. Please log in again.'
            });
        }

        return res.status(401).json({
            status: 'fail',
            message: 'Invalid token signature. Authentication failed.'
        });
    }
};
