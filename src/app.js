import express from "express";
import setUpMiddleware from "./middleware/middleware.js";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";
import orderRouter from "./routes/order.routes.js";

const PORT = 3000;
const app = express();

setUpMiddleware(app);
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);


app.get("/", (req, res) => {
    res.json({
        "name": "idris",
        timestamp: new Date().toLocaleDateString()
    })
});

app.listen(PORT, () => {console.log(`app currently running on PORT ${PORT}`)});

export default app