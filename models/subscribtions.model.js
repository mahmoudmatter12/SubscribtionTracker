import mongoose from "mongoose";    // Importing mongoose
import { DB_URI } from "../config/env.js";    // Importing DB_URI from env.js

// Creating a schema for the subscribtions
const subscribtionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Subscibtion Name is required"],
        trim: true,
        minLength: [3, "Name must be at least 3 characters long"],
        maxLength: [50, "Name must be at most 50 characters long"],
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price must be at least 0"],
        max: [1000, "Price must be at most 1000"],
    },
    startDate: {
        type: Date,
        required: [true, "Start date is required"],
    },
    endDate: {
        type: Date,
        required: [true, "End date is required"],
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User ID is required"],
    },
    currency: {
        type: String,
        required: [true, "Currency is required"],
        trim: true,
        enum: ["USD", "EUR", "EGP"],
        default: "USD",
        frequency: {
            type: String,
            enum: ["monthly", "yearly","daily"],
        },
    },
    catagory: {
        type: String,
        required: [true, "Catagory is required"],
        enum: ["Entertainment", "Education", "Health", "Food", "Other"],
    },
    status: {
        type: String,
        required: [true, "Status is required"],
        trim: true,
        enum: ["Active", "Cancelled", "Expired"],
        default: "Active",
    },
    paymentMethod: {
        type: String,
        required: [true, "Payment method is required"],
        trim: true,
        enum: ["Credit Card", "PayPal", "Cash"],
    },
    paymentDate: {
        type: Date,
        required: [true, "Payment date is required"],
    },
    startDate: {
        type: Date,
        required: [true, "Start date is required"],
        validator: (value) => { value <= new Date();},
        message: "Start date must be less than or equal to the current date",
    },
    renwalDate: {
        type: Date,
        validator: function (value)  {
            return value >= this.startDate;
        },
        message: "Renwal date must be greater than or equal to the start date",
    },
    user:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User ID is required"],
        index: true,
    }
}, { timestamps: true });
// timestamps: true adds createdAt and updatedAt fields to the schema

// Adding a pre-save middleware to check if the user exists
// before saving the subscribtion's data
// This middleware will run before the save() function
// and will check if the user exists in the database
// If the user does not exist, an error will be thrown  
subscribtionSchema.pre("save", async function (next) {
    const user = await User.findById(this.userId);
    if (!user) {
        throw new Error("User not found");
    }
    next();
});

// Adding a pre-save middleware to check if the start date
// is less than or equal to the current date
// This middleware will run before the save() function
// and will check if the start date is less than or equal to the current date
// If the start date is greater than the current date, an error will be thrown
subscribtionSchema.pre("save", async function (next) {
    if (this.isModified("status") && this.status === "Cancelled") {
        this.endDate = new Date();
    }
    next();
});

// auto caculate the renwal date
subscribtionSchema.pre("save", async function (next) {
    if (this.renwalDate){
        const renewalPeriod ={
            monthly: 30,
            yearly: 365,
            daily: 1,
        }
        this.renwalDate = new Date();
        this.renwalDate.setdate(this.renwalDate.getDate() + renewalPeriod[this.frequency]);
    }
    if (this.renwalDate < new Date()){
        this.status = "Expired";
    }
    next();
    // next() is a function that runs the next middleware in the middleware stack
});


// Creating a model for the subscribtions
const Subscribtion = mongoose.model("Subscribtion", subscribtionSchema);

// Exporting the Subscribtion model
export default Subscribtion;