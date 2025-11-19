import Product from "../model/productModel.js";
import Order from "../model/orderModel.js";

export const createOrder = async (buyerId, productId, quantity, deliveryAddress, paymentMethod) => {
    const product = Product.findById(productId);
    if(!product){
        throw new Error ("product not found")
    }
    if(product.quantity < quantity){
        throw new Error ("Not enough product in stock")
    }
    const totalPrice = product.price * quantity;

    const order = new Order({
        buyer: buyerId,
        seller: product.seller,
        product: productId, 
        quantity,
        totalPrice,
        deliveryAddress,
        paymentMethod,
        paymentStatus: paymentMethod === "cod"? "pending": "pending"
    });
    return order;

};

export const initializePaystackPayment = async (order) => {
    const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

    const payload = {
        email: order.buyer.email,
        amount: order.totalPrice * 100,
        metadata: {
            userId,
            cart
        }
    }
}