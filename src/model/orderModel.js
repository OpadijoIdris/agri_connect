import mongoose, { Schema, model } from "mongoose";

const orderItemSchema = new Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: {
        type: Number, 
        required: true, 
        min: 1
    },
    price: {
        type: Number,
        required: true
    }
    
}, {_id: false});

const orderSchema = new Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: {
        type: [orderItemSchema],
        validate: v=> Array.isArray(v) && v.length > 0
    },
    totalAmount: {
        type: Number,
        required: true
    },
    deliveryAddress: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String, 
        enum: ["paystack", "cod"],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed", "refunded"],
        default: "pending"
    },
    orderStatus: {
        type: String,
        enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
        default: "pending"
    }
}, {timestamps: true});

const Order = model("Order", orderSchema);

export default Order;