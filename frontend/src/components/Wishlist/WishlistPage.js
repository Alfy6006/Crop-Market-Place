import React, { useEffect, useState } from "react";
import NavbarRegistered from "../NavbarRegistered/NavbarRegistered";
import FooterNew from "../Footer/FooterNew";

function WishlistPage() {
  const [items, setItems] = useState([]);
  const email = (() => {
    const token = window.localStorage.getItem("token");
    if (!token) return null;
    try { return JSON.parse(atob(token.split(".")[1])).email || null; } catch { return null; }
  })();

  useEffect(() => {
    try {
      const local = JSON.parse(window.localStorage.getItem("wishlist") || "[]");
      if (local.length > 0) { setItems(local); return; }
    } catch {}
    if (email) {
      fetch(`http://localhost:8070/wishlist/${email}`)
        .then((r) => r.json())
        .then((d) => setItems(d.map((w) => ({ id: w._id, name: w.productId?.productName, image: w.productId?.productImage }))))
        .catch(() => {});
    }
  }, [email]);

  const remove = async (id) => {
    const local = JSON.parse(window.localStorage.getItem("wishlist") || "[]");
    const next = local.filter((x) => x.id !== id);
    window.localStorage.setItem("wishlist", JSON.stringify(next));
    setItems(next);
  };

  return (
    <div>
      <NavbarRegistered />
      <div style={{ paddingTop: 80 }}>
        <div className="container">
          <h3>Wishlist</h3>
          {items.length === 0 ? (
            <p>No saved items</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
              {items.map((w) => (
                <div key={w.id} style={{ border: "1px solid #eee", padding: 10 }}>
                  <img src={w.image} alt={w.name} style={{ width: "100%", height: 120, objectFit: "cover" }} />
                  <p>{w.name}</p>
                  <button onClick={() => remove(w.id)}>Remove</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <FooterNew />
    </div>
  );
}

export default WishlistPage;
