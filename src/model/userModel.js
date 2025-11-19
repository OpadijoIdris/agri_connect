import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String, 
        required: true, 
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true, 
        unique: true,
        trim: true
    },
    password: {
        type: String, 
        required: true
    },
    role: {
        type: String, 
        enum: ["Farmer", "Buyer", "Admin"],
        default: "Buyer"
    },
    location: {
        type: String,
        trim: true,
        required: true
    },
    cart: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: "Products"
            },
            quantity: {
                type: Number, 
                default: 1
            }
        }
    ],
    profilePicture: {
        type: String,
        default: ""
    },
    otp: {
        type: String,
    },
    otpExpiresAt: {
        type: Date,
    },
    isVerified: {
        type: Boolean, 
        default: false
    }

}, {timestamps: true} )

const User = model ("User", userSchema);

export default User;