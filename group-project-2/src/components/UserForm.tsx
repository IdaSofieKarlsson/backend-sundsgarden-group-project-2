import axios from "axios";
import { useState } from "react";
import "../styles/userForm.css";
import API_BASE_URL from "../api";
//import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const UserForm = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    
    const navigate = useNavigate();

    const createUser = async () => {
        try {
            await axios.post(`${API_BASE_URL}/api/users`, { firstName, lastName, email });
            alert("Account created");
            navigate("/users");
        } catch (err) {
            console.error("Failed to create account: ", err);
        }
    };

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        createUser();
    };

    return (
        <div className="container-userform" >
            <form className="container-form" onSubmit={handleSubmit}>
                <h2>Register to play our games!</h2>
                <label className="container-label">
                    Email *{" "}
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Your email"/>
                    First Name *{" "}
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required placeholder="Your first name"/>
                    Last Name *{" "}
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required placeholder="Your last name"/>
                </label>
                <div className="container-button"><button type="submit">Register Account</button></div>
                
            </form>        
        </div>
    );
};

export default UserForm;
