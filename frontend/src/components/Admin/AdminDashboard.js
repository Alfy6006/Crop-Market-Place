import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import Navbar from "../Navbar/Navbar";
import FooterNew from "../Footer/FooterNew";

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("pending");
    const [pendingUsers, setPendingUsers] = useState([]);
    const [approvedUsers, setApprovedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in as admin
        const token = window.localStorage.getItem("token");
        const userRole = window.localStorage.getItem("userRole");

        if (!token || userRole !== "Admin") {
            alert("Please login as admin to access this page");
            navigate("/admin/login");
            return;
        }

        fetchUsers();
    }, [navigate]);

    const fetchUsers = () => {
        setLoading(true);

        // Fetch pending users
        fetch("http://localhost:8070/admin/pending-users", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "ok") {
                    setPendingUsers(data.data);
                }
            })
            .catch((error) => {
                console.error("Error fetching pending users:", error);
            });

        // Fetch approved users
        fetch("http://localhost:8070/admin/approved-users", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "ok") {
                    setApprovedUsers(data.data);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching approved users:", error);
                setLoading(false);
            });
    };

    const handleApprove = (role, id) => {
        if (!window.confirm(`Are you sure you want to approve this ${role}?`)) {
            return;
        }

        fetch(`http://localhost:8070/admin/approve/${role}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "ok") {
                    alert(`${role} approved successfully!`);
                    fetchUsers(); // Refresh the lists
                } else {
                    alert("Failed to approve user");
                }
            })
            .catch((error) => {
                console.error("Error approving user:", error);
                alert("Failed to approve user");
            });
    };

    const handleReject = (role, id) => {
        if (!window.confirm(`Are you sure you want to reject this ${role}? This will delete their account.`)) {
            return;
        }

        fetch(`http://localhost:8070/admin/reject/${role}/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "ok") {
                    alert(`${role} rejected successfully!`);
                    fetchUsers(); // Refresh the lists
                } else {
                    alert("Failed to reject user");
                }
            })
            .catch((error) => {
                console.error("Error rejecting user:", error);
                alert("Failed to reject user");
            });
    };

    const handleLogout = () => {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("userRole");
        navigate("/admin/login");
    };

    return (
        <div>
            <Navbar />
            <div className="admin-dashboard-container">
                <div className="admin-dashboard-header">
                    <h2>Admin Dashboard</h2>
                    <button className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>

                <div className="admin-tabs">
                    <button
                        className={`tab-button ${activeTab === "pending" ? "active" : ""}`}
                        onClick={() => setActiveTab("pending")}
                    >
                        Pending Approvals ({pendingUsers.length})
                    </button>
                    <button
                        className={`tab-button ${activeTab === "approved" ? "active" : ""}`}
                        onClick={() => setActiveTab("approved")}
                    >
                        Approved Users ({approvedUsers.length})
                    </button>
                </div>

                {loading ? (
                    <div className="loading">Loading...</div>
                ) : (
                    <div className="users-container">
                        {activeTab === "pending" && (
                            <div className="users-list">
                                <h3>Pending Approvals</h3>
                                {pendingUsers.length === 0 ? (
                                    <p className="no-users">No pending users</p>
                                ) : (
                                    <div className="users-grid">
                                        {pendingUsers.map((user) => (
                                            <div key={user._id} className="user-card">
                                                <div className="user-info">
                                                    <div className="user-role-badge">{user.role}</div>
                                                    <h4>{user.fname} {user.lname}</h4>
                                                    <p><strong>Email:</strong> {user.email}</p>
                                                    <p><strong>District:</strong> {user.district}</p>
                                                    {user.farmName && <p><strong>Farm:</strong> {user.farmName}</p>}
                                                    {user.shopName && <p><strong>Shop:</strong> {user.shopName}</p>}
                                                    {user.vehicleNumber && <p><strong>Vehicle:</strong> {user.vehicleNumber}</p>}
                                                </div>
                                                <div className="user-actions">
                                                    <button
                                                        className="approve-button"
                                                        onClick={() => handleApprove(user.role, user._id)}
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        className="reject-button"
                                                        onClick={() => handleReject(user.role, user._id)}
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "approved" && (
                            <div className="users-list">
                                <h3>Approved Users</h3>
                                {approvedUsers.length === 0 ? (
                                    <p className="no-users">No approved users</p>
                                ) : (
                                    <div className="users-grid">
                                        {approvedUsers.map((user) => (
                                            <div key={user._id} className="user-card approved">
                                                <div className="user-info">
                                                    <div className="user-role-badge">{user.role}</div>
                                                    <h4>{user.fname} {user.lname}</h4>
                                                    <p><strong>Email:</strong> {user.email}</p>
                                                    <p><strong>District:</strong> {user.district}</p>
                                                    {user.farmName && <p><strong>Farm:</strong> {user.farmName}</p>}
                                                    {user.shopName && <p><strong>Shop:</strong> {user.shopName}</p>}
                                                    {user.vehicleNumber && <p><strong>Vehicle:</strong> {user.vehicleNumber}</p>}
                                                </div>
                                                <div className="approved-badge">✓ Approved</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
            <FooterNew />
        </div>
    );
}

export default AdminDashboard;
