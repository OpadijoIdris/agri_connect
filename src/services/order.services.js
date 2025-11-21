import Order from "../model/orderModel.js";
import Cart from "../model/cartModel.js";
import axios from "axios";

export const  createOrder = async (userId, paymentMethod, deliveryAddress) => {
    try{
        const cart = await Cart.findOne({ user: userId}).populate("items.product");
        if(!cart || cart.items.length === 0){
            throw new Error ("cart is empty")
        };

        const farmerId = cart.items[0].product.seller;

        const totalPrice = cart.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

        const orderItems = cart.items.map((item) => ({
            product: item.product._id,
            farmer: farmerId,
            quantity: item.quantity,
            price: item.price
        }));

        const order = await Order.create({
            buyer: userId,
            farmer: farmerId,
            items: orderItems,
            totalAmount: totalPrice,
            deliveryAddress,
            paymentMethod,
            paymentStatus: paymentMethod === "cod"? "pending": "pending"
        });
        await Cart.deleteOne({user: userId});

        return order;

    }catch(error){
        console.log(error.message)
        throw new Error("error creating order")
    }


};

export const initializePayment = async (email, amount, orderId) => {
    try{
        const data = {
            email, 
            amount: amount * 100,
            metadata: {
                orderId
            },
            callback_url: "http://localhost:5000/api/payment/verify"
        };

        const response = await axios.post("https://api.paystack.co/transaction/initialize", data, {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, 
                "Content-Type": "application/json",
            }
        });
        return response.data;

    }catch(error){
        console.log(error.response.data)
        throw new Error (`Paystack initialization failed: ${error.message}`);
    }
};

export const verifyPayment = async (reference) => {
    try{
        const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
            }
        });

        const paymentData = response.data;

        if(paymentData.data.status !== "success"){
            throw new Error ("Payment was not successful")
        };

        const orderId = paymentData.data.metadata.orderId;

        const order = await Order.findByIdAndUpdate(orderId, {paymentStatus: "paid", orderStatus: "processing"}, {new: true});
        if(!order){
            throw new Error ("Order not found")
        };

        return order;


    }catch(error){
        console.log(error.response.data || error.message);
        throw new Error (`Payment verification failed: ${error.message}`)
    }
}