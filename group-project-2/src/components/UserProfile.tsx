import type { UserProfileProps } from "../interfaces/UserProfileProps ";

function UserProfile({ firstName, lastName }: UserProfileProps) {
  return (
    <div className="profile-card">
      <h3 className="profile-firstname">{firstName}</h3>
      <h3 className="profile-lastname">{lastName}</h3>
    </div>
  );
}

export default UserProfile;