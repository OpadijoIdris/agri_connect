import User from "../model/usermodel.js";
import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1]
    };
    if(!token){
        return res.status(401).json({message: "not authorized, no token"})
    };
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");

        if(!req.user){
            return res.status(401).json({message:"user not found"})
        }
        next()

    }catch(error){
        console.log("token verification failed:", error);
        return res.status(401).json({message: "not authorized, token failed"})
    }
};

export const admin = (req, res, next) => {
    if(req.user && req.user.role === "Admin"){
        next();
    }else{
        return res.status(401).json({message: "not authorized, not an admin"})
    }
};

export const farmer = (req, res, next) => {
    if(req.user && req.user.role === "Farmer"){
        next();
    }else{
        return res.status(500).json({message: "not authorized, not a Farmer"});
    }
}