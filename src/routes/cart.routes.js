import { Router } from "express";
import { addToCart, getCart, removeFromCart, clearCart } from "../controllers/cart.controller.js";
import { protect, admin, farmer } from "../middleware/auth.js";



const router = Router();

router.post("/", protect, addToCart);
router.get("/", protect, getCart);
router.delete("/clear", protect, clearCart);
router.delete("/:productId", protect, removeFromCart);


export default router;