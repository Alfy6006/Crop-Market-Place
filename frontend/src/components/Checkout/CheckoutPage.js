import React, { useEffect, useRef, useState } from "react";
import NavbarRegistered from "../NavbarRegistered/NavbarRegistered";
import FooterNew from "../Footer/FooterNew";

function CheckoutPage() {
  const [stage, setStage] = useState(0);
  const intervalRef = useRef(null);

  const labels = ["Reviewing order", "Processing payment", "Confirming", "Order placed!"];

  const startAutoFlow = () => {

    if (intervalRef.current) return;
    let i = 0;
    intervalRef.current = setInterval(() => {
      setStage((s) => {
        const next = Math.min(s + 1, labels.length - 1);
        return next;
      });
      i += 1;

      if (i >= labels.length - 1) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return (
    <div>
      <NavbarRegistered />
      <div className="container" style={{ textAlign: "center", paddingTop: 80, paddingBottom: 80 }}>
        <h3>Checkout</h3>

        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 20 }}>
          {labels.map((l, idx) => (
            <div
              key={l}
              style={{
                padding: 10,
                border: "1px solid #ccc",
                background: idx <= stage ? "#cff" : "#fff",
                minWidth: 140,
                borderRadius: 6,
              }}
            >
              {l}
            </div>
          ))}
        </div>

        {stage === 0 && (
          <div style={{ marginTop: 30, display: "flex", justifyContent: "center" }}>
            <AddressForm
              onContinue={() => {
                setStage(1);
                startAutoFlow();
              }}
            />
          </div>
        )}

        {stage === labels.length - 1 && (
          <div style={{ marginTop: 30 }}>
            <p>Your order has been placed. This is a demo flow.</p>
            <OrderFinalize />
            <a href="/products"><button>Back to Products</button></a>
            <a href="/profile" style={{ marginLeft: 8 }}><button>View Profile</button></a>
          </div>
        )}
      </div>
      <FooterNew />
    </div>
  );
}

export default CheckoutPage;

function AddressForm({ onContinue }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    phone: "",
  });

  useEffect(() => {
    // Try to load address from database first
    const loadAddressFromDB = async () => {
      try {
        const token = window.localStorage.getItem("token");
        if (!token) {
          // If no token, try localStorage
          loadFromLocalStorage();
          return;
        }

        const response = await fetch("http://localhost:8070/checkout-address/default", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data.status === "ok" && data.data) {
          setForm({
            fullName: data.data.fullName || "",
            address1: data.data.address1 || "",
            address2: data.data.address2 || "",
            city: data.data.city || "",
            state: data.data.state || "",
            pincode: data.data.pincode || "",
            country: data.data.country || "",
            phone: data.data.phone || "",
          });
        } else {
          // If no address in DB, try localStorage
          loadFromLocalStorage();
        }
      } catch (error) {
        console.error("Error loading address from database:", error);
        // Fallback to localStorage
        loadFromLocalStorage();
      }
    };

    const loadFromLocalStorage = () => {
      try {
        const stored = JSON.parse(window.localStorage.getItem("checkoutAddress") || "null");
        if (stored) setForm((f) => ({ ...f, ...stored }));
      } catch { }
    };

    loadAddressFromDB();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const required = ["fullName", "address1", "city", "state", "pincode", "country", "phone"];
    for (const key of required) {
      if (!form[key] || String(form[key]).trim() === "") return false;
    }
    if (!/^\d{4,10}$/.test(String(form.pincode).trim())) return false;
    if (!/^\+?\d{7,15}$/.test(String(form.phone).trim())) return false;
    return true;
  };

  const saveToDatabase = async () => {
    try {
      const token = window.localStorage.getItem("token");
      if (!token) {
        console.log("No token found, skipping database save");
        return false;
      }

      const response = await fetch("http://localhost:8070/checkout-address/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          isDefault: true, // Set as default address
        }),
      });

      const data = await response.json();
      if (data.status === "ok") {
        console.log("Address saved to database successfully");
        return true;
      } else {
        console.error("Failed to save address to database:", data);
        return false;
      }
    } catch (error) {
      console.error("Error saving address to database:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      alert("Please fill all required fields with valid values.");
      return;
    }
    setSaving(true);

    // Save to database
    await saveToDatabase();

    // Also save to localStorage as backup
    try {
      window.localStorage.setItem("checkoutAddress", JSON.stringify(form));
      setSaved(true);
      if (typeof onContinue === "function") onContinue();
    } catch { }

    setSaving(false);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleSaveOnly = async () => {
    if (!validate()) {
      alert("Please fill all required fields with valid values.");
      return;
    }
    setSaving(true);

    // Save to database
    await saveToDatabase();

    // Also save to localStorage as backup
    try {
      window.localStorage.setItem("checkoutAddress", JSON.stringify(form));
      setSaved(true);
    } catch { }

    setSaving(false);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        width: 800,
        maxWidth: "95%",
        textAlign: "left",
        border: "1px solid #e6e6e6",
        padding: 20,
        borderRadius: 8,
        boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
      }}
    >
      <h4 style={{ marginTop: 0 }}>Shipping / Address details</h4>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <label style={{ display: "block" }}>
          Full name *
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>

        <label style={{ display: "block" }}>
          Phone * (digits, may start with +)
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>

        <label style={{ gridColumn: "1 / -1", display: "block" }}>
          Address line 1 *
          <input
            name="address1"
            value={form.address1}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>

        <label style={{ gridColumn: "1 / -1", display: "block" }}>
          Address line 2
          <input
            name="address2"
            value={form.address2}
            onChange={handleChange}
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>

        <label style={{ display: "block" }}>
          City *
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>

        <label style={{ display: "block" }}>
          State / Province *
          <input
            name="state"
            value={form.state}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>

        <label style={{ display: "block" }}>
          Pincode / ZIP *
          <input
            name="pincode"
            value={form.pincode}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>

        <label style={{ display: "block" }}>
          Country *
          <input
            name="country"
            value={form.country}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>
      </div>

      <div style={{ marginTop: 14, display: "flex", gap: 8, alignItems: "center" }}>
        <button
          type="submit"
          disabled={saving}
          style={{ padding: "8px 14px", borderRadius: 6, cursor: "pointer" }}
        >
          {saving ? "Saving..." : "Save & continue"}
        </button>

        {/* <button
          type="button"
          onClick={handleSaveOnly}
          disabled={saving}
          style={{
            padding: "8px 14px",
            borderRadius: 6,
            background: "#fff",
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          Save
        </button> */}

        <button
          type="button"
          onClick={() => {
            try {
              window.localStorage.removeItem("checkoutAddress");
              setForm({
                fullName: "",
                address1: "",
                address2: "",
                city: "",
                state: "",
                pincode: "",
                country: "",
                phone: "",
              });
            } catch { }
          }}
          style={{
            marginLeft: "auto",
            padding: "6px 10px",
            borderRadius: 6,
            background: "#fff",
            border: "1px solid #eee",
            cursor: "pointer",
          }}
        >
          Clear
        </button>

        {saved && <span style={{ marginLeft: 8, color: "green" }}>Saved</span>}
      </div>

    </form>
  );
}

function OrderFinalize() {
  useEffect(() => {
    try {
      const items = JSON.parse(window.localStorage.getItem("cart") || "[]");
      const total = items.reduce((sum, it) => sum + (Number(it.price || 0) * Number(it.qty || 1)), 0);
      const orders = JSON.parse(window.localStorage.getItem("orders") || "[]");
      orders.push({ date: Date.now(), items, total });
      window.localStorage.setItem("orders", JSON.stringify(orders));
      window.localStorage.setItem("cart", JSON.stringify([]));
      items.forEach(async (it) => {
        try {
          await fetch(`http://localhost:8070/product/adjust-stock/${it.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ delta: -Number(it.qty || 1) }),
          });
        } catch { }
      });
      window.dispatchEvent(new CustomEvent("ordersUpdated"));
    } catch { }
  }, []);
  return null;
}
