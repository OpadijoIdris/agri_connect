import Review from "../model/reviewModel.js";
import Order from "../model/orderModel.js";
import Product from "../model/productModel.js";

export const updateReview = async (userId, productId, rating, comment) => {
    try{
        const product = await Product.findOne(productId);
        if(!product){
            throw new Error ("product not found")
        };
        const isPaid = await Order.findOne({ buyer: userId, 
                                            paymentStatus: "paid", 
                                            "items.product": productId});
        if(!isPaid){
            throw new Error ("you must purchase before you rate")
        };
        const existing = await Review.findOne({ user: userId, product: productId });
        if(existing){
            throw new Error ("you cant rate this product again because you have rated it already")
        };
        const review = Review.create({
            user: userId,
            product: productId,
            rating,
            comment,
        })
        const reviews = await Review.find({ product: productId});
        const avgRating = reviews.reduce((acc, r) => acc + r.rating / reviews.length);
        product.ratings = avgRating;
        await product.save();

        return review;



    }catch(error){
        console.log(error.message);
        throw new Error ("could not rate")
    }
}