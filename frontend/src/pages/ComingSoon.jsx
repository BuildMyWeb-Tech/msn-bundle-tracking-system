import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Construction, ArrowLeft } from "lucide-react";
import BundleBottomNav from "../components/BundleBottomNav";

export default function ComingSoon() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const title = state?.title || "This screen";

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", display:"flex", flexDirection:"column" }}>
      <div style={{ background:"var(--accent)", color:"#000", fontWeight:800, fontSize:16,
        textAlign:"center", padding:"14px 16px" }}>
        Bundle Tracking
      </div>

      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center",
        justifyContent:"center", gap:14, padding:24, textAlign:"center" }}>
        <Construction size={40} style={{ color:"var(--accent)" }} />
        <div style={{ fontSize:16, fontWeight:700, color:"var(--text)" }}>{title}</div>
        <div style={{ fontSize:13, color:"var(--text3)", maxWidth:280 }}>
          This screen is coming soon.
        </div>
        <button className="btn btn-ghost" style={{ marginTop:8, padding:"10px 20px" }}
          onClick={() => navigate("/")}>
          <ArrowLeft size={14} /> Back to Home
        </button>
      </div>

      <BundleBottomNav />
    </div>
  );
}
