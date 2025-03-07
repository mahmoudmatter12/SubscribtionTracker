import { DB_URI,NODE_ENV } from "../config/env.js";

import mongoose from 'mongoose';

if (!DB_URI) {
    console.error('MongoDB URI is missing. Please check your environment variables');
    process.exit(1);
}

const ConnectToDatabase = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log('Connected to the database in the ' + NODE_ENV + ' environment');
    } catch (error) {
        console.error('Error connecting to the database: ', error);
        process.exit(1);
    }
}

export default ConnectToDatabase;