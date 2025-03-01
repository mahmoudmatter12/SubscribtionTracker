import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import User from '../models/user.model.js';

export const authorize = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        // verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.userId);

        if (!user) return res.status(401).json({ message: 'Unauthorized here' });


        req.user = user;

        next();

    } catch (err) {
        res.status(401).json({ message: 'Unauthorized', error: err.message });
    }
}


// to test this middleware, we need to add it to the userRouter.get("/:id", authorize,getUser); route in routes/user.routes.js
// and then test the route with the token in the header.