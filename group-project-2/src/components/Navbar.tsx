import "../styles/Navbar.css";
import { NavbarData } from "./NavbarData.tsx";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className="Navbar">
      <ul className="NavbarList">
        {NavbarData.map((val, key) => {
          return (
            <li
              key={key}
              className="row"
              id={
                val.path === "/games" && location.pathname.startsWith("/games")
                  ? "active"
                  : val.path === "/users" &&
                    (location.pathname.startsWith("/users") ||
                      location.pathname === "/all-users")
                  ? "active"
                  : location.pathname === val.path
                  ? "active"
                  : ""
              }
              onClick={() => navigate(val.path)}
            >
              <div id="icon">{val.icon}</div> <div id="title">{val.title}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Navbar;
