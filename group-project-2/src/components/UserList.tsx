import { useState, useEffect } from "react";
import axios from "axios";
import type { User } from "../interfaces/userType.ts";

const UserList = () => {

    const [users, setUsers] = useState<User[]>([]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("https://backend-sundsgarden-group-project-2-gules.vercel.app/");
            setUsers(response.data);
        } catch (err) {
            console.error("failed to fetch users; ", err);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);


    return (
            <div>
                <h2>Users</h2>
                <table>
                    <thead>
                        <tr><th>First Name</th><th>Last Name</th><th>Email</th></tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>{user.firstName}</td>
                                <td>{user.lastName}</td>
                                <td>{user.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
};

export default UserList;