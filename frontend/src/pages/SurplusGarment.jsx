import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BundleTopBar from "../components/BundleTopBar";
import { Download, Save, RotateCcw, ArrowLeft, CheckCircle2 } from "lucide-react";
import { getGarmentSurplus, updateGarmentSurplus } from "../services/garmentService";

const PLACEHOLDER = "Select style/colour";
const isValidQty = (v) => /^\d+$/.test(v);
const rowKey = (r) => `${r.styleCode} - ${r.colour}`;

export default function SurplusGarment() {
  const navigate = useNavigate();
  const [poNo, setPoNo]         = useState("");
  const [rows, setRows]         = useState([]);
  const [selectedKey, setSelectedKey] = useState("");
  const [surplusQty, setSurplusQty]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");

  const selected = rows.find(r => rowKey(r) === selectedKey);

  const onGet = async () => {
    const po = poNo.trim();
    if (!po) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const { data } = await getGarmentSurplus(po);
      setRows(data || []);
      setSelectedKey("");
      setSurplusQty("");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load garment surplus");
      setRows([]);
      setSelectedKey("");
      setSurplusQty("");
    } finally {
      setLoading(false);
    }
  };

  const onSelectChange = (key) => {
    setSelectedKey(key);
    setError(""); setSuccess("");
    const r = rows.find(x => rowKey(x) === key);
    setSurplusQty(r && r.surplusQty !== null && r.surplusQty !== undefined ? String(r.surplusQty) : "");
  };

  const onQtyChange = (e) => {
    const v = e.target.value;
    if (v === "" || /^\d*$/.test(v)) {
      setSurplusQty(v);
      setSuccess("");
    }
  };

  const onReset = () => {
    setPoNo(""); setRows([]);
    setSelectedKey(""); setSurplusQty("");
    setError(""); setSuccess("");
  };

  const onSave = async () => {
    if (!selected) { setError("Select a style/colour first"); return; }
    if (!isValidQty(surplusQty)) { setError("Enter Surplus Qty as a whole number"); return; }

    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const { data } = await updateGarmentSurplus({ uid: selected.uid, sqty: Number(surplusQty) });
      setRows(prev => prev.map(r => ({ ...r, surplusQty: Number(surplusQty) })));
      setSuccess(data.message || "Updated Successfully");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to update Surplus Qty");
    } finally {
      setSaving(false);
    }
  };

  const readOnlyField = (id, label, value) => (
    <div className="form-group">
      <label className="form-label" htmlFor={id}>{label}</label>
      <input id={id} className="form-input" value={value} readOnly placeholder="Auto" />
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)" }}>
      <BundleTopBar title="Bundle Tracking" subtitle="Surplus Garment" />

      <div style={{ padding:16 }}>
        <div className="form-group" style={{ display:"flex", gap:8, alignItems:"flex-end" }}>
          <div style={{ flex:1 }}>
            <label className="form-label" htmlFor="sg-poNo">Po No</label>
            <input id="sg-poNo" className="form-input" value={poNo}
              onChange={e => setPoNo(e.target.value)} placeholder="Enter PO No"
              onKeyDown={e => e.key === "Enter" && onGet()} />
          </div>
          <button className="btn btn-primary" disabled={loading} onClick={onGet}>
            <Download size={14} />Get
          </button>
        </div>

        {error && <div className="login-error">{error}</div>}
        {success && (
          <div style={{ background:"var(--accent-dim)", border:"1px solid var(--accent)", color:"var(--accent)",
            padding:"11px 14px", borderRadius:"var(--radius-sm)", fontSize:13, marginBottom:18,
            display:"flex", alignItems:"center", gap:8 }}>
            <CheckCircle2 size={15} />{success}
          </div>
        )}

        <div className="form-group">
          <label className="form-label" htmlFor="sg-select">Style / Colour</label>
          <select id="sg-select" className="form-input" value={selectedKey}
            onChange={e => onSelectChange(e.target.value)} disabled={rows.length === 0}>
            <option value="">{PLACEHOLDER}</option>
            {rows.map(r => <option key={rowKey(r)} value={rowKey(r)}>{rowKey(r)}</option>)}
          </select>
        </div>

        {readOnlyField("sg-brand", "Brand", selected ? selected.brand : "")}
        {readOnlyField("sg-style", "Style", selected ? selected.styleCode : "")}
        {readOnlyField("sg-colour", "Colour", selected ? selected.colour : "")}

        <div className="form-group">
          <label className="form-label" htmlFor="sg-qty">Surplus Qty</label>
          <input id="sg-qty" className="form-input" value={surplusQty} onChange={onQtyChange}
            inputMode="numeric" placeholder="0" disabled={!selected} />
        </div>

        <div style={{ display:"flex", gap:8, marginTop:8 }}>
          <button className="btn btn-ghost" style={{ flex:1, padding:12 }} onClick={() => navigate("/")}>
            <ArrowLeft size={14} />Back
          </button>
          <button className="btn btn-ghost" style={{ flex:1, padding:12 }} onClick={onReset}>
            <RotateCcw size={14} />Reset
          </button>
          <button className="btn btn-primary" style={{ flex:1, padding:12 }} disabled={saving || !selected} onClick={onSave}>
            <Save size={14} />Save
          </button>
        </div>
      </div>
    </div>
  );
}
