import React, { useEffect, useState } from "react";
import { Download, X, Share, PlusSquare } from "lucide-react";

const DISMISS_KEY = "pwa-install-dismissed-at";
const DISMISS_DAYS = 7;

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

function isIos() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent) && !window.MSStream;
}

function wasDismissedRecently() {
  const raw = localStorage.getItem(DISMISS_KEY);
  if (!raw) return false;
  const days = (Date.now() - Number(raw)) / (1000 * 60 * 60 * 24);
  return days < DISMISS_DAYS;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showIosHint, setShowIosHint] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isStandalone() || wasDismissedRecently()) return;

    function onBeforeInstallPrompt(e) {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    }

    function onAppInstalled() {
      localStorage.removeItem(DISMISS_KEY);
      setDeferredPrompt(null);
      setVisible(false);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);

    if (isIos()) {
      setShowIosHint(true);
      setVisible(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  if (!visible) return null;

  async function handleInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted" || outcome === "dismissed") {
      setDeferredPrompt(null);
      setVisible(false);
    }
  }

  function handleDismiss() {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setVisible(false);
  }

  return (
    <div className="install-prompt" role="dialog" aria-label="Install app">
      <div className="install-prompt-card">
        <button className="install-prompt-close" onClick={handleDismiss} aria-label="Dismiss">
          <X size={16} />
        </button>
        <img src="/icons/icon-192.png" alt="" className="install-prompt-icon" />
        <div className="install-prompt-body">
          <div className="install-prompt-title">Install Bundle Tracking</div>
          {showIosHint ? (
            <div className="install-prompt-desc">
              Tap <Share size={13} style={{ verticalAlign: "-2px" }} /> Share, then{" "}
              <PlusSquare size={13} style={{ verticalAlign: "-2px" }} /> "Add to Home Screen".
            </div>
          ) : (
            <div className="install-prompt-desc">Add to your home screen for quick, full-screen access.</div>
          )}
        </div>
        {!showIosHint && (
          <button className="btn btn-primary install-prompt-btn" onClick={handleInstall}>
            <Download size={14} /> Install
          </button>
        )}
      </div>
    </div>
  );
}
