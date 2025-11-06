import type { UserProfileProps } from "../interfaces/UserProfileProps ";

function UserProfile({ firstName, lastName }: UserProfileProps) {
  return (
    <div>
      <h3>{firstName}</h3>
      <h3>{lastName}</h3>
    </div>
  );
}

export default UserProfile;