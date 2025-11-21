import * as orderServices from "../services/order.services.js";
import Order from "../model/orderModel.js";

export const createOrder = async (req, res) => {
    try{
        const userId = req.user.id;
        const { paymentMethod, deliveryAddress } = req.body;

        const order = await orderServices.createOrder(userId, paymentMethod, deliveryAddress);

        return res.status(201).json({success: true, message: "Order created successfully", order})

    }catch(error){
        return res.status(500).json({success: false, message: error.message})
    }
}; 

export const initializePayment = async (req, res) => {
    try{
        const userId = req.user.id;
        const {orderId} = req.body;

        if(!orderId){
            return res.status(404).json({message: "OrderId is required"})
        };
        const order = await Order.findOne({_id: orderId, buyer: userId}).populate("buyer")
        if(!order){
            return res.status(400).json({message: "Order not found"})
        }
        const payment = await orderServices.initializePayment(
            order.buyer.email,
            order.totalAmount,
            order._id.toString()
        )

        return res.status(200).json({
            success: true,
            authorization_url: payment.data.authorization_url,
            access_code: payment.data.access_code,
            reference: payment.data.reference
        });

    }catch(error){
        return res.status(500).json({message: error.message})
    }
};

export const verifyPayment = async (req, res) => {
    try{
        const {reference} = req.body;
        if(!reference){
            return res.status(400).json({message: "reference of payment is required"})
        };
        const order = await orderServices.verifyPayment(reference);
        return res.status(200).json({success: true, message: "payment verified and order Updated", order})

    }catch(error){
        return res.status(500).json({message: error.message})
    }
};