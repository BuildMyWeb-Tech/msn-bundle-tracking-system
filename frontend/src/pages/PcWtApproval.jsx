import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BundleTopBar from "../components/BundleTopBar";
import { Download, Save, RotateCcw, ArrowLeft, CheckCircle2 } from "lucide-react";
import { getFabricPcWt, updateFabricPcWt } from "../services/fabricService";

const PLACEHOLDER = "Select a fabric";
const isValidPcWt = (v) => /^\d+(\.\d{1,2})?$/.test(v);

export default function PcWtApproval() {
  const navigate = useNavigate();
  const [poNo, setPoNo]         = useState("");
  const [fabrics, setFabrics]   = useState([]);
  const [selectedUid, setSelectedUid] = useState("");
  const [pcWt, setPcWt]         = useState("");
  const [loading, setLoading]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");

  const selected = fabrics.find(f => String(f.uid) === selectedUid);

  const onGet = async () => {
    const po = poNo.trim();
    if (!po) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const { data } = await getFabricPcWt(po);
      setFabrics(data || []);
      setSelectedUid("");
      setPcWt("");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load fabrics");
      setFabrics([]);
      setSelectedUid("");
      setPcWt("");
    } finally {
      setLoading(false);
    }
  };

  const onFabricChange = (uid) => {
    setSelectedUid(uid);
    setError("");
    setSuccess("");
    const f = fabrics.find(x => String(x.uid) === uid);
    setPcWt(f && f.pcWt !== null && f.pcWt !== undefined ? Number(f.pcWt).toFixed(2) : "");
  };

  const onPcWtChange = (e) => {
    const v = e.target.value;
    if (v === "" || /^\d*\.?\d{0,2}$/.test(v)) {
      setPcWt(v);
      setSuccess("");
    }
  };

  const onReset = () => {
    setPoNo("");
    setFabrics([]);
    setSelectedUid("");
    setPcWt("");
    setError("");
    setSuccess("");
  };

  const onSave = async () => {
    if (!selected) { setError("Select a fabric first"); return; }
    if (!isValidPcWt(pcWt)) { setError("Enter Pc Weight as a number with up to 2 decimals"); return; }

    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const { data } = await updateFabricPcWt({ uid: selected.uid, pcwt: Number(pcWt) });
      setFabrics(prev => prev.map(f => f.uid === selected.uid ? { ...f, pcWt: Number(pcWt) } : f));
      setSuccess(data.message || "Updated Successfully");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to update Pc Weight");
    } finally {
      setSaving(false);
    }
  };

  const readOnlyField = (label, value) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input className="form-input" value={value} readOnly placeholder="Auto" />
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)" }}>
      <BundleTopBar title="Bundle Tracking" subtitle="Fabric Pc Weight Approval" />

      <div style={{ padding:16 }}>
        <div className="form-group" style={{ display:"flex", gap:8, alignItems:"flex-end" }}>
          <div style={{ flex:1 }}>
            <label className="form-label" htmlFor="pcwt-poNo">Po No</label>
            <input id="pcwt-poNo" className="form-input" value={poNo}
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
          <label className="form-label" htmlFor="pcwt-fabric">Fabric</label>
          <select id="pcwt-fabric" className="form-input" value={selectedUid}
            onChange={e => onFabricChange(e.target.value)} disabled={fabrics.length === 0}>
            <option value="">{PLACEHOLDER}</option>
            {fabrics.map(f => <option key={f.uid} value={String(f.uid)}>{f.fabric}</option>)}
          </select>
        </div>

        {readOnlyField("Lot No", selected ? selected.lotNo : "")}
        {readOnlyField("Fabric Wt", selected ? selected.fabricWeight : "")}
        {readOnlyField("Fabric Rolls", selected ? selected.rolls : "")}

        <div className="form-group">
          <label className="form-label" htmlFor="pcwt-value">Pc Weight</label>
          <input id="pcwt-value" className="form-input" value={pcWt} onChange={onPcWtChange}
            inputMode="decimal" placeholder="0.00" disabled={!selected} />
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
