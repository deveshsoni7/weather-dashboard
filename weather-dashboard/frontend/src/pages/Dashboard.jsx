import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import React from "react";
const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h2>Welcome {user?.username}</h2>
      <h3>Your Favorite Cities:</h3>
      {user?.favorites?.length ? (
        <ul>
          {user.favorites.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      ) : (
        <p>No favorites yet.</p>
      )}
    </div>
  );
};

export default Dashboard;
