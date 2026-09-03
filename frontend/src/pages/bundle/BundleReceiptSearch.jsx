import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BundleTopBar from "../../components/BundleTopBar";
import { Eye, ScanLine } from "lucide-react";
import BundleBottomNav from "../../components/BundleBottomNav";
const PROCESS_OPTIONS = ["Combo", "Cutting", "Stitching", "Finishing"];
const PARTY_OPTIONS   = ["Combo", "Party A", "Party B", "Party C"];

const MOCK_ROWS = [
  { styleNo:"STY-1001", size:"S", received:0, pending:120 },
  { styleNo:"STY-1001", size:"M", received:0, pending:180 },
  { styleNo:"STY-1001", size:"L", received:0, pending:150 },
];

export default function BundleReceiptSearch() {
  const navigate = useNavigate();
  const [poNo, setPoNo]       = useState("");
  const [process, setProcess] = useState("Combo");
  const [party, setParty]     = useState("Combo");
  const [rows, setRows]       = useState([]);
  const [shown, setShown]     = useState(false);

  const onShow = () => {
    if (!poNo.trim()) return;
    // TODO: replace with real PO lookup SP
    setRows(MOCK_ROWS);
    setShown(true);
  };

  const onScan = () => {
    navigate("/bundle-receipt/entry", { state:{ poNo, process, party } });
  };

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)" }}>
      <BundleTopBar title="Bundle Tracking" subtitle="Bundle Receipt" />

      <div style={{ padding:16 }}>
        <div className="form-group" style={{ display:"flex", gap:8, alignItems:"flex-end" }}>
          <div style={{ flex:1 }}>
            <label className="form-label">Po No</label>
            <input className="form-input" value={poNo} onChange={e => setPoNo(e.target.value)} placeholder="Enter PO No" />
          </div>
          <button className="btn btn-primary" onClick={onShow}><Eye size={14} />Show</button>
        </div>

        <div className="form-group">
          <label className="form-label">Process</label>
          <select className="form-input" value={process} onChange={e => setProcess(e.target.value)}>
            {PROCESS_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Party</label>
          <select className="form-input" value={party} onChange={e => setParty(e.target.value)}>
            {PARTY_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div style={{ border:"1px solid var(--border)", borderRadius:"var(--radius-sm)", overflow:"hidden", marginTop:8 }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
            <thead>
              <tr style={{ background:"var(--accent)", color:"#000" }}>
                <th style={{ padding:8, textAlign:"left" }}>Style No</th>
                <th style={{ padding:8, textAlign:"left" }}>Size</th>
                <th style={{ padding:8, textAlign:"right" }}>Received</th>
                <th style={{ padding:8, textAlign:"right" }}>Pending</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan={4} style={{ padding:16, textAlign:"center", color:"var(--text3)" }}>
                  {shown ? "No records found" : "Show a PO to view sizes"}
                </td></tr>
              ) : rows.map((r, i) => (
                <tr key={i} style={{ borderTop:"1px solid var(--border)" }}>
                  <td style={{ padding:8 }}>{r.styleNo}</td>
                  <td style={{ padding:8 }}>{r.size}</td>
                  <td style={{ padding:8, textAlign:"right" }}>{r.received}</td>
                  <td style={{ padding:8, textAlign:"right" }}>{r.pending}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

              <button className="btn btn-primary" style={{ width:"100%", marginTop:16 }}
          disabled={!shown} onClick={onScan}>
          <ScanLine size={15} /> Scan
        </button>
      </div>

      <BundleBottomNav />
    </div>
  );
}