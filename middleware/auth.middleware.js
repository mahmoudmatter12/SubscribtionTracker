import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import User from '../models/user.model.js';

export const authorize = async (req, res, next) => {
    try {
        let token;
        console.log(req.headers.authorization)
        // Check for token in headers
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // Check for token in cookies
        if (!token && req.cookies.token) {
            token = req.cookies.token;
        }

        // If no token is found
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized, token missing' });
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Find the user
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized, user not found' });
        }

        // Attach the user to the request object
        req.user = user;

        // Proceed to the next middleware/route handler
        next();
    } catch (err) {
        console.error('Authorization error:', err.message);
        // Handle token verification errors and other exceptions
        res.status(401).json({ message: 'Unauthorized', error: err.message });
    }
};

export default authorize;