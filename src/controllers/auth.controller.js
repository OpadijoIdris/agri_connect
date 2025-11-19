import * as authServices from "../services/auth.services.js";

export const register = async (req, res) => {
    const { name, phoneNumber, email, password, role, location } = req.body;
    try{
        const user = await authServices.register(name, phoneNumber, email, password, role, location)
        if(!user){
            return res.status(400).json({message: "could not register"})
        }
        res.status(201).json(user);

    }catch(error){
        console.log("internal server error, could not register...", error.message)
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try{
        const user = await authServices.login(email, password);
        if(!user){
            return res.status(400).json({message: "could not login"})
        }
        res.status(200).json(user);

    }catch(error){
        console.log("internal server error", error.message)
    };
};