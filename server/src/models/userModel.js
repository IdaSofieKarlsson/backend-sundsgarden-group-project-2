// Here we create the user schema and model
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true, minlength: 1 },
    lastName: { type: String, required: true, minlength: 1 },
    email: { type: String, required: true, minlength: 1 },
    id: { type: String, required: false },
});

const User = mongoose.model("User", userSchema);

export default User;
