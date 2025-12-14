import React from "react";
import "./NavbarRegistered.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { LuHeart } from "react-icons/lu";

function Navbar() {
  const role = window.localStorage.getItem("userRole");
  return (
    <nav className="navbar navbar-expand-lg navbar-light fixed-top">
      <div className="container-fluid">
        <a className="navbar-brand" href="/homepage-registeredusers">
          <img
            src={process.env.PUBLIC_URL + "/Navbar/icon.png"}
            alt=""
            className="navbar-icon"
          />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {role !== null && (
              <li className="home">
                <a className="nav-link active" aria-current="page" href="/products">
                  Products
                </a>
              </li>
            )}

            {role === null && (
              <li className="menu">
                <a className="nav-link" href="/">
                  Home
                </a>
              </li>
            )}
            <li className="about">
              <a className="nav-link" href="/about">
                About
              </a>
            </li>
          </ul>

          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="profile" href="/profile">
                <FontAwesomeIcon icon={faUser} />
              </a>
            </li>
            {role === "Farmer" && (
              <li className="nav-item">
                <a className="nav-link" href="/wishlist">
                  <LuHeart style={{ verticalAlign: "middle" }} /> Wishlist
                </a>
              </li>
            )}
            <li className="nav-item">
              <a className="cartitem" href="/cart">
                <img
                  src={process.env.PUBLIC_URL + "/Navbar/cart.png"}
                  alt=""
                  className="cart"
                />
              </a>
            </li>

            <li className="nav-item">
              <a className="login" href="/" onClick={() => { window.localStorage.removeItem("token"); window.localStorage.removeItem("userRole"); }}>
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
