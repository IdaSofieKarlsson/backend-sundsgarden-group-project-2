import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../api";
import type { User } from "../interfaces/user.ts";

function SearchUser() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const goToUser = (_id: string) => {
    navigate(`/user-overview/${_id}`);
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/users`)
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  const filteredUsers = search
    ? users.filter((user) =>
        user.firstName.toLowerCase().includes(search.toLowerCase())
      )
    : [];

    return (
    <div style={{ position: "relative", width: "250px", margin: "40px auto" }}>
      <input
        type="text"
        placeholder="Search user by first name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "8px 12px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          fontSize: "16px",
        }}
      />

      {/* Dropdown list */}
      {filteredUsers.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "6px",
            marginTop: "4px",
            listStyle: "none",
            padding: 0,
            maxHeight: "200px",
            overflowY: "auto",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            zIndex: 10,
          }}
        >
          {filteredUsers.map((user) => (
            <li
              key={user._id}
              style={{
                padding: "8px 12px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
              onClick={() => goToUser(user._id)}
              onMouseDown={(e) => e.preventDefault()} // prevents input blur
            >
              {user.firstName} {user.lastName}
            </li>
          ))}
        </ul>
      )}

      {search && filteredUsers.length === 0 && (
        <p
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "6px",
            padding: "8px 12px",
            marginTop: "4px",
            color: "#777",
            fontSize: "14px",
          }}
        >
          No users found.
        </p>
      )}
    </div>
  );
}

export default SearchUser;
