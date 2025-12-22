import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SellerAddProduct() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    productName: "",
    productCategory: "",
    productImage: "",
    price: "",
    stock: "",
  });

  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // basic validation
    if (!form.productName.trim()) return alert("Enter product name");
    if (!form.productCategory.trim()) return alert("Enter product category");
    if (!form.productImage.trim()) return alert("Enter product image URL");
    if (Number(form.price) < 0) return alert("Price cannot be negative");
    if (Number(form.stock) < 0) return alert("Stock cannot be negative");

    try {
      setLoading(true);

      await axios.post("http://localhost:8070/seller/products/add", {
        productName: form.productName.trim(),
        productCategory: form.productCategory.trim(),
        productImage: form.productImage.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        images: [], // matches your seed.js structure
      });

      alert("✅ Product added successfully!");
      // go back to products page (change path if your products route is different)
      navigate("/products");
    } catch (err) {
      alert(err?.response?.data?.message || "❌ Failed to add product");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", padding: 24, background: "#0f0f12", color: "#fff" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ margin: 0 }}>Add Product (Seller)</h2>

          <button
            onClick={() => navigate("/products")}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #2b2b33",
              background: "transparent",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            ← Back to Products
          </button>
        </div>

        <div style={{ background: "#17171c", border: "1px solid #2b2b33", borderRadius: 14, padding: 18 }}>
          <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
            <label style={{ display: "grid", gap: 6 }}>
              <span>Product Name</span>
              <input
                name="productName"
                value={form.productName}
                onChange={onChange}
                placeholder="e.g., Tomato"
                required
                style={inputStyle}
              />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span>Category</span>
              <input
                name="productCategory"
                value={form.productCategory}
                onChange={onChange}
                placeholder="e.g., Veg / Fruit / Grain"
                required
                style={inputStyle}
              />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span>Main Image URL</span>
              <input
                name="productImage"
                value={form.productImage}
                onChange={onChange}
                placeholder="https://..."
                required
                style={inputStyle}
              />
            </label>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <label style={{ display: "grid", gap: 6 }}>
                <span>Price</span>
                <input
                  name="price"
                  value={form.price}
                  onChange={onChange}
                  type="number"
                  min="0"
                  step="1"
                  placeholder="e.g., 250"
                  required
                  style={inputStyle}
                />
              </label>

              <label style={{ display: "grid", gap: 6 }}>
                <span>Stock</span>
                <input
                  name="stock"
                  value={form.stock}
                  onChange={onChange}
                  type="number"
                  min="0"
                  step="1"
                  placeholder="e.g., 120"
                  required
                  style={inputStyle}
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 8,
                padding: "12px 14px",
                borderRadius: 12,
                border: "none",
                background: loading ? "#3a3a45" : "#2d6cdf",
                color: "#fff",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Adding..." : "Add Product"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "12px 12px",
  borderRadius: 10,
  border: "1px solid #2b2b33",
  background: "#101014",
  color: "#fff",
  outline: "none",
};
