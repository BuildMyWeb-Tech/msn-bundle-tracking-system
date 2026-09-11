import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BundleTopBar from "../../components/BundleTopBar";
import BarcodeScanner from "../../components/BarcodeScanner";
import { Search, ScanLine, Camera } from "lucide-react";
import BundleBottomNav from "../../components/BundleBottomNav";
import { getPono, getPonoProcess, getIssuedGrid } from "../../services/bundleService";

export default function BundleIssueSearch() {
  const navigate = useNavigate();
  const [poNo, setPoNo]             = useState("");
  const [process, setProcess]       = useState("Combo");
  const [party, setParty]           = useState("");
  const [processOptions, setProcessOptions] = useState(["Combo"]);
  const [processRows, setProcessRows]       = useState([]);
  const [rows, setRows]             = useState([]);
  const [searched, setSearched]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [gridLoading, setGridLoading] = useState(false);
  const [error, setError]           = useState("");
  const [showScanner, setShowScanner] = useState(false);

  const runSearch = async (value) => {
    const po = (value ?? poNo).trim();
    if (!po) return;

    setLoading(true);
    setError("");
    try {
      await getPono(po); // validates the PO No exists
      const { data: procRows } = await getPonoProcess(po);

      const distinctProcess = [...new Set((procRows || []).map(r => r.Process))];
      setProcessRows(procRows || []);
      setProcessOptions(["Combo", ...distinctProcess]);
      setProcess("Combo");
      setParty("");

      setPoNo(po);
      setRows([]); // grid loads once a specific process is picked
      setSearched(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "PO No not found");
      setProcessOptions(["Combo"]);
      setProcessRows([]);
      setParty("");
      setRows([]);
      setSearched(false);
    } finally {
      setLoading(false);
    }
  };

  const onProcessChange = async (value) => {
    setProcess(value);
    const match = processRows.find(r => r.Process === value);
    setParty(match ? match.Party : "");

    if (!match) { setRows([]); return; }

    setGridLoading(true);
    setError("");
    try {
      const { data: gridRows } = await getIssuedGrid(poNo, match.uid);
      // SP column casing isn't consistent across POs (e.g. styleno/size vs StyleNo/Size) — read case-insensitively
      const pick = (row, key) => {
        const found = Object.keys(row).find(k => k.toLowerCase() === key.toLowerCase());
        return found ? row[found] : undefined;
      };
      setRows((gridRows || []).map(r => ({
        styleNo: pick(r, "StyleNo"),
        size: pick(r, "Size"),
        component: pick(r, "ComponentName"),
        issued: pick(r, "BundleIssued"),
        pending: pick(r, "Pending"),
      })));
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load grid");
      setRows([]);
    } finally {
      setGridLoading(false);
    }
  };

  const onScanBarcode = (text) => {
    setPoNo(text);
    runSearch(text);
  };

  const onScan = () => {
    const match = processRows.find(r => r.Process === process);
    if (!match) return;
    navigate("/bundle-issue/entry", {
      state:{ poNo, process, party, processUid: match.uid, partyUid: match.Partyuid },
    });
  };

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)" }}>
      <BundleTopBar title="Bundle Tracking" subtitle="Bundle Issue" />

      <div style={{ padding:"16px 16px 84px" }}>
        <div className="form-group" style={{ display:"flex", gap:8, alignItems:"flex-end" }}>
          <div style={{ flex:1 }}>
            <label className="form-label" htmlFor="issue-poNo">Po No</label>
            <input id="issue-poNo" className="form-input" value={poNo} onChange={e => setPoNo(e.target.value)}
              placeholder="Enter PO No" onKeyDown={e => e.key === "Enter" && runSearch()} />
          </div>
          <button type="button" className="btn btn-ghost" title="Scan PO Barcode"
            onClick={() => setShowScanner(true)}>
            <Camera size={14} />
          </button>
          <button className="btn btn-primary" disabled={loading} onClick={() => runSearch()}>
            <Search size={14} />Search
          </button>
        </div>

        {error && <div className="login-error">{error}</div>}

        <div className="form-group">
          <label className="form-label">Process</label>
          <select className="form-input" value={process} onChange={e => onProcessChange(e.target.value)}>
            {processOptions.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Party</label>
          <input className="form-input" value={party} readOnly placeholder="Auto-filled after search" />
        </div>

        <div style={{ border:"1px solid var(--border)", borderRadius:"var(--radius-sm)", overflow:"hidden", marginTop:8 }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
            <thead>
              <tr style={{ background:"var(--accent)", color:"#000" }}>
                <th style={{ padding:8, textAlign:"left" }}>Style No</th>
                <th style={{ padding:8, textAlign:"left" }}>Component</th>
                <th style={{ padding:8, textAlign:"left" }}>Size</th>
                <th style={{ padding:8, textAlign:"right" }}>Issued</th>
                <th style={{ padding:8, textAlign:"right" }}>Pending</th>
              </tr>
            </thead>
            <tbody>
              {gridLoading ? (
                <tr><td colSpan={5} style={{ padding:16, textAlign:"center", color:"var(--text3)" }}>Loading...</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={5} style={{ padding:16, textAlign:"center", color:"var(--text3)" }}>
                  {!searched ? "Search a PO to view sizes"
                    : process === "Combo" ? "Select a process to view sizes"
                    : "No records found"}
                </td></tr>
              ) : rows.map((r, i) => (
                <tr key={i} style={{ borderTop:"1px solid var(--border)" }}>
                  <td style={{ padding:8 }}>{r.styleNo}</td>
                  <td style={{ padding:8 }}>{r.component}</td>
                  <td style={{ padding:8 }}>{r.size}</td>
                  <td style={{ padding:8, textAlign:"right" }}>{r.issued}</td>
                  <td style={{ padding:8, textAlign:"right" }}>{r.pending}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

              <button className="btn btn-primary" style={{ width:"100%", marginTop:16 }}
          disabled={!searched || process === "Combo"} onClick={onScan}>
          <ScanLine size={15} /> Scan
        </button>
      </div>

      {showScanner && (
        <BarcodeScanner onScan={onScanBarcode} onClose={() => setShowScanner(false)} />
      )}

      <BundleBottomNav />
    </div>
  );
}
