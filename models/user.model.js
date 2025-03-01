import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minLength: [3, "Name must be at least 3 characters long"],
        maxLength: [50, "Name must be at most 50 characters long"],
    },
    email:{
        type: String,
        required: [true, "Email is required"],
        trim: true,
        unique: true,
        lowercase: true,
        minLength: [5, "Email must be at least 5 characters long"],
        maxLength: [50, "Email must be at most 50 characters long"],
        match: [/.+\@.+\..+/, "Please fill a valid email address"], 
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [8, "Password must be at least 8 characters long"]
    }
}, { timestamps: true });
// timestamps: true adds createdAt and updatedAt fields to the schema

const User = mongoose.model("User", userSchema);

export default User;