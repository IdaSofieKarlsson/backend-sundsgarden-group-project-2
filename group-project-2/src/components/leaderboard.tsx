import React, { useState} from 'react'; // lägg till useEffect för backend

// TypeScript interfaces
interface LeaderboardEntry {
  id: string;
  name: string;
  game: string;
  timePlayed: string;
}

const Leaderboard: React.FC = () => {
  const [leaderboardData, _setLeaderboardData] = useState<LeaderboardEntry[]>([ // setleaderboard
    {
      id: '1',
      name: 'Nicklas Svensson',
      game: 'game 1',
      timePlayed: '2 hours 20 minutes'
    },
    {
      id: '2',
      name: 'Sabrina Taylor',
      game: 'game 2',
      timePlayed: '2 hours 20 minutes'
    },
    {
      id: '3',
      name: 'Tim Nilsson',
      game: 'game 3',
      timePlayed: '2 hours 20 minutes'
    },
    {
      id: '4',
      name: 'Jacky Chang',
      game: 'game 4',
      timePlayed: '2 hours 20 minutes'
    }
  ]);

  // Fetch data from backend - uncomment when ready
  /*
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/leaderboard');
        const data: LeaderboardEntry[] = await response.json();
        setLeaderboardData(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };

    fetchLeaderboard();
  }, []);
  */

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '40px',
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: '#e8e8e8',
        borderRadius: '20px',
        padding: '60px 80px',
        width: '100%',
        maxWidth: '900px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>

        {/* Title */}
        <h1 style={{
          fontSize: '64px',
          fontWeight: 'bold',
          color: '#000',
          textAlign: 'center',
          marginBottom: '50px',
          marginTop: '0'
        }}>
          Leaderboard
        </h1>

        {/* Table */}
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          border: '3px solid #000'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#c0c0c0' }}>
              <th style={{
                padding: '20px',
                textAlign: 'left',
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#000',
                border: '3px solid #000',
                borderTop: 'none',
                borderLeft: 'none'
              }}>
                Name
              </th>
              <th style={{
                padding: '20px',
                textAlign: 'left',
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#000',
                border: '3px solid #000',
                borderTop: 'none'
              }}>
                Game
              </th>
              <th style={{
                padding: '20px',
                textAlign: 'left',
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#000',
                border: '3px solid #000',
                borderTop: 'none',
                borderRight: 'none'
              }}>
                Time Played
              </th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((entry, index) => (
              <tr key={entry.id} style={{
                backgroundColor: index % 2 === 0 ? '#e8e8e8' : '#d0d0d0'
              }}>
                <td style={{
                  padding: '20px',
                  fontSize: '22px',
                  color: '#000',
                  border: '3px solid #000',
                  borderLeft: 'none'
                }}>
                  {entry.name}
                </td>
                <td style={{
                  padding: '20px',
                  fontSize: '22px',
                  color: '#000',
                  border: '3px solid #000'
                }}>
                  {entry.game}
                </td>
                <td style={{
                  padding: '20px',
                  fontSize: '22px',
                  color: '#000',
                  border: '3px solid #000',
                  borderRight: 'none',
                  borderBottom: index === leaderboardData.length - 1 ? 'none' : '3px solid #000'
                }}>
                  {entry.timePlayed}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;