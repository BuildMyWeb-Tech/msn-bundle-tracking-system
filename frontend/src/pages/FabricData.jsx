import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BundleTopBar from "../components/BundleTopBar";
import BarcodeScanner from "../components/BarcodeScanner";
import { Download, RotateCcw, ArrowLeft, Camera } from "lucide-react";
import { getFabricData } from "../services/fabricService";

const FIELDS = [
  ["fabric",   "Fabric"],
  ["colour",   "Colour"],
  ["weight",   "Weight"],
  ["rolls",    "Rolls"],
  ["location", "Location"],
  ["party",    "Party"],
  ["dcNo",     "DC No"],
  ["docDate",  "Doc Date"],
  ["docNo",    "Doc No"],
];

export default function FabricData() {
  const navigate = useNavigate();
  const [barcode, setBarcode] = useState("");
  const [poNo, setPoNo]       = useState("");
  const [info, setInfo]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [showScanner, setShowScanner] = useState(false);

  const runGet = async (value) => {
    const bc = (value ?? barcode).trim();
    if (!bc) return;
    setLoading(true);
    setError("");
    try {
      const { data } = await getFabricData(bc);
      setBarcode(bc);
      setPoNo(data.pono);
      setInfo(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Invalid Barcode");
      setPoNo("");
      setInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const onScanBarcode = (text) => {
    setBarcode(text);
    runGet(text);
  };

  const onReset = () => {
    setBarcode("");
    setPoNo("");
    setInfo(null);
    setError("");
  };

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)" }}>
      <BundleTopBar title="Bundle Tracking" subtitle="Fabric Data" />

      <div style={{ padding:"16px 16px 84px" }}>
        <div className="form-group" style={{ display:"flex", gap:8, alignItems:"flex-end" }}>
          <div style={{ flex:1 }}>
            <label className="form-label" htmlFor="fd-barcode">Barcode</label>
            <input id="fd-barcode" className="form-input" value={barcode}
              onChange={e => setBarcode(e.target.value)} placeholder="Enter Barcode"
              onKeyDown={e => e.key === "Enter" && runGet()} />
          </div>
          <button type="button" className="btn btn-ghost" title="Scan Barcode"
            onClick={() => setShowScanner(true)}>
            <Camera size={14} />
          </button>
          <button className="btn btn-primary" disabled={loading} onClick={() => runGet()}>
            <Download size={14} />Get
          </button>
        </div>

        {error && <div className="login-error">{error}</div>}

        <div className="form-group">
          <label className="form-label" htmlFor="fd-poNo">Po No</label>
          <input id="fd-poNo" className="form-input" value={poNo} readOnly placeholder="Auto" />
        </div>

        {FIELDS.map(([key, label]) => (
          <div className="form-group" key={key}>
            <label className="form-label" htmlFor={`fd-${key}`}>{label}</label>
            <input id={`fd-${key}`} className="form-input" value={info ? (info[key] ?? "") : ""} readOnly placeholder="Auto" />
          </div>
        ))}

        <div style={{ display:"flex", gap:8, marginTop:8 }}>
          <button className="btn btn-ghost" style={{ flex:1, padding:12 }} onClick={() => navigate("/")}>
            <ArrowLeft size={14} />Back
          </button>
          <button className="btn btn-ghost" style={{ flex:1, padding:12 }} onClick={onReset}>
            <RotateCcw size={14} />Reset
          </button>
        </div>
      </div>

      {showScanner && (
        <BarcodeScanner onScan={onScanBarcode} onClose={() => setShowScanner(false)} />
      )}
    </div>
  );
}
