import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";
import Navbar from "../Navbar/Navbar";
import FooterNew from "../Footer/FooterNew";

function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();

        if (!email || !password) {
            alert("Please fill in all fields.");
            return;
        }

        fetch("http://localhost:8070/admin/login", {
            method: "POST",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data, "adminLogin");
                if (data.status === "ok") {
                    alert("Login successful");
                    window.localStorage.setItem("token", data.data);
                    window.localStorage.setItem("userRole", "Admin");
                    navigate("/admin/dashboard");
                } else {
                    alert("Login failed. Please check your credentials.");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("Login failed. Please try again later.");
            });
    }

    return (
        <div>
            <Navbar />
            <div className="admin-login-container">
                <div className="admin-login-image">
                    <img
                        src="https://assets-global.website-files.com/5d2fb52b76aabef62647ed9a/6195c8e178a99295d45307cb_allgreen1000-550.jpg"
                        alt=""
                        className="img-admin-login"
                    />
                </div>
                <div className="admin-login-inner-container">
                    <form onSubmit={handleSubmit}>
                        <h3>Admin Sign In</h3>

                        <div className="email">
                            <label>Email address</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Enter email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="password">
                            <label>Password</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Enter password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="admin-login-button-container">
                            <button type="submit" className="admin-login-button">
                                Sign In
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <FooterNew />
        </div>
    );
}

export default AdminLogin;
