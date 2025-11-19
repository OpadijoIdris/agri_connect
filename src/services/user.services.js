import User from "../model/usermodel.js";

export const createUser = async (name, phoneNumber, email, password, role, location) => {
    const user = new User({
        name, 
        phoneNumber, 
        email,
        password, 
        role,
        location
    })
    await user.save()
    return user
};

export const getAllUsers = async () => {
    const user = await User.find();
    return user;
};

export const getUserById = async (id) => {
    const user = await User.findById(id);
    return user;
};

export const updateUser = async (id, name, email, phoneNumber, location) => {
    try{
        const user = await User.findByIdAndUpdate(id, {name: name, 
                                                email: email, 
                                                phoneNumber: phoneNumber, 
                                                location: location}, 
                                                {new: true, runValidators: true});

        return user;
        

    }catch(error){
        console.log("could not edit user details")
    }
};

export const deleteUser = async (id) => {
    const user = await User.findByIdAndDelete(id);
    return user;
};

export const deleteAllUser = async () => {
    const user = await User.deleteMany({});
    return user;
};