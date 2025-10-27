import "../styles/Navbar.css";
import { NavbarData } from "./NavbarData.tsx";

function Navbar() {
  return (
    <div className="Navbar">
      <ul className="NavbarList">
        {NavbarData.map((val, key) => {
          return (
            <li
              key={key}
              className="row"
              id={window.location.pathname === val.path ? "active" : ""}
              onClick={() => {
                window.location.pathname = val.path;
              }}
            >
              {" "}
              <div id="icon">{val.icon}</div> <div id="title">{val.title}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Navbar;
