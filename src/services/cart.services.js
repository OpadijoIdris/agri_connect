import Cart from "../model/cartModel.js";
import Product from "../model/productModel.js";

export const addToCart = async (userId, productId, quantity) => {
    try{
        const product = await Product.findById(productId);
        if(!product){
            throw new Error ("Product not found")
        };

        let cart = await Cart.findOne({user: userId});
        const price = product.price;

        if(!cart){
            cart = await Cart.create({
                user: userId,
                items: [{product: productId, quantity: quantity, price}],
                totalAmount: price * quantity
            });
            return cart;
        }

        const existingItem = cart.items.find(item => item.product.toString() === productId.toString());
        if(existingItem){
            existingItem.quantity += quantity
        }else{
            cart.items.push({product: productId, quantity: quantity, price})
        }
        cart.totalAmount = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        await cart.save();
        return cart;

    }catch(error){
        console.log("an error occured", error.message)
        throw new Error ("could not add product to cart")
    }
};

export const getCart = async (userId) => {
    try{
        const cart = await Cart.findOne({user: userId}).populate("items.product");
        return cart;

    }catch(error){
        console.log("an error occured", error.message);
        throw new Error ("could not get cart")
    }
};

export const removeFromCart = async (userId, productId) => {
    try{
        const cart = await Cart.findOne({user: userId});
        if(!cart){
            throw new Error ("cart not found")
        };
        cart.items = cart.items.filter(item => item.product.toString() !== productId.toString())
        
        cart.totalAmount = cart.items.reduce((acc, items) => acc + items.price * items.quantity, 0 ) ;

        await cart.save();
        return cart;


    }catch(error){
        console.log("error removing from cart", error.message);
        throw new Error ("could not remove from cart")
    }
};

export const clearCart = async (userId) => {
    try{
        const cart = await Cart.findOne({user: userId});
         if(!cart){
            return null
         }
        cart.items = []; 
        cart.totalAmount = 0;

        await cart.save();
        return cart

    }catch(error){
        console.log("error clearing cart", error.message);
        throw new Error ("coud not clear cart")
    }
}