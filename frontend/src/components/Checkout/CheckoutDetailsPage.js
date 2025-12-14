import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarRegistered from "../NavbarRegistered/NavbarRegistered";
import FooterNew from "../Footer/FooterNew";

function CheckoutDetailsPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    note: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Save details to localStorage (so you can read in CheckoutPage if needed)
    window.localStorage.setItem("checkoutDetails", JSON.stringify(formData));

    // ✅ Go to existing animated checkout page
    navigate("/checkout");
  };

  return (
    <div>
      <NavbarRegistered />
      <div
        style={{
          maxWidth: "600px",
          margin: "40px auto",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          backgroundColor: "#fff",
        }}
      >
        <h2>Delivery Details</h2>
        <p>Please enter your delivery information before placing the order.</p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="city"
            placeholder="City / District"
            value={formData.city}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="postalCode"
            placeholder="Postal Code"
            value={formData.postalCode}
            onChange={handleChange}
            required
          />
          <textarea
            name="note"
            placeholder="Additional notes (optional)"
            value={formData.note}
            onChange={handleChange}
            rows={3}
          />

          <button type="submit">Continue to Checkout</button>
        </form>
      </div>
      <FooterNew />
    </div>
  );
}

export default CheckoutDetailsPage;
