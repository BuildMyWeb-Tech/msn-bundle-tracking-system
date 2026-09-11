import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BundleTopBar from "../../components/BundleTopBar";
import BarcodeScanner from "../../components/BarcodeScanner";
import { ScanLine, Save, CheckCircle2 } from "lucide-react";
import BundleBottomNav from "../../components/BundleBottomNav";
import { issueBundle } from "../../services/bundleService";

function todayISODate() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function BundleIssueEntry() {
  const { state }  = useLocation();
  const navigate   = useNavigate();
  const poNo       = state?.poNo || "";
  const process    = state?.process || "Combo";
  const party      = state?.party || "";
  const processUid = state?.processUid;
  const partyUid   = state?.partyUid;
  const missingContext = !poNo || !processUid || !partyUid;

  const [barcode, setBarcode]   = useState("");
  const [rows, setRows]         = useState([]);
  const [sessionUid, setSessionUid] = useState(0);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState("");
  const [scanning, setScanning] = useState(false);

  const addRow = async (code) => {
    const bc = code.trim();
    if (!bc || saving) return;
    if (rows.some(r => r.barcode === bc)) {
      setError("Barcode already scanned in this session");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const { data } = await issueBundle({
        uid: sessionUid,
        date: todayISODate(),
        pono: poNo,
        processid: processUid,
        partyid: partyUid,
        barcode: bc,
      });
      setSessionUid(data.uid);
      setRows(prev => [...prev, { barcode: bc, message: data.message }]);
      setBarcode("");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to save barcode");
    } finally {
      setSaving(false);
    }
  };

  const onManualAdd = () => addRow(barcode);

  const onDone = () => navigate("/bundle-issue");

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)" }}>
      <BundleTopBar title="Bundle Tracking" subtitle="Bundle Issue" />

      <div style={{ padding:"16px 16px 84px" }}>
        <div style={{ fontSize:12, color:"var(--text2)", marginBottom:12 }}>
          PO: <b style={{ color:"var(--text)" }}>{poNo}</b> &nbsp;·&nbsp;
          Process: <b style={{ color:"var(--text)" }}>{process}</b> &nbsp;·&nbsp;
          Party: <b style={{ color:"var(--text)" }}>{party}</b>
        </div>

        {missingContext ? (
          <div className="login-error">
            Missing PO/Process/Party — go back and search a PO, then pick a specific process before scanning.
          </div>
        ) : (
          <>
            <div className="form-group" style={{ display:"flex", gap:8, alignItems:"flex-end" }}>
              <div style={{ flex:1 }}>
                <label className="form-label">Barcode</label>
                <input className="form-input" value={barcode} onChange={e => setBarcode(e.target.value)}
                  placeholder="Scan or type barcode" disabled={saving}
                  onKeyDown={e => e.key === "Enter" && onManualAdd()} />
              </div>
              <button className="btn btn-ghost" disabled={saving} onClick={() => setScanning(true)}><ScanLine size={14} /></button>
              <button className="btn btn-primary" disabled={saving} onClick={onDone}><Save size={14} />Save</button>
            </div>

            {error && <div className="login-error">{error}</div>}

            <div style={{ border:"1px solid var(--border)", borderRadius:"var(--radius-sm)", overflow:"hidden", marginTop:8 }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                <thead>
                  <tr style={{ background:"var(--accent)", color:"#000" }}>
                    <th style={{ padding:8, textAlign:"left" }}>Barcode</th>
                    <th style={{ padding:8, textAlign:"left" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr><td colSpan={2} style={{ padding:16, textAlign:"center", color:"var(--text3)" }}>
                      {saving ? "Saving..." : "Scan a barcode to add a bundle"}
                    </td></tr>
                  ) : rows.map((r, i) => (
                    <tr key={i} style={{ borderTop:"1px solid var(--border)" }}>
                      <td style={{ padding:8 }}>{r.barcode}</td>
                      <td style={{ padding:8, display:"flex", alignItems:"center", gap:6, color:"var(--accent)" }}>
                        <CheckCircle2 size={13} />{r.message || "Saved"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

          {scanning && <BarcodeScanner onScan={addRow} onClose={() => setScanning(false)} />}
      <BundleBottomNav />
    </div>
  );
}
