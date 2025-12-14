import React, { useEffect, useState } from "react";
import NavbarRegistered from "../NavbarRegistered/NavbarRegistered";
import FooterNew from "../Footer/FooterNew";

function CartPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(window.localStorage.getItem("cart") || "[]");
    setItems(saved);
  }, []);

  const update = (next) => {
    setItems(next);
    window.localStorage.setItem("cart", JSON.stringify(next));
  };

  const changeQty = (idx, qty) => {
    const next = items.slice();
    next[idx].qty = Math.max(1, Number(qty || 1));
    update(next);
  };

  const remove = (idx) => {
    const next = items.slice();
    next.splice(idx, 1);
    update(next);
  };

  const total = items.reduce((sum, it) => sum + (Number(it.price || 0) * Number(it.qty || 1)), 0);

  return (
    <div>
      <NavbarRegistered />
      <div className="container" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <h3>Your Cart</h3>
        {items.length === 0 ? (
          <p>No items in cart</p>
        ) : (
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
            <a href="/checkout"><button>Proceed to Checkout</button></a>
          </div>
        )}
      </div>
      <FooterNew />
    </div>
  );
}

export default CartPage;
