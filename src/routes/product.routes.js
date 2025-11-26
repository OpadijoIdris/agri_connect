import { Router } from "express";
import upload from "../middleware/multer.js";
import { createProduct, updateProduct,getAllProducts, getProductById, deleteProduct, deleteAllProduct, searchProduct } from "../controllers/product.controller.js";
import { protect, admin, farmer } from "../middleware/auth.js";

const router = Router();

router.post("/", protect, farmer, upload.array("images", 5), createProduct);
router.put("/update/:id",protect, farmer, upload.array("images", 5), updateProduct);
router.get("/", protect, getAllProducts);
router.get("/search", protect, searchProduct);
router.get("/:id", protect, getProductById);
router.delete("/:id", protect, farmer, deleteProduct);
router.delete("/", protect, farmer, deleteAllProduct);


export default router;

