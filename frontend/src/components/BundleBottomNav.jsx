import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PackageOpen, PackageCheck, ScanLine, ClipboardCheck } from "lucide-react";

const TABS = [
  { key: "issue-search",   label: "Issue",         icon: PackageOpen,     route: "/bundle-issue" },
  { key: "issue-entry",    label: "Issue Entry",   icon: ScanLine,        route: "/bundle-issue/entry" },
  { key: "receipt-search", label: "Receipt",       icon: PackageCheck,    route: "/bundle-receipt" },
  { key: "receipt-entry",  label: "Receipt Entry", icon: ClipboardCheck,  route: "/bundle-receipt/entry" },
];

export default function BundleBottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
      display: "flex", background: "var(--surface)",
      borderTop: "1px solid var(--border)",
      paddingBottom: "env(safe-area-inset-bottom, 0px)",
      boxShadow: "0 -4px 16px rgba(0,0,0,0.3)",
    }}>
      {TABS.map(t => {
        const Icon = t.icon;
        const active = pathname === t.route;
        return (
          <button
            key={t.key}
            onClick={() => navigate(t.route)}
            style={{
              flex: 1, background: "none", border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              padding: "10px 4px 8px",
              color: active ? "var(--accent)" : "var(--text3)",
              transition: "color .15s",
            }}
          >
            <Icon size={19} />
            <span style={{ fontSize: 10, fontWeight: 600, textAlign: "center", lineHeight: 1.2 }}>
              {t.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}