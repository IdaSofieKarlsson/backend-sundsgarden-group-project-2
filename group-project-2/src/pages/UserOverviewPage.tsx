import HorizontalBarChart from "../components/horizontal.tsx";
import GameProgressList from "../components/percentage.tsx";
import GameScatterChart from "../components/dot.tsx";
import UserActivityLineChart from "../components/line.tsx";
import MinutesPerGameChart from "../components/bargraph.tsx";
import TotalTimeDashboard from "../components/newuser.tsx";
import Leaderboard from "../components/leaderboard.tsx";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API_BASE_URL from "../api";
import type { User } from "../interfaces/user.ts";
import { useUser } from "../contexts/UserContext";
import "../styles/UserOverviewPage.css";

export default function UserOverviewPage() {
  const { id } = useParams();
  const { setActiveUser } = useUser();

  const [user, setUser] = useState<User>();

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/users/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setActiveUser(data);
      })
      .catch((err) => console.error("Error fetching users:", err));
  });

  return (
    <div className="user-overview-page">
      <div className="top-section">
        <div className="profile-card">
          <img
            src="/images/profile-placeholder.png"
            alt="User profile"
            className="profile-image"
          />
          <div className="profile-info">
            <h2>
              Player {id} {user?.firstName} {user?.lastName}
            </h2>
            <p>Level 42 • 120 hrs played</p>
          </div>
        </div>

        <div className="summary-widgets">
          <TotalTimeDashboard />
          <Leaderboard />
        </div>
      </div>

      <div className="chart-grid">
        <HorizontalBarChart/>
        <GameProgressList />
        <GameScatterChart />
        <UserActivityLineChart />
        <MinutesPerGameChart />
      </div>
    </div>
  );
}
