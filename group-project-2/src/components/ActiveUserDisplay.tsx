import React from "react";
import profilePlaceholder from "../assets/ProfilePlaceholder.png";
import "../styles/ActiveUserDisplay.css";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
}

interface ActiveUserDisplayProps {
  activeUser: User | null;
}

const ActiveUserDisplay: React.FC<ActiveUserDisplayProps> = ({
  activeUser,
}) => {
  return (
    <div className="active-user-display">
      <img
        src={profilePlaceholder}
        alt="User silhouette"
        className="active-user-avatar"
      />
      <div className="active-user-info">
        <div className="active-user-label">Active User</div>
        <div className="active-user-name">
          {activeUser
            ? `${activeUser.firstName} ${activeUser.lastName}`
            : "NO ACTIVE USER"}
        </div>
      </div>
    </div>
  );
};

export default ActiveUserDisplay;
