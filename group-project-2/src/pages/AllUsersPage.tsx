import "../styles/AllUsersPage.css";
import erikImg from "../assets/images/erik.avif";
import mariaImg from "../assets/images/maria.png";
import andersImg from "../assets/images/anders.webp";
import sofiaImg from "../assets/images/sofia.jpg";
import larsImg from "../assets/images/lars.jpg";
import emmaImg from "../assets/images/emma.avif";
import gustavImg from "../assets/images/gustav.jpg";
import annaImg from "../assets/images/anna.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Profile {
  firstName: string;
  lastName: string;
  initials: string;
  image?: string; // new user might not have a picture available
}

const AllUsersPage = () => {
  
  
  const [profiles, setProfiles] = useState<Profile[]>([
    {
      firstName: "Erik",
      lastName: "Andersson",
      initials: "EA",
      image: erikImg,
    },
    {
      firstName: "Maria",
      lastName: "Lindström",
      initials: "ML",
      image: mariaImg,
    },
    {
      firstName: "Anders",
      lastName: "Nilsson",
      initials: "AN",
      image: andersImg,
    },
    {
      firstName: "Sofia",
      lastName: "Johansson",
      initials: "SJ",
      image: sofiaImg,
    },
    { firstName: "Lars", lastName: "Karlsson", initials: "LK", image: larsImg },
    {
      firstName: "Emma",
      lastName: "Bergström",
      initials: "EB",
      image: emmaImg,
    },
    {
      firstName: "Gustav",
      lastName: "Lundqvist",
      initials: "GL",
      image: gustavImg,
    },
    {
      firstName: "Anna",
      lastName: "Pettersson",
      initials: "AP",
      image: annaImg,
    },
  ]);
  /*
  const addUser = () => {
    const firstName = "Add firstname:";
    const lastName = "Add lastname:";

    if (firstName && lastName) {
      const initials = firstName[0].toUpperCase() + lastName[0].toUpperCase();
      setProfiles([...profiles, { firstName, lastName, initials }]);
    }
  };
  */
  const navigate = useNavigate();
  const navToRegPage = () => {
    
    navigate("/");
  };

  return (
    <div>
      <h1>All Users</h1>
      <button onClick={navToRegPage}>Add User</button>

      <div className="profiles-container">
        <div className="profiles-row">
          {profiles.slice(0, 4).map((profile, index) => (
            <div className="profile-card" key={index}>
              <img
                src={profile.image}
                alt={`${profile.firstName} ${profile.lastName}`}
                className="profile-image"
              />
              <div className="profile-name">{profile.firstName}</div>
              <div className="profile-lastname">{profile.lastName}</div>
            </div>
          ))}
        </div>

        <div className="profiles-row">
          {profiles.slice(4, 8).map((profile, index) => (
            <div className="profile-card" key={index}>
              <img
                src={profile.image}
                alt={`${profile.firstName} ${profile.lastName}`}
                className="profile-image"
              />
              <div className="profile-name">{profile.firstName}</div>
              <div className="profile-lastname">{profile.lastName}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllUsersPage;
