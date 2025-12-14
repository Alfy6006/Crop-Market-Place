import React, { useEffect, useState } from "react";
import NavbarRegistered from "../NavbarRegistered/NavbarRegistered";
import FooterNew from "../Footer/FooterNew";

function InquiryPage() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ receiverEmail: "", subject: "", message: "", productId: "" });
  const token = window.localStorage.getItem("token");
  const email = (() => { if (!token) return null; try { return JSON.parse(atob(token.split(".")[1])).email || null; } catch { return null; } })();
  const [toast, setToast] = useState("");

  const load = async () => {
    if (!email) return;
    try {
      const r = await fetch(`http://localhost:8070/inquiry/by-sender/${email}`);
      const d = await r.json();
      setList(d);
    } catch {}
  };

  useEffect(() => { load(); }, [email]);

  const submit = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      const r = await fetch("http://localhost:8070/inquiry/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderEmail: email, receiverEmail: form.receiverEmail, subject: form.subject, message: form.message, productId: form.productId || undefined }),
      });
      if (r.ok) { setForm({ receiverEmail: "", subject: "", message: "", productId: "" }); setToast("Inquiry sent successfully"); setTimeout(() => setToast(""), 2000); load(); }
    } catch {}
  };

  return (
    <div>
      <NavbarRegistered />
      <div style={{ paddingTop: 80 }}>
        <div className="container">
          <h3>Order Inquiries</h3>
          {toast && <div style={{ position: "fixed", top: 70, left: "50%", transform: "translateX(-50%)", background: "#222", color: "#fff", padding: "8px 12px", borderRadius: 8, zIndex: 1000 }}>{toast}</div>}
          <form onSubmit={submit} style={{ display: "grid", gap: 10, maxWidth: 500 }}>
            <input placeholder="Receiver email" value={form.receiverEmail} onChange={(e) => setForm({ ...form, receiverEmail: e.target.value })} />
            <input placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            <textarea placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            <input placeholder="Product ID (optional)" value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })} />
            <button type="submit">Send</button>
          </form>
          <h4 style={{ marginTop: 20 }}>My inquiries</h4>
          {list.length === 0 ? <p>No inquiries</p> : (
            <div>
              {list.map((i) => (
                <div key={i._id} style={{ borderBottom: "1px solid #eee", padding: 8 }}>
                  <p>To: {i.receiverEmail}</p>
                  <p>{i.subject}</p>
                  <p>{i.message}</p>
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

export default InquiryPage;
