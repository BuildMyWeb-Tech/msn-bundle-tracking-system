import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BundleTopBar from "../components/BundleTopBar";
import { Download, Save, RotateCcw, ArrowLeft, CheckCircle2 } from "lucide-react";
import { getFabricSurplus, updateFabricSurplus } from "../services/fabricService";

const PART_PLACEHOLDER   = "Select a part";
const FABRIC_PLACEHOLDER = "Select a fabric";
const isValidWt = (v) => /^\d+(\.\d{1,2})?$/.test(v);

export default function SurplusFabric() {
  const navigate = useNavigate();
  const [poNo, setPoNo]         = useState("");
  const [rows, setRows]         = useState([]);
  const [part, setPart]         = useState("");
  const [fabric, setFabric]     = useState("");
  const [cuttingWt, setCuttingWt]       = useState("");
  const [cuttingWaste, setCuttingWaste] = useState("");
  const [endBits, setEndBits]           = useState("");
  const [loading, setLoading]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");

  const parts = [...new Set(rows.map(r => r.part))];
  const fabricsForPart = [...new Set(rows.filter(r => r.part === part).map(r => r.fabric))];
  const selected = rows.find(r => r.part === part && r.fabric === fabric);
  const brand = rows[0]?.brand || "";

  const totalUsedWt = [cuttingWt, cuttingWaste, endBits].every(isValidWt)
    ? (Number(cuttingWt) + Number(cuttingWaste) + Number(endBits)).toFixed(2)
    : "";

  const onGet = async () => {
    const po = poNo.trim();
    if (!po) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const { data } = await getFabricSurplus(po);
      setRows(data || []);
      setPart(""); setFabric("");
      setCuttingWt(""); setCuttingWaste(""); setEndBits("");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load surplus data");
      setRows([]);
      setPart(""); setFabric("");
    } finally {
      setLoading(false);
    }
  };

  const onPartChange = (value) => {
    setPart(value);
    setFabric("");
    setCuttingWt(""); setCuttingWaste(""); setEndBits("");
    setError(""); setSuccess("");
  };

  const fillFromRow = (row) => {
    setCuttingWt(row?.cuttingWt != null ? Number(row.cuttingWt).toFixed(2) : "");
    setCuttingWaste(row?.cuttingWaste != null ? Number(row.cuttingWaste).toFixed(2) : "");
    setEndBits(row?.endBits != null ? Number(row.endBits).toFixed(2) : "");
  };

  const onFabricChange = (value) => {
    setFabric(value);
    setError(""); setSuccess("");
    fillFromRow(rows.find(r => r.part === part && r.fabric === value));
  };

  const onWtChange = (setter) => (e) => {
    const v = e.target.value;
    if (v === "" || /^\d*\.?\d{0,2}$/.test(v)) {
      setter(v);
      setSuccess("");
    }
  };

  const onReset = () => {
    setPoNo(""); setRows([]);
    setPart(""); setFabric("");
    setCuttingWt(""); setCuttingWaste(""); setEndBits("");
    setError(""); setSuccess("");
  };

  const onSave = async () => {
    if (!selected) { setError("Select a part and fabric first"); return; }
    if (![cuttingWt, cuttingWaste, endBits].every(isValidWt)) {
      setError("Enter Cutted Wt, Cutting Waste Wt and End Bits as numbers with up to 2 decimals");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const { data } = await updateFabricSurplus({
        uid: selected.uid, fabric: selected.fabric,
        cuttingwt: Number(cuttingWt), cuttingwaste: Number(cuttingWaste),
        endbits: Number(endBits), tusedwt: Number(totalUsedWt),
      });
      setRows(prev => prev.map(r => r.part === part && r.fabric === fabric
        ? { ...r, cuttingWt: Number(cuttingWt), cuttingWaste: Number(cuttingWaste),
            endBits: Number(endBits), totalUsedWt: Number(totalUsedWt) }
        : r));
      setSuccess(data.message || "Updated Successfully");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to update Surplus Fabric");
    } finally {
      setSaving(false);
    }
  };

  const wtField = (id, label, value, onChange) => (
    <div className="form-group">
      <label className="form-label" htmlFor={id}>{label}</label>
      <input id={id} className="form-input" value={value} onChange={onChange}
        inputMode="decimal" placeholder="0.00" disabled={!selected} />
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)" }}>
      <BundleTopBar title="Bundle Tracking" subtitle="Surplus Fabric" />

      <div style={{ padding:"16px 16px 84px" }}>
        <div className="form-group" style={{ display:"flex", gap:8, alignItems:"flex-end" }}>
          <div style={{ flex:1 }}>
            <label className="form-label" htmlFor="sf-poNo">Po No</label>
            <input id="sf-poNo" className="form-input" value={poNo}
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
          <label className="form-label" htmlFor="sf-brand">Brand</label>
          <input id="sf-brand" className="form-input" value={brand} readOnly placeholder="Auto" />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="sf-part">Part</label>
          <select id="sf-part" className="form-input" value={part}
            onChange={e => onPartChange(e.target.value)} disabled={rows.length === 0}>
            <option value="">{PART_PLACEHOLDER}</option>
            {parts.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="sf-fabric">Fabric</label>
          <select id="sf-fabric" className="form-input" value={fabric}
            onChange={e => onFabricChange(e.target.value)} disabled={!part}>
            <option value="">{FABRIC_PLACEHOLDER}</option>
            {fabricsForPart.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        {wtField("sf-cuttingWt", "Cutted Wt", cuttingWt, onWtChange(setCuttingWt))}
        {wtField("sf-cuttingWaste", "Cutting Waste Wt", cuttingWaste, onWtChange(setCuttingWaste))}
        {wtField("sf-endBits", "End Bits", endBits, onWtChange(setEndBits))}

        <div className="form-group">
          <label className="form-label" htmlFor="sf-totalUsedWt">Total Used Wt</label>
          <input id="sf-totalUsedWt" className="form-input" value={totalUsedWt} readOnly placeholder="Auto" />
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
