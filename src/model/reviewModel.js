import mongoose, { Schema, model } from "mongoose"

const reviewSchema = new Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        default: ""
    }
}, { timestamps: true} );

reviewSchema.index({buyer: 1, product: 1}, {unique: true});

const Review = model("Review", reviewSchema);

export default Review;