import * as orderServices from "../services/order.services.js";

export const createOrder = async (req, res) => {
    try{
        const {productId, quantity, deliveryAddress, paymentMethod} = req.body;
        const buyerId = req.user.id;
        const order = await orderServices.createOrder(productId, quantity, deliveryAddress, paymentMethod, buyerId);
        if(paymentMethod === "paystack")

        if(!order){
            return res.status(400).json({message: 'could not create order'})
        }
        res.status(201).json(order);


    }catch(error){
        res.status(500).json({message: error.message})
    }
}