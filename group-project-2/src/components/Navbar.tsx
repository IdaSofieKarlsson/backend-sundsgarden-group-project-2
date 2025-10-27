import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Login</Link>
          </li>
          <li>
            <Link to="/register">Register Account</Link>
          </li>
          <li>
            <Link to="/all-users">All Users</Link>
          </li>
          <li>
            <Link to="/user-overview">User Overview</Link>
          </li>
          <li>
            <Link to="/games">Games</Link>
          </li>
          <li>
            <Link to="/demo-page">Demo Page</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
