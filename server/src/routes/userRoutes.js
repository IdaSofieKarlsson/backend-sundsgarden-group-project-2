import express from "express";

 // insert controller functions here when needed
import {
    getAllUsers,
    createUser,
    getUserByID
} from "../controllers/userController.js";

const router = express.Router();
// Define routes here
router.get("/", getAllUsers);
router.get("/:id", getUserByID);
router.post("/", createUser);

export default router;
