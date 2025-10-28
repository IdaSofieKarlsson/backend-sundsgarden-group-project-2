import express from "express";

 // insert controller functions here when needed
import {
    getAllUsers,
    getUserByEmail,
    createUser,
} from "../controllers/userController.js";

const router = express.Router();
// Define routes here
router.get("/users", getAllUsers);
router.get("/users", getUserByEmail);
router.post("/users", createUser);

export default router;
