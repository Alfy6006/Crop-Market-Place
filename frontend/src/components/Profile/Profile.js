import React, { useEffect, useState } from "react";
import NavbarRegistered from "../NavbarRegistered/NavbarRegistered";
import FooterNew from "../Footer/FooterNew";

function Profile() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const role = window.localStorage.getItem("userRole");
  const token = window.localStorage.getItem("token");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const load = async () => {
      if (!role || !token) { setError("Not logged in"); return; }
      const url = role === "Farmer" ? "http://localhost:8070/farmer/userdata"
        : role === "Seller" ? "http://localhost:8070/seller/userdata"
        : "http://localhost:8070/deliveryman/userdata";
      try {
        const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) });
        const json = await r.json();
        if (json.status === "ok") setData(json.data);
        else setError("Failed to load profile");
      } catch {
        setError("Failed to load profile");
      }
    };
    load();
    try { setOrders(JSON.parse(window.localStorage.getItem("orders") || "[]")); } catch {}
  }, [role, token]);

  return (
    <div>
      <NavbarRegistered />
      <div className="container" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <h3>Profile</h3>
        {error && <p>{error}</p>}
        {!data ? (
          <p>Loading...</p>
        ) : (
          <div>
            <p>Role: {data.userRole}</p>
            <p>Name: {data.fname} {data.lname}</p>
            <p>Email: {data.email}</p>
            <p>District: {data.district}</p>
          </div>
        )}
        <h4>Order History</h4>
        {orders.length === 0 ? <p>No orders yet</p> : (
          <div>
            {orders.map((o, idx) => (
              <div key={idx} style={{ borderBottom: "1px solid #eee", padding: 8 }}>
                <p>Date: {new Date(o.date).toLocaleString()}</p>
                <p>Total: Rs.{Number(o.total || 0).toFixed(2)}</p>
                <p>Items: {o.items.map((it) => `${it.name} x${it.qty}`).join(", ")}</p>
                <p>Delivery Partner: {o.partnerName || "-"}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <FooterNew />
    </div>
  );
}

export default Profile;
