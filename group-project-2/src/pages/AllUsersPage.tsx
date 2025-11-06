import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../api";
import "../styles/AllUsersPage.css";
import UserProfile from "../components/UserProfile";
import type { UserForProfile } from "../interfaces/user";

function AllUsersPage() {
  const navigate = useNavigate();
  const navToRegPage = () => {
    
    navigate("/");
  };
  
  const [users, setUsers] = useState<UserForProfile[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/users`)
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  return (
    <div>
      <div>
      <button onClick={navToRegPage}>Add User</button>
    </div>
      <h2>All Users</h2>

      {users.map(user => (
        <UserProfile
          key={user._id}
          firstName={user.firstName}
          lastName={user.lastName}
        />
      ))}
    </div>
  );
}

export default AllUsersPage;
