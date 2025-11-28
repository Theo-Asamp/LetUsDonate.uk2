import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../../css/records.css";

export function My_Donations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId =
    user?.user_ID ?? user?.id ?? user?.donor_ID ?? null;

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:8000/api/donations/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setDonations(data.donations);
        } else {
          console.error("Error:", data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Network error:", err);
        setLoading(false);
      });
  }, [userId]);

  // Extract item fields safely  
  const getItem = (donation) => donation.items?.[0] || {};

  // Filtering logic
  const filteredDonations = donations.filter((d) => {
    const item = getItem(d);

    const matchesSearch =
      (item.item_name || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (item.item_category || "")
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus = statusFilter
      ? d.donation_status?.toLowerCase() ===
        statusFilter.toLowerCase()
      : true;

    return matchesSearch && matchesStatus;
  });

  return (
    <main>
      <div className="records-container">
        <div className="header-left">
          <h2>My Donation History</h2>
        </div>

        <div className="return-right">
          <ul>
            <li>
              <Link to="/User_Dashboard" className="return-link">
                Return
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by item or category..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Item Name</th>
              <th>Description</th>
              <th>Condition</th>
              <th>Image</th>
              <th>Date Donated</th>
              <th>Status</th>
              <th>Charity</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8">Loading donations...</td>
              </tr>
            ) : filteredDonations.length > 0 ? (
              filteredDonations.map((d) => {
                const item = getItem(d);

                const imgUrl = item.item_image
                  ? `http://localhost:8000/storage/${item.item_image}`
                  : null;

                return (
                  <tr key={d.donation_ID}>
                    <td>{item.item_category || "N/A"}</td>
                    <td>{item.item_name || "N/A"}</td>
                    <td>{item.item_description || "N/A"}</td>
                    <td>{item.item_condition || "N/A"}</td>

                    <td>
                      {imgUrl ? (
                        <a
                          href={imgUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={imgUrl}
                            alt={item.item_name}
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
                      {d.donation_date
                        ? d.donation_date.split(" ")[0]
                        : "N/A"}
                    </td>

                    <td>{d.donation_status || "N/A"}</td>
                    <td>{d.charity?.charity_name || "Unknown"}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8">No donations found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default My_Donations;
