import { createOrder, initializePayment, verifyPayment } from "../controllers/order.controller.js";
import { Router } from "express";
import { protect, admin, farmer } from "../middleware/auth.js";

const router = Router();

router.post("/", protect, createOrder);
router.post("/initialize", protect, initializePayment);
router.post("/verify", protect, verifyPayment)

export default router; 