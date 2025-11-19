import User from "../model/usermodel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import sendEmail from "./mail.services.js";

export const register = async (name, phoneNumber, email, password, role, location) => {
    try{
        if(!name || !phoneNumber || !email || !password || !location){
            return {success: false, message: "all fields are required"}
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new User ({
            name,
            phoneNumber,
            email,
            password: hashedPassword,
            role,
            location,

        })
        await user.save();
        // the mail options
        return user 

    }catch(error){
        console.log("could not register", error.message)
    }
};

export const login = async (email, password) => {
    try{
        const user = await User.findOne({email});
        if(!user){
            return {error: "user not found"}
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return {error: "incorrect password"}
        }
        const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: "1hr"});
        return {user, token}

    }catch(error){
        console.log("could not login", error.message);
        return {error: "login failed"}
    };
    
};