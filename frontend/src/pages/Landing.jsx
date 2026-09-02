import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PackageOpen, PackageCheck, LogOut } from "lucide-react";

const TILES = [
  { key:"issue",   label:"Bundle Issue",   icon:PackageOpen,  route:"/bundle-issue",   match:"issue" },
  { key:"receipt", label:"Bundle Receipt", icon:PackageCheck, route:"/bundle-receipt", match:"receipt" },
];

export default function Landing() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuNames = (user?.menus || []).map(m => (m.menuName || "").toLowerCase());
  // Fall back to showing both tiles until the menu SP data is confirmed live
  const visibleTiles = menuNames.length
    ? TILES.filter(t => menuNames.some(n => n.includes(t.match)))
    : TILES;

  const onLogout = () => { logout(); navigate("/login", { replace:true }); };

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", display:"flex", flexDirection:"column" }}>
      <div style={{ background:"var(--accent)", color:"#000", fontWeight:800, fontSize:16,
        textAlign:"center", padding:"14px 16px" }}>
        Bundle Tracking
      </div>

      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center",
        justifyContent:"center", gap:20, padding:24 }}>
        {visibleTiles.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.key} onClick={() => navigate(t.route)}
              style={{
                width:"100%", maxWidth:280, padding:"28px 16px",
                background:"var(--surface)", border:"1px solid var(--border)",
                borderRadius:"var(--radius)", color:"var(--text)",
                display:"flex", flexDirection:"column", alignItems:"center", gap:10,
                fontSize:15, fontWeight:700, cursor:"pointer", transition:"all .15s",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
              <Icon size={30} style={{ color:"var(--accent)" }} />
              {t.label}
            </button>
          );
        })}
      </div>

      <div style={{ padding:16 }}>
        <button className="btn btn-ghost-danger" style={{ width:"100%", padding:12 }} onClick={onLogout}>
          <LogOut size={15} /> Log Out
        </button>
      </div>
    </div>
  );
}
