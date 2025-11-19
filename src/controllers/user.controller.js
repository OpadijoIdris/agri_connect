import * as userServices from "../services/user.services.js";

export const createUser = async (req, res) => {
    const { name, phoneNumber, email, password, role, location } = req.body
    const user = await userServices.createUser(name, phoneNumber, email, password, role, location);

    if(!user){
        return res.status(400).json({message: "could not create user"})
    }
    res.status(201).json(user)
};

export const getAllUsers = async (req, res) => {
    const user = await userServices.getAllUsers();
    if(!user){
        return res.status(400).json({message: "could not get all users"})
    }
    res.status(200).json(user)
};

export const getUserById = async (req, res) => {
    const { id } = req.params;
    const user = await userServices.getUserById(id);
    if(!user){
        return res.status(404).json({message: "user not found"})
    }
    res.status(200).json(user);
};

export const updateUser = async (req, res) => {
    try{
        const { id } = req.params;
        const { name, email, phoneNumber, location } = req.body;
        const user = await userServices.updateUser(id, name, email, phoneNumber, location);
        if(!user){
            return res.status(400).json({message: "error updating user"})
        }
        res.status(200).json(user);

    }catch(error){
        console.log("internal server error", error.message)
        return res.status(500).json({status: false, 
                                    message: "could not update",
                                    error: error.message})
    }
};

export const deleteUser = async (req, res) => {
    try{
        const { id } = req.params;
        const user = await userServices.deleteUser(id);
        if(!user){
            return res.status(500).json({message: "could not delete user"})
        }
        res.status(200).json("successfully deleted this user");

    }catch(error){
        console.log("internal server error", error.message);
        return res.status(500).json({status: false, 
                                    message: "error deleting user"})
    }
};

export const deleteAllUser = async (req, res) => {
    const user = await userServices.deleteAllUser();
    if(!user){
        return res.status(400).json({message: "could not delete all user"})
    }
    res.status(200).json("successfully deleted all users")
};