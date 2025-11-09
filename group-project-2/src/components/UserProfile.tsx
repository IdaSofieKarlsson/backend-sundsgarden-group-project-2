import { useNavigate } from "react-router-dom";

import type { UserProfileProps } from "../interfaces/UserProfileProps ";

function UserProfile({ _id, firstName, lastName }: UserProfileProps) {
  const navigate = useNavigate();

  const goToUser = () => {
    navigate(`/user-overview/${_id}`);
  };

  return (
    <div className="profile-card" onClick={goToUser}>
      <h3 className="profile-firstname">{firstName}</h3>
      <h3 className="profile-lastname">{lastName}</h3>
    </div>
  );
}

export default UserProfile;