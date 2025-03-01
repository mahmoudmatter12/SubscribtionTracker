import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRE_IN } from "../config/env.js";

/**
 * @module controllers/auth.controller
 * @requires express-validator
 * @requires bcrypt
 * @requires jwt
 * @requires express-jwt
 * @requires dotenv
 * @requires models/user.model
 * @requires config
 * @requires utils
 * @requires mail
 * @requires helpers
 * @requires http-status
 * Here we are making the logic for the authentication of the user.
 * We are using the User model to interact with the database.
 * We are using the bcrypt library to hash the password and jwt library to generate the token.
 * We are using the express-validator library to validate the request body.
 * We are using the express-jwt library to verify the token. We are using the dotenv library to get the environment variables.
 */

// What is the req body here? -> The request body is an object containing the parameters sent by the client in the body of the request. In this case, the request body contains the email and password of the user with the method of POST.
// What is the res object here? -> The res object is an object representing the HTTP response that the server sends back to the client. In this case, the res object is used to send a response back to the client with a status code and a message.

export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction(); // session for mongoose we will perform Atomic Transactions -> Atomicity is a property of database transactions that guarantees that all the operations within a transaction are completed successfully, or none of them are. All Or Nothing
    try {
        // Logic here is to create a new user with the email and password provided in the request body.
        // First, we check if the user already exists in the database.
        // If the user exists, we return a 400 status code with a message "User already exists".
        // If the user does not exist, we hash the password using the bcrypt library.
        // Then we create a new user with the email and hashed password.

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
        const newUsers = await User.create([{ name, email, password: hashedPassword }], { session });

        // Token generation
        const token = jwt.sign({ email: newUsers[0].email, userId: newUsers[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE_IN });


        // Save the user to the database
        await newUsers[0].save({ session });
        await session.commitTransaction();
        session.endSession();

        // Send a response back to the client
        res.status(201).json({
            message: "User created successfully", success: true, data: {
                token,
                user: newUsers[0]
            }
        });

    } catch (error) {
        next(error);
        await session.abortTransaction();
        session.endSession();
    }
};

export const signIn = async (req, res, next) => {
    try {

        // Logic here is to sign in the user with the email and password provided in the request body.
        // First, we check if the user exists in the database.
        // If the user does not exist, we return a 400 status code with a message "User not found".
        // If the user exists, we compare the password provided in the request body with the hashed password in the database.
        // If the passwords match, we generate a token using the jwt library and send it back to the client.
        // If the passwords do not match, we return a 401 status code with a message "Invalid credentials".

        // Take the params from the request body
        const { email, password } = req.body;

        // Find the user
        const user = await User.findOne({ email });

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            const error = new Error('Invalid credentials');
            error.statusCode = 401;
            throw error;
        }

        // Token generation
        const token = jwt.sign({ email: user.email, userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE_IN });

        // Send a response back to the client
        res.status(200).json({
            message: "User signed in successfully", success: true,
            data: {
                token,
                user
            }
        });

    } catch (error) {
        next(error);
    }

};

export const signOut = async (req, res, next) => {

};

