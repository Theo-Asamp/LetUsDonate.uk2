import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../../css/user.css";

export default function User_Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [donations, setDonations] = useState([]);
  const [charities, setCharities] = useState([]);
  const [loadingCharities, setLoadingCharities] = useState(true);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [status, setStatus] = useState(null);

  // --------------------------
  // Load / check logged-in user
  // --------------------------
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    try {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
    } catch (e) {
      console.error("Failed to parse stored user", e);
      navigate("/login");
    }
  }, [navigate]);

  // Helper: normalise user id + name from whatever backend returns
  const userId =
    user?.user_ID ??
    user?.donor_ID ??
    user?.id ??
    user?.userId ??
    null;

  const userName =
    user?.name ??
    user?.Name ??
    user?.username ??
    user?.email ??
    "";

  // --------------------------
  // Fetch donations for the user
  // --------------------------
  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:8000/api/donations/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success" && Array.isArray(data.donations)) {
          setDonations(data.donations);
        } else {
          console.warn("Unexpected donations payload:", data);
        }
      })
      .catch((err) => {
        console.error("Error fetching donations:", err);
      });
  }, [userId]);

  // --------------------------
  // Fetch charities
  // --------------------------
  useEffect(() => {
    fetch("http://localhost:8000/api/charities")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success" && Array.isArray(data.charities)) {
          setCharities(data.charities);
        } else {
          console.warn("Unexpected charities payload:", data);
        }
        setLoadingCharities(false);
      })
      .catch((err) => {
        console.error("Error fetching charities:", err);
        setLoadingCharities(false);
      });
  }, []);

  // --------------------------
  // File upload handling
  // --------------------------
  const handleChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleDeleteFile = () => {
    setFile(null);
    setPreview(null);
  };

  // --------------------------
  // Submit new donation
  // --------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setStatus({ type: "error", message: "User not found. Please log in again." });
      return;
    }

    const formData = new FormData(e.target);

    // Send multiple possible keys so it works with either donor_ID or user_id
    formData.append("user_id", userId);
    formData.append("donor_ID", userId);

    if (file) {
      formData.append("item_image", file);
    }

    try {
      const res = await fetch("http://localhost:8000/api/donations", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.status === "success") {
        setStatus({ type: "success", message: data.message || "Donation submitted successfully!" });
        e.target.reset();
        setFile(null);
        setPreview(null);

        // Refresh donations list
        fetch(`http://localhost:8000/api/donations/${userId}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.status === "success" && Array.isArray(data.donations)) {
              setDonations(data.donations);
            }
          })
          .catch((err) => console.error("Error refreshing donations:", err));
      } else {
        setStatus({ type: "error", message: data.message || "Unable to submit donation." });
      }
    } catch (err) {
      console.error("Submit donation error:", err);
      setStatus({ type: "error", message: "Network error. Please try again." });
    }

    setTimeout(() => setStatus(null), 6000);
  };

  // --------------------------
  // Logout
  // --------------------------
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // --------------------------
  // Impact calculations (simple)
  // --------------------------
  const totalItems = donations.length;
  const co2SavedKg = (totalItems * 1.5).toFixed(1); // fake metric
  const peopleHelped = totalItems * 2; // fake metric

  return (
    <>
      <div className="user-dashboard-container">
        <div className="dashboard-left">
          <div className="dashboard">
            <aside className="links">
              <ul>
                <li>
                  <i className="fa-solid fa-gauge"></i>
                  <Link to="/my_impact">My Impact</Link>
                </li>
                <li>
                  <i className="fa-solid fa-inbox"></i>
                  <Link to="/my_donations">My Donations</Link>
                </li>
                <li>
                  <i className="fa-solid fa-user"></i>
                  <Link to="/my_profile">Profile Settings</Link>
                </li>
                <li>
                  <i className="fa-solid fa-arrow-right-from-bracket"></i>
                  <button className="logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </ul>
            </aside>

            <main className="dashboard-main">
              <h2>Welcome, {userName}</h2>

              <div className="stats-container">
                <div className="stat-card">
                  {/* FIXED: <ii> → <i> to remove React warning */}
                  <i className="fa-solid fa-earth-africa"></i>
                  <p className="stat-number">{co2SavedKg}kg</p>
                  <p className="stat-text">CO₂ Saved</p>
                </div>

                <div className="stat-card">
                  <i className="fa-solid fa-shirt"></i>
                  <p className="stat-number">{totalItems}</p>
                  <p className="stat-text">Total Items Donated</p>
                </div>

                <div className="stat-card">
                  <i className="fa-solid fa-heart"></i>
                  <p className="stat-number">{peopleHelped}</p>
                  <p className="stat-text">People Helped</p>
                </div>
              </div>
            </main>
          </div>
        </div>

        <div className="dashboard-right">
          <form className="new-donation" onSubmit={handleSubmit}>
            <h3>Make a New Donation</h3>
            {status && <div className={`form-message ${status.type}`}>{status.message}</div>}

            <input type="text" name="item_name" placeholder="Item Name" required />

            <select name="category" required>
              <option value="">Category</option>
              <option value="womens">Women's</option>
              <option value="mens">Men's</option>
              <option value="girls">Girl's</option>
              <option value="boys">Boy's</option>
            </select>

            <select name="type" required>
              <option value="">Type</option>
              <option value="shirt">Shirt</option>
              <option value="trouser">Trouser</option>
              <option value="jacket">Jacket</option>
              <option value="shoe">Shoes</option>
              <option value="other">Other</option>
            </select>

            <input type="number" name="quantity" min="1" placeholder="Quantity" required />

            <select name="condition" required>
              <option value="">Condition</option>
              <option value="new">New</option>
              <option value="like-new">Like New</option>
              <option value="used-good">Used - Good</option>
              <option value="used-fair">Used - Fair</option>
            </select>

            <textarea
              name="description"
              className="description"
              placeholder="Description"
              required
            />

            <div className="file-upload">
              <input type="file" accept="image/*" onChange={handleChange} />
              {file && preview && (
                <div className="file-preview">
                  <div className="image-preview">
                    <img
                      src={preview}
                      alt="Preview"
                      className="thumbnail"
                      onClick={() => setModalOpen(true)}
                    />
                    <button
                      type="button"
                      onClick={handleDeleteFile}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  </div>

                  {modalOpen && (
                    <div
                      className="image-mode"
                      onClick={() => setModalOpen(false)}
                    >
                      <div
                        className="mode-content"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <img
                          src={preview}
                          alt="Full Preview"
                          className="full-image"
                        />
                        <button
                          type="button"
                          className="close-modal-btn"
                          onClick={() => setModalOpen(false)}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <input
              type="text"
              name="pickup_address"
              placeholder="Pickup Address"
              required
            />

            {loadingCharities ? (
              <p>Loading charities...</p>
            ) : (
              <select name="charity_id" required>
                <option value="">Select Charity</option>
                {charities.map((c) => (
                  <option key={c.charity_ID} value={c.charity_ID}>
                    {c.charity_name}
                  </option>
                ))}
              </select>

            )}

            <button type="submit">Submit Donation</button>
          </form>
        </div>
      </div>

      <div className="donation-history full-width">
        <h3>Recent Donations</h3>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Image</th>
              <th>Date Submitted</th>
              <th>Charity Selected</th>
              <th>Status</th>
              <th>Pickup Address</th>
            </tr>
          </thead>
          <tbody>
            {donations.length > 0 ? (
              donations.slice(0, 4).map((d) => {
                // Try to be robust to different backend field names
                const itemName =
                  d.item_name ?? d.itemName ?? d.item ?? "Item";
                const donationDate = d.donation_date || d.created_at || "";
                const charityName =
                  d.charity_name ?? d.charityName ?? d.charity ?? "—";
                const status = d.donation_status ?? d.status ?? "—";
                const pickupAddress =
                  d.pickup_address ?? d.pickupAddress ?? "n/a";
                const imagePath = d.item_image ?? d.image ?? null;

                const imgUrl = imagePath
                  ? imagePath.startsWith("http")
                    ? imagePath
                    : `http://localhost:8000/storage/${imagePath}`
                  : null;

                return (
                  <tr key={d.donation_ID || d.id}>
                    <td>{itemName}</td>
                    <td>
                      {imgUrl ? (
                        <a
                          href={imgUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={imgUrl}
                            alt={itemName}
                            style={{
                              width: "50px",
                              height: "auto",
                              borderRadius: "4px",
                            }}
                          />
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>
                      {donationDate
                        ? donationDate.split(" ")[0]
                        : "—"}
                    </td>
                    <td>{charityName}</td>
                    <td>{status}</td>
                    <td>{pickupAddress}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6">No donations yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
