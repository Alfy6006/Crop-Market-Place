import React, { useState, useEffect } from "react";
import "./ProductPage.css";
import NavbarRegistered from "../NavbarRegistered/NavbarRegistered";
import FooterNew from "../Footer/FooterNew";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartSolid, faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { Link } from "react-router-dom";


function ProductPage() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showProducts, setShowProducts] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showGallery, setShowGallery] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [reviewInputs, setReviewInputs] = useState({});
  const [reviewSummary, setReviewSummary] = useState({});
  const [showCartPanel, setShowCartPanel] = useState(false);
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:8070/product");
      const data = await response.json();
      setProducts(data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    fetch("http://localhost:8070/deliverypost")
      .then((r) => r.json())
      .then((d) => setDeliveryPartners(d))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const email = getEmailFromToken();
    if (email) {
      fetch(`http://localhost:8070/wishlist/${email}`)
        .then((r) => r.json())
        .then((data) => setWishlist(data))
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    const summaries = {};
    const fetchSummary = async (id) => {
      try {
        const r = await fetch(`http://localhost:8070/review/product/${id}/summary`);
        const s = await r.json();
        summaries[id] = s;
        setReviewSummary((prev) => ({ ...prev, [id]: s }));
      } catch (e) {}
    };
    products.forEach((p) => p._id && fetchSummary(p._id));
  }, [products]);

  useEffect(() => {
    const onOrdersUpdated = () => {
      fetch("http://localhost:8070/product")
        .then((r) => r.json())
        .then((d) => { setProducts(d); setShowProducts(true); })
        .catch(() => {});
    };
    window.addEventListener("ordersUpdated", onOrdersUpdated);
    return () => window.removeEventListener("ordersUpdated", onOrdersUpdated);
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.productCategory === selectedCategory)
    : products;

  const groupProducts = (products) => {
    const groups = [];
    for (let i = 0; i < products.length; i += 5) {
      groups.push(products.slice(i, i + 5));
    }
    return groups;
  };

  const getEmailFromToken = () => {
    const token = window.localStorage.getItem("token");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.email || null;
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const onOpenProfile = () => setShowProfilePanel(true);
    const onOpenCart = () => setShowCartPanel(true);
    window.addEventListener("openProfile", onOpenProfile);
    window.addEventListener("openCart", onOpenCart);
    return () => {
      window.removeEventListener("openProfile", onOpenProfile);
      window.removeEventListener("openCart", onOpenCart);
    };
  }, []);

  const addToCart = (product) => {
    const role = window.localStorage.getItem("userRole");
    if (role !== "Farmer") { alert("Cart is available for Farmer role"); return; }
    const saved = JSON.parse(window.localStorage.getItem("cart") || "[]");
    const existing = saved.find((i) => i.id === product._id);
    if (existing) existing.qty = (existing.qty || 1) + 1;
    else saved.push({ id: product._id, name: product.productName, image: product.productImage, price: product.price || 0, qty: 1 });
    window.localStorage.setItem("cart", JSON.stringify(saved));
    setCart(saved);
  };

  const saveForLater = async (productId) => {
    const email = getEmailFromToken();
    if (!email) {
      alert("Please login to save items");
      return;
    }
    try {
      const r = await fetch("http://localhost:8070/wishlist/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: email, productId }),
      });
      if (r.ok) {
        const item = await r.json();
        setWishlist((prev) => [...prev, item]);
      }
    } catch (e) {}
  };

  const openGallery = (product) => {
    setSelectedProduct(product);
    setActiveImageIndex(0);
    setShowGallery(true);
  };

  const submitReview = async (productId) => {
    const email = getEmailFromToken();
    if (!email) {
      alert("Please login to review items");
      return;
    }
    try {
      const r = await fetch("http://localhost:8070/review/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          userEmail: email,
          rating: Number((reviewInputs[productId]?.rating) || 5),
          comment: (reviewInputs[productId]?.comment) || "",
        }),
      });
      if (r.ok) {
        const s = await fetch(`http://localhost:8070/review/product/${productId}/summary`);
        const summary = await s.json();
        setReviewSummary((prev) => ({ ...prev, [productId]: summary }));
        setReviewInputs((prev) => ({ ...prev, [productId]: { rating: 5, comment: "" } }));
      }
    } catch (e) {}
  };

  return (
    <div>
      <NavbarRegistered />
      <div className="nothing"></div>

      <div className="image-row"></div>

      <div className={`product-container ${showProducts ? "show" : ""}`}>
          {/* SELLER ONLY: Add Product Button */}
  {window.localStorage.getItem("userRole") === "Seller" && (
    <div style={{ display: "flex", justifyContent: "flex-end", padding: "0 20px 15px" }}>
      <Link to="/seller/add-product">
        <button
          style={{
            background: "#6fa86f",
            color: "white",
            padding: "10px 16px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          + Add Product
        </button>
      </Link>
    </div>
  )}
        <div className="products-grid">
          {filteredProducts.map((product, index) => (
            <div key={index} className="product-card">
              
              <img className="card-media" src={`${process.env.PUBLIC_URL}/Products/${product.productName}.png`} alt={product.productName} onClick={() => openGallery(product)} />
              <div className="card-body">
                <div className="card-title">{product.productName}</div>
                <div className="card-sub">{product.productCategory}</div>
                <div className="price-row">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FontAwesomeIcon key={star} icon={faStarSolid} color={star <= Math.round(reviewSummary[product._id]?.avg || 0) ? "#fc0" : "#ddd"} />
                  ))}
                  <span style={{ fontSize: 12 }}>({reviewSummary[product._id]?.count || 0})</span>
                </div>
                <div className="actions-row">
                  <FontAwesomeIcon icon={faHeartRegular} onClick={() => { saveForLater(product._id); try { const list = JSON.parse(window.localStorage.getItem("wishlist") || "[]"); list.push({ id: product._id, name: product.productName, image: product.productImage }); window.localStorage.setItem("wishlist", JSON.stringify(list)); setToast(`${product.productName} saved for later`); setTimeout(() => setToast(""), 2000); } catch {} }} />
                  <span>Rs.{Number(product.price || 0).toFixed(2)}</span>
                  <span>Stock: {product.stock ?? 0}</span>
                </div>
                <div className="qty-row">
                  <input type="number" min="1" defaultValue={1} onChange={(e) => (product._desiredQty = Math.max(1, Number(e.target.value || 1)))} />
                  <button className="add-btn" onClick={() => {
                    const qty = product._desiredQty || 1;
                    const role = window.localStorage.getItem("userRole");
                    if (role !== "Farmer") { alert("Cart is available for Farmer role"); return; }
                    const saved = JSON.parse(window.localStorage.getItem("cart") || "[]");
                    const existing = saved.find((i) => i.id === product._id);
                    if (existing) existing.qty = (existing.qty || 1) + qty;
                    else saved.push({ id: product._id, name: product.productName, image: product.productImage, price: product.price || 0, qty });
                    window.localStorage.setItem("cart", JSON.stringify(saved));
                    setToast(`${product.productName} added to cart. Go to Cart to checkout.`);
                    setTimeout(() => setToast(""), 2000);
                  }}>Add to cart</button>
                </div>
                <div className="review-inputs">
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    {[1, 2, 3, 4, 5].map((r) => (
                      <FontAwesomeIcon key={r} icon={faStarSolid} color={r <= ((reviewInputs[product._id]?.rating) || 0) ? "#fc0" : "#ddd"} onClick={() => setReviewInputs((p) => ({ ...p, [product._id]: { ...(p[product._id] || { comment: "" }), rating: r } }))} />
                    ))}
                  </div>
                  <input type="text" placeholder="Write a review" value={(reviewInputs[product._id]?.comment) || ""} onChange={(e) => setReviewInputs((p) => ({ ...p, [product._id]: { ...(p[product._id] || { rating: 5 }), comment: e.target.value } }))} />
                  <button onClick={() => submitReview(product._id)}>Submit</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {toast && (
        <div style={{ position: "fixed", top: 70, left: "50%", transform: "translateX(-50%)", background: "#222", color: "#fff", padding: "8px 12px", borderRadius: 8, zIndex: 1000 }}>{toast}</div>
      )}

      {showGallery && selectedProduct && (
        <div className="modal">
          <div className="modal-content">
            <button className="close" onClick={() => setShowGallery(false)}>×</button>
            <div className="main-image">
              <img
                src={(selectedProduct.images && selectedProduct.images.length > 0)
                  ? selectedProduct.images[activeImageIndex]
                  : selectedProduct.productImage}
                alt={selectedProduct.productName}
              />
            </div>
            <div className="thumbnails">
              {(selectedProduct.images || []).map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={selectedProduct.productName}
                  className={idx === activeImageIndex ? "active" : ""}
                  onClick={() => setActiveImageIndex(idx)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {showProfilePanel && (
        <div className="modal">
          <div className="modal-content" style={{ maxWidth: 600 }}>
            <button className="close" onClick={() => setShowProfilePanel(false)}>×</button>
            <ProfilePanel />
          </div>
        </div>
      )}

      {showCartPanel && (
        <div className="modal">
          <div className="modal-content" style={{ maxWidth: 800 }}>
            <button className="close" onClick={() => setShowCartPanel(false)}>×</button>
            <CartPanel deliveryPartners={deliveryPartners} selectedPartner={selectedPartner} setSelectedPartner={setSelectedPartner} />
          </div>
        </div>
      )}

      <div className="footer">
        <FooterNew />
      </div>
    </div>
  );
}

export default ProductPage;

function ProfilePanel() {
  const [data, setData] = useState(null);
  const role = window.localStorage.getItem("userRole");
  const token = window.localStorage.getItem("token");
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const url = role === "Farmer" ? "http://localhost:8070/farmer/userdata"
      : role === "Seller" ? "http://localhost:8070/seller/userdata"
      : "http://localhost:8070/deliveryman/userdata";
    fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) })
      .then((r) => r.json())
      .then((j) => { if (j.status === "ok") setData(j.data); })
      .catch(() => {});
    try {
      setOrders(JSON.parse(window.localStorage.getItem("orders") || "[]"));
    } catch {}
  }, [role, token]);
  return (
    <div>
      <h3>Profile</h3>
      {!data ? <p>Loading...</p> : (
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
  );
}

function CartPanel({ deliveryPartners, selectedPartner, setSelectedPartner }) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    try { setItems(JSON.parse(window.localStorage.getItem("cart") || "[]")); } catch {}
  }, []);
  const update = (next) => { setItems(next); window.localStorage.setItem("cart", JSON.stringify(next)); };
  const changeQty = (idx, qty) => { const next = items.slice(); next[idx].qty = Math.max(1, Number(qty || 1)); update(next); };
  const remove = (idx) => { const next = items.slice(); next.splice(idx, 1); update(next); };
  const total = items.reduce((sum, it) => sum + (Number(it.price || 0) * Number(it.qty || 1)), 0);
  const checkout = () => {
    const orders = JSON.parse(window.localStorage.getItem("orders") || "[]");
    const partner = deliveryPartners.find((p) => p._id === selectedPartner);
    orders.push({ date: Date.now(), items, total, partnerId: selectedPartner || null, partnerName: partner?.name || null });
    window.localStorage.setItem("orders", JSON.stringify(orders));
    window.localStorage.setItem("cart", JSON.stringify([]));
    items.forEach(async (it) => {
      try {
        await fetch(`http://localhost:8070/product/adjust-stock/${it.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ delta: -Number(it.qty || 1) }),
        });
      } catch {}
    });
    window.dispatchEvent(new CustomEvent("ordersUpdated"));
    alert("Order confirmed");
  };
  return (
    <div>
      <h3>Your Cart</h3>
      {items.length === 0 ? <p>No items</p> : (
        <div>
          {items.map((it, idx) => (
            <div key={it.id || idx} style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <img src={it.image} alt={it.name} style={{ width: 60, height: 60, objectFit: "cover" }} />
              <div style={{ flex: 1 }}>
                <p>{it.name}</p>
                <p>Price: Rs.{Number(it.price || 0).toFixed(2)}</p>
              </div>
              <input type="number" value={it.qty || 1} onChange={(e) => changeQty(idx, e.target.value)} />
              <button onClick={() => remove(idx)}>Remove</button>
            </div>
          ))}
          <hr />
          <p>Total: Rs.{Number(total).toFixed(2)}</p>
          <div>
            <label>Select Delivery Partner</label>
            <select value={selectedPartner} onChange={(e) => setSelectedPartner(e.target.value)}>
              <option value="">None</option>
              {deliveryPartners.map((p) => (
                <option key={p._id} value={p._id}>{p.name} - {p.model} ({p.capacity}kg)</option>
              ))}
            </select>
          </div>
          <button onClick={checkout}>Checkout</button>
        </div>
      )}
    </div>
  );
}
