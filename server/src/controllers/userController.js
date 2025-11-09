// import the users from models and define controller functions

import User from "../models/userModel.js";

//can now take this function and user elsewhere
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({
            error: "Failed to get user", 
        });
    }
};
//function for getting user by id from db
export const getUserByID = async (req, res) => {
    const id = req.params.id;
    
    try {
        const user = await User.findById({ _id: id });
        res.json(user);
    } catch (error) {
        res.status(500).json({
            error: "Invalid input, cannot find a user by this ID.",
        });
    }
};

export const createUser = async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.json(newUser);
    } catch (error) {
        res.status(500).json({
            error: "Failed to create new user", 
        });
    }
};
