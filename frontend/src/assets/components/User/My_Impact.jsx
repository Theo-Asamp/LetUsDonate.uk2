import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../../css/my_impact.css';

export function My_Impact() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get logged-in user
  const storedUser = localStorage.getItem("user");
  let user = {};

  try {
    user = JSON.parse(storedUser || "{}");
  } catch {
    user = {};
  }

  // Normalise user ID from your DB (id, user_ID, donor_ID)
  const userId =
    user?.user_ID ??
    user?.id ??
    user?.donor_ID ??
    null;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    // USE LARAVEL API — NOT THE OLD PHP FILE
    fetch(`http://localhost:8000/api/donations/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success" && Array.isArray(data.donations)) {
          setDonations(data.donations);
        } else {
          console.warn("Unexpected donations payload:", data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching donations:", err);
        setLoading(false);
      });
  }, [userId]);

  // SIMPLE IMPACT STATS
  const totalDonations = donations.length;

  // If using donation_item table: sum quantities instead of counting donations
  const totalItems = donations.reduce((sum, d) => {
    return sum + (d.quantity ? Number(d.quantity) : 1);
  }, 0);

  const totalCO2 = (totalItems * 1.5).toFixed(1);
  const peopleHelped = totalItems * 2;

  return (
    <main className="dashboard-main">
      <div className="records-container">
        <div className="header-left">
          <h2>My Impact</h2>
        </div>

        <div className="return-right">
          <Link to="/User_dashboard" className="return-link">
            Return
          </Link>
        </div>
      </div>

      <p className="impact-description">
        Track your contributions and see how your donations help the community
        and environment.
      </p>

      {loading ? (
        <p>Loading your impact...</p>
      ) : (
        <div className="impact-grid">

          {/* Total Items Donated */}
          <div className="impact-card">
            <i className="fa-solid fa-shirt fa-2x"></i>
            <h3>{totalItems}</h3>
            <p>Total individual items you've donated so far.</p>
          </div>

          {/* CO₂ Saved */}
          <div className="impact-card">
            <i className="fa-solid fa-earth-africa fa-2x"></i>
            <h3>{totalCO2} kg</h3>
            <p>Estimated CO₂ saved by donating instead of discarding.</p>
          </div>

          {/* People Helped */}
          <div className="impact-card">
            <i className="fa-solid fa-heart fa-2x"></i>
            <h3>{peopleHelped}</h3>
            <p>Estimated number of people helped through your donations.</p>
          </div>

          {/* Total donation submissions */}
          <div className="impact-card">
            <i className="fa-solid fa-box fa-2x"></i>
            <h3>{totalDonations}</h3>
            <p>Total donation submissions you’ve made.</p>
          </div>
        </div>
      )}
    </main>
  );
}

export default My_Impact;
