import mongoose from "mongoose";

const subscribtionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Subscription Name is required"],
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
        validate: {
            validator: function (value) {
                return value <= new Date();
            },
            message: "Start date must be less than or equal to the current date",
        },
    },
    endDate: {
        type: Date,
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
    },
    frequency: {
        type: String,
        required: [true, "Frequency is required"],
        enum: ["monthly", "yearly", "daily"],
    },
    category: {
        type: String,
        required: [true, "Category is required"],
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
    },
    renewalDate: {
        type: Date,
        validate: {
            validator: function (value) {
                return value >= this.startDate;
            },
            message: "Renewal date must be greater than or equal to the start date",
        },
    },
}, { timestamps: true });

// Pre-save middleware to check if the user exists
subscribtionSchema.pre("save", async function (next) {
    const user = await mongoose.model("User").findById(this.userId);
    if (!user) {
        throw new Error("User not found");
    }
    next();
});

// Pre-save middleware to set endDate if status is "Cancelled"
subscribtionSchema.pre("save", function (next) {
    if (this.isModified("status") && this.status === "Cancelled") {
        this.endDate = new Date();
    }
    next();
});

// Pre-save middleware to calculate renewalDate
subscribtionSchema.pre("save", function (next) {
    if (this.frequency && this.startDate) {
        const renewalPeriod = {
            monthly: 30,
            yearly: 365,
            daily: 1,
        };
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriod[this.frequency]);
    }
    next();
});

const Subscribtion = mongoose.model("Subscribtion", subscribtionSchema);
export default Subscribtion;