import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/authService";
import { Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ companyCode: "514670", username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);

  const onChange = e => {
    setError("");
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const onSubmit = async e => {
    e.preventDefault();
    if (!form.companyCode.trim()) return setError("Company code is required");
    if (!form.username.trim())    return setError("Username is required");
    if (!form.password)           return setError("Password is required");

    setLoading(true);
    try {
      const res = await loginUser({
        username: form.username.trim(),
        password: form.password,
        companyCode: form.companyCode.trim(),
      });
      if (res.success) {
        login({ ...res.data, companyCode: form.companyCode.trim() });
        navigate("/", { replace: true });
      } else {
        setError(res.message || "Invalid credentials");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally { setLoading(false); }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <img src="/msn-logo.png" alt="MSN Infotec"
            style={{ width:180, height:"auto", marginBottom:6 }}
            onError={e => e.target.style.display = "none"} />
          <div style={{ fontSize:11, color:"var(--text3)", marginTop:4, textAlign:"center" }}>
            Bundle Tracking System
          </div>
        </div>

        {error && (
          <div className="login-error">
            <AlertCircle size={15} style={{ flexShrink:0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={onSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Company Code</label>
            <input name="companyCode" className="form-input"
              value={form.companyCode} onChange={onChange} />
          </div>

          <div className="form-group">
            <label className="form-label">Username <span className="req">*</span></label>
            <input name="username" className="form-input"
              value={form.username} onChange={onChange}
              placeholder="Username" autoCapitalize="none" autoFocus />
          </div>

          <div className="form-group">
            <label className="form-label">Password <span className="req">*</span></label>
            <div className="pw-wrap">
              <input name="password" type={showPw ? "text" : "password"} className="form-input"
                value={form.password} onChange={onChange} placeholder="Password"
                style={{ paddingRight:42 }} />
              <button type="button" className="pw-toggle" onClick={() => setShowPw(s => !s)}>
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? <><span className="spin-sm" />Signing in...</> : <><LogIn size={16} />Sign In</>}
          </button>
        </form>
      </div>
    </div>
  );
}
