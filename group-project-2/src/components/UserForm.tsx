import axios from "axios";
import { useState } from "react";

const UserForm = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    
    const createUser = async () => {
        try {
            await axios.post("https://backend-sundsgarden-group-project-2-gules.vercel.app/register", { firstName, lastName, email });
            alert("Account created");
        } catch (err) {
            console.error("Failed to create account: ", err);
        }
    }

    return (
        <div className="" >
            <form 
                onSubmit={(e) => {
                    e.preventDefault();
                    createUser();
                }}
            >
                <h2>Register for access to play our games!</h2>
                <p>First you have to register an account, then you can log in and play.</p>
                <p>Note: this is a student assignment, we can see your password in our database, so pick something you never use anywhere else. "abc123" is ok.</p>
                <label>
                    First Name:{" "}
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required placeholder="Your first name"/>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required placeholder="Your last name"/>
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Your email"/>
                </label>
                <button type="submit">Create Account</button>
            </form>        
        </div>
    )
};

export default UserForm;
