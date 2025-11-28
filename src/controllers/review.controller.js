import * as reviewServices from "../services/review.services.js";

export const updateReview = async (req, res) => {
    try{
        const userId = req.params.id;
        const { rating, comment } = req.body;
        const productId = req.params.productId;


        const review = await reviewServices.updateReview(userId, productId, rating, comment);

        if(!review){
            res.status(400).json({message: "could not review"})
        }
        res.status(200).json({
            success: true,
            message: "Review submitted",
            review
        });

    }catch(error){
        res.status(500).json({message: error.message})
    }
};