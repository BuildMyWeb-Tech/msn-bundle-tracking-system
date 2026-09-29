import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  PackageOpen, PackageCheck, Scale, ClipboardCheck, Layers,
  ShoppingBag, Boxes, Shirt, FileCheck2, LogOut,
} from "lucide-react";
import BundleBottomNav from "../components/BundleBottomNav";

// Known menus get a real route + icon; anything else falls back to a
// "Coming soon" placeholder so new SP menus never produce a dead tile.
const KNOWN_MENUS = {
  "bundle issue":     { icon:PackageOpen,     route:"/bundle-issue" },
  "bundle receipt":   { icon:PackageCheck,    route:"/bundle-receipt" },
  "pc. wt. approval": { icon:Scale,           route:"/pc-wt-approval" },
  "quality data":     { icon:ClipboardCheck,  route:null },
  "fabric data":      { icon:Layers,          route:null },
  "merch data":       { icon:ShoppingBag,     route:null },
  "surplus fabric":   { icon:Boxes,           route:null },
  "surplus garment":  { icon:Shirt,           route:null },
};

const FALLBACK_TILES = [
  { key:"issue",   label:"Bundle Issue",   icon:PackageOpen,  route:"/bundle-issue" },
  { key:"receipt", label:"Bundle Receipt", icon:PackageCheck, route:"/bundle-receipt" },
];

export default function Landing() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menus = user?.menus || [];
  const tiles = menus.length
    ? menus.map(m => {
        const known = KNOWN_MENUS[(m.menuName || "").toLowerCase().trim()];
        return {
          key: m.menuName,
          label: m.menuName,
          icon: known?.icon || FileCheck2,
          route: known?.route || "/coming-soon",
        };
      })
    : FALLBACK_TILES;

  const onLogout = () => { logout(); navigate("/login", { replace:true }); };

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", display:"flex", flexDirection:"column" }}>
      <div style={{ background:"var(--accent)", color:"#000", fontWeight:800, fontSize:16,
        textAlign:"center", padding:"14px 16px" }}>
        Bundle Tracking
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:20 }}>
        <div style={{
          display:"grid", gridTemplateColumns:"repeat(2, 1fr)", gap:14,
          maxWidth:480, margin:"0 auto",
        }}>
          {tiles.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.key} onClick={() => navigate(t.route, { state:{ title:t.label } })}
                style={{
                  padding:"22px 12px",
                  background:"var(--surface)", border:"1px solid var(--border)",
                  borderRadius:"var(--radius)", color:"var(--text)",
                  display:"flex", flexDirection:"column", alignItems:"center", gap:8,
                  fontSize:13, fontWeight:700, cursor:"pointer", transition:"all .15s",
                  textAlign:"center",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
                <Icon size={26} style={{ color:"var(--accent)" }} />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ padding:16 }}>
        <button className="btn btn-ghost-danger" style={{ width:"100%", padding:12 }} onClick={onLogout}>
          <LogOut size={15} /> Log Out
        </button>
      </div>

      <BundleBottomNav />
    </div>
  );
}
