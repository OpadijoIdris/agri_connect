import { updateReview } from "../controllers/review.controller.js";
import { Router } from "express";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/:productId", protect, updateReview);

export default router;