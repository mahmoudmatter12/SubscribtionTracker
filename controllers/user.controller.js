import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRE_IN } from "../config/env.js";
import mongoose from "mongoose";
export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json({
            success: true,
            data: users,
        });
    }
    catch (error) {
        next(error);
    }
};

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select("-password");

        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            data: user,
        });

    }
    catch (error) {
        next(error);
    }
};

export const createUser = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction(); // session for mongoose we will perform Atomic Transactions -> Atomicity is a property of database transactions that guarantees that all the operations within a transaction are completed successfully, or none of them are. All Or Nothing
    try {

        // Take the params from the request body
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            const error = new Error('User already exists');
            error.statusCode = 409;
            throw error;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create a new user
        // if there is any error then the user will not be created and the transaction will be aborted and we passed the session  
        const newUsers = await User.create([{ name, email, password: hashedPassword }],{ session });

        // Token generation
        const token = jwt.sign({ email: newUsers[0].email, userId: newUsers[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE_IN });


        // Save the user to the database
        await newUsers[0].save({ session });
        await session.commitTransaction();
        session.endSession();

        const experInJwt = parseInt(JWT_EXPIRE_IN, 10);

        // set the cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: experInJwt * 1000
        });

        // Send a response back to the client
        res.status(201).json({
            message: "User created successfully", success: true, data: {
                token,
                user: newUsers[0]
            }
        });
    }
    catch (error) {
        next(error);
    }
};