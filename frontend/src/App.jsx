import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import BundleIssueSearch from "./pages/bundle/BundleIssueSearch";
import BundleIssueEntry from "./pages/bundle/BundleIssueEntry";
import BundleReceiptSearch from "./pages/bundle/BundleReceiptSearch";
import BundleReceiptEntry from "./pages/bundle/BundleReceiptEntry";
import InstallPrompt from "./components/InstallPrompt";
import PcWtApproval from "./pages/PcWtApproval";
import FabricData from "./pages/FabricData";
import SurplusFabric from "./pages/SurplusFabric";
import SurplusGarment from "./pages/SurplusGarment";
import ComingSoon from "./pages/ComingSoon";

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) {
    return (
      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"var(--bg)" }}>
        <div style={{ textAlign:"center" }}>
          <div className="spinner" style={{ margin:"0 auto 16px" }} />
          <div style={{ fontSize:13, color:"var(--text3)" }}>Loading...</div>
        </div>
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" state={{ from:location }} replace />;
  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/" element={<ProtectedRoute><Landing /></ProtectedRoute>} />
      <Route path="/bundle-issue" element={<ProtectedRoute><BundleIssueSearch /></ProtectedRoute>} />
      <Route path="/bundle-issue/entry" element={<ProtectedRoute><BundleIssueEntry /></ProtectedRoute>} />
      <Route path="/bundle-receipt" element={<ProtectedRoute><BundleReceiptSearch /></ProtectedRoute>} />
      <Route path="/bundle-receipt/entry" element={<ProtectedRoute><BundleReceiptEntry /></ProtectedRoute>} />
      <Route path="/pc-wt-approval" element={<ProtectedRoute><PcWtApproval /></ProtectedRoute>} />
      <Route path="/fabric-data" element={<ProtectedRoute><FabricData /></ProtectedRoute>} />
      <Route path="/surplus-fabric" element={<ProtectedRoute><SurplusFabric /></ProtectedRoute>} />
      <Route path="/surplus-garment" element={<ProtectedRoute><SurplusGarment /></ProtectedRoute>} />
      <Route path="/coming-soon" element={<ProtectedRoute><ComingSoon /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <InstallPrompt />
      </AuthProvider>
    </BrowserRouter>
  );
}
