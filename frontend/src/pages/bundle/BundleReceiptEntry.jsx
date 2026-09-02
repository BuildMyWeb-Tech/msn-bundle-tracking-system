import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BundleTopBar from "../../components/BundleTopBar";
import BarcodeScanner from "../../components/BarcodeScanner";
import { ScanLine, Save, Trash2 } from "lucide-react";

export default function BundleReceiptEntry() {
  const { state } = useLocation();
  const navigate  = useNavigate();
  const poNo      = state?.poNo || "";
  const process   = state?.process || "Combo";
  const party     = state?.party || "";

  const [barcode, setBarcode]   = useState("");
  const [rows, setRows]         = useState([]);
  const [scanning, setScanning] = useState(false);

  const addRow = (code) => {
    // TODO: replace with real barcode-lookup SP (style/size/qty from label)
    setRows(prev => [...prev, { styleNo:"STY-1001", size:"M", qty:1, barcode:code }]);
  };

  const onManualAdd = () => {
    if (!barcode.trim()) return;
    addRow(barcode.trim());
    setBarcode("");
  };

  const onDelete = (idx) => setRows(prev => prev.filter((_, i) => i !== idx));

  const onSave = () => {
    // TODO: POST rows to Bundle Receipt save SP once available
    navigate("/bundle-receipt");
  };

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)" }}>
      <BundleTopBar title="Bundle Tracking" subtitle="Bundle Receipt" />

      <div style={{ padding:16 }}>
        <div style={{ fontSize:12, color:"var(--text2)", marginBottom:12 }}>
          PO: <b style={{ color:"var(--text)" }}>{poNo}</b> &nbsp;·&nbsp;
          Process: <b style={{ color:"var(--text)" }}>{process}</b> &nbsp;·&nbsp;
          Party: <b style={{ color:"var(--text)" }}>{party}</b>
        </div>

        <div className="form-group" style={{ display:"flex", gap:8, alignItems:"flex-end" }}>
          <div style={{ flex:1 }}>
            <label className="form-label">Barcode</label>
            <input className="form-input" value={barcode} onChange={e => setBarcode(e.target.value)}
              placeholder="Scan or type barcode" onKeyDown={e => e.key === "Enter" && onManualAdd()} />
          </div>
          <button className="btn btn-ghost" onClick={() => setScanning(true)}><ScanLine size={14} /></button>
          <button className="btn btn-primary" onClick={onSave}><Save size={14} />Save</button>
        </div>

        <div style={{ border:"1px solid var(--border)", borderRadius:"var(--radius-sm)", overflow:"hidden", marginTop:8 }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
            <thead>
              <tr style={{ background:"var(--accent)", color:"#000" }}>
                <th style={{ padding:8, textAlign:"left" }}>Style No</th>
                <th style={{ padding:8, textAlign:"left" }}>Size</th>
                <th style={{ padding:8, textAlign:"right" }}>Qty</th>
                <th style={{ padding:8, textAlign:"left" }}>Barcode</th>
                <th style={{ padding:8 }}></th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan={5} style={{ padding:16, textAlign:"center", color:"var(--text3)" }}>Scan a barcode to add a bundle</td></tr>
              ) : rows.map((r, i) => (
                <tr key={i} style={{ borderTop:"1px solid var(--border)" }}>
                  <td style={{ padding:8 }}>{r.styleNo}</td>
                  <td style={{ padding:8 }}>{r.size}</td>
                  <td style={{ padding:8, textAlign:"right" }}>{r.qty}</td>
                  <td style={{ padding:8 }}>{r.barcode}</td>
                  <td style={{ padding:8, textAlign:"right" }}>
                    <button onClick={() => onDelete(i)} style={{ background:"none", border:"none", color:"var(--red)", cursor:"pointer" }}>
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {scanning && <BarcodeScanner onScan={addRow} onClose={() => setScanning(false)} />}
    </div>
  );
}
