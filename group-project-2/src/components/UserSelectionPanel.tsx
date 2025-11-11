import React from "react";
import SelectPlayerToPlayGame from "./SelectPlayerToPlayGame";
import "../styles/UserSelectionPanel.css";

const UserSelectionPanel: React.FC = () => {
  return (
    <div className="user-selection-panel">
      <div className="user-selection-instruction">
        Choose or change active user here:
      </div>
      <div className="user-selection-dropdown">
        <SelectPlayerToPlayGame />
      </div>
    </div>
  );
};

export default UserSelectionPanel;
