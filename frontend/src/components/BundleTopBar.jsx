import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function BundleTopBar({ title, subtitle }) {
  const navigate = useNavigate();
  return (
    <div style={{ background:"var(--accent)", color:"#000", padding:"12px 16px",
      display:"flex", alignItems:"center", gap:10 }}>
      <button onClick={() => navigate(-1)}
        style={{ background:"none", border:"none", cursor:"pointer", color:"#000", display:"flex" }}>
        <ArrowLeft size={20} />
      </button>
      <div>
        <div style={{ fontWeight:800, fontSize:15 }}>{title}</div>
        {subtitle && <div style={{ fontSize:12, fontWeight:600 }}>{subtitle}</div>}
      </div>
    </div>
  );
}
