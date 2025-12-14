import React, { useEffect, useState } from "react";
import NavbarRegistered from "../NavbarRegistered/NavbarRegistered";
import FooterNew from "../Footer/FooterNew";

function About() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetch("http://localhost:8070/product")
      .then((r) => r.json())
      .then((d) => setProducts(d))
      .catch(() => {});
  }, []);
  return (
    <div>
      <NavbarRegistered />
      <div style={{ paddingTop: 80 }}>
        <div className="container">
          <h3>About</h3>
          <p>Fresh local produce, delivered. Explore a sample of our catalog:</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
            {products.slice(0, 12).map((p) => (
              <div key={p._id} style={{ border: "1px solid #eee", padding: 10 }}>
                <img src={p.productImage} alt={p.productName} style={{ width: "100%", height: 120, objectFit: "cover" }} />
                <p>{p.productName}</p>
                <p style={{ fontSize: 12 }}>{p.productCategory}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <FooterNew />
    </div>
  );
}

export default About;
