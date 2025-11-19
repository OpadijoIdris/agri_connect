import Cart from "../model/cartModel.js";
import * as cartServices from "../services/cart.services.js";

export const addToCart = async (req, res) => {
    try{
        const { productId, quantity } = req.body;
        const cart = await cartServices.addToCart(req.user._id, productId, quantity);

        if(!cart){
            return res.status(400).json({message: "error adding to cart"})
        }
        res.status(200).json(cart);


    }catch(error){
        res.status(500).json({message: error.message})
        throw new Error ("could not add to cart")
        
    };
};

export const getCart = async (req, res) => {
    try{
        const userId = req.user.id;
        const cart = await cartServices.getCart(userId)
        if(!cart){
            return res.status(400).json({message: "could get cart"})
        }
        res.status(200).json(cart);

    }catch(error){
        res.status(500).json({message: error.message});
        throw new Error("could not cart")
    }
};

export const removeFromCart = async (req, res) => {
    try{
        const userId = req.user.id;
        const productId = req.params.productId;

        const cart = await cartServices.removeFromCart(userId, productId);
        if(!cart){
            return res.status(400).json({message: "could not remove from cart"})
        }
        if(cart === "DELETED"){
            res.status(200).json({message: "item removed", cart});
        }
        

    }catch(error){
        res.status(500).json({message: error.message});
    }
};

export const clearCart = async (req, res) => {
    try{
        const userId = req.user.id;
        const cart = await cartServices.clearCart(userId);
        if(!cart){
            return res.status(404).json({message: "could not get cart for this user"})
        }
        res.status(200).json({ message: "cart cleared successfully", cart});

    }catch(error){
        res.status(500).json({message: error.message})
    }
};

