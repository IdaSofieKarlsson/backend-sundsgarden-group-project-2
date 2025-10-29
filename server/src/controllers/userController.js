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
//function for getting user by email from db and comparing email with password for login
export const getUserByEmail = async (req, res) => {
    try {
        const filteredUsers = await User.find({ email: "a@exemple.com" });
        res.json(filteredUsers);
    } catch (error) {
        res.status(500).json({
            error: "Invalid email address or not a registered user by this email",
        });
    }
};

export const createUser =  async (req, res) => {
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
