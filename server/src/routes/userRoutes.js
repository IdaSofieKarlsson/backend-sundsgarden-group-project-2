import express from "express";

 // insert controller functions here when needed
import {
    getAllUsers,
    createUser,
} from "../controllers/userController.js";

const router = express.Router();
// Define routes here
router.get("/", getAllUsers);
router.post("/", createUser);

export default router;
