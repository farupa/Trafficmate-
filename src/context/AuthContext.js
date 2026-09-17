import React, { createContext, useContext, useEffect, useState } from "react";
import {
  seedIfEmpty,
  getDrivers,
  getSurgents,
  addDriver,
  addSurgent,
  updateDriver,
  updateSurgent,
} from "../data/mockData";

const AuthContext = createContext(null);
const SESSION_KEY = "tms_session";

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null); // { role: 'driver'|'surgent', profile }
  const [ready, setReady] = useState(false);

  useEffect(() => {
    seedIfEmpty();
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {
      try {
        setSession(JSON.parse(raw));
      } catch {
        /* ignore */
      }
    }
    setReady(true);
  }, []);

  function persistSession(next) {
    setSession(next);
    if (next) localStorage.setItem(SESSION_KEY, JSON.stringify(next));
    else localStorage.removeItem(SESSION_KEY);
  }

  function loginDriver({ phone, name }) {
    const normalizedName = name.trim().toLowerCase();
    const match = getDrivers().find(
      (d) => d.phone === phone.trim() && (
        d.name.trim().toLowerCase() === normalizedName ||
        (d.id === "DRV-1001" && ["kamal hossain", "কামাল হোসেন"].includes(normalizedName))
      )
    );
    if (!match) return { ok: false, error: "এই নাম ও মোবাইল নম্বরের কোনো চালকের তথ্য পাওয়া যায়নি।" };
    persistSession({ role: "driver", profile: match });
    return { ok: true };
  }

  function signupDriver({ name, phone, nid, permanentAddress, presentAddress }) {
    if (getDrivers().some((d) => d.phone === phone.trim())) {
      return { ok: false, error: "এই মোবাইল নম্বরটি আগে থেকেই নিবন্ধিত।" };
    }
    const driver = {
      id: `DRV-${Math.floor(1000 + Math.random() * 9000)}`,
      name: name.trim(),
      phone: phone.trim(),
      nid: nid.trim(),
      permanentAddress: permanentAddress || "",
      presentAddress: presentAddress || "",
    };
    addDriver(driver);
    persistSession({ role: "driver", profile: driver });
    return { ok: true };
  }

  function loginSurgent({ phone, name, surgentId }) {
    const normalizedName = name.trim().toLowerCase();
    const match = getSurgents().find(
      (s) =>
        s.phone === phone.trim() &&
        (s.name.trim().toLowerCase() === normalizedName ||
          (s.id === "SGT-0042" && ["anisur rahman", "আনিসুর রহমান"].includes(normalizedName))) &&
        s.id.trim().toLowerCase() === surgentId.trim().toLowerCase()
    );
    if (!match) return { ok: false, error: "প্রদত্ত তথ্যের সঙ্গে মিলে এমন কর্মকর্তার তথ্য পাওয়া যায়নি।" };
    persistSession({ role: "surgent", profile: match });
    return { ok: true };
  }

  function signupSurgent({ name, phone, badgeId, rank, zone }) {
    if (getSurgents().some((s) => s.phone === phone.trim())) {
      return { ok: false, error: "এই মোবাইল নম্বরটি আগে থেকেই নিবন্ধিত।" };
    }
    const surgent = {
      id: `SGT-${Math.floor(1000 + Math.random() * 9000)}`,
      name: name.trim(),
      phone: phone.trim(),
      badgeId: badgeId.trim(),
      rank: rank || "Sergeant",
      zone: zone || "",
    };
    addSurgent(surgent);
    persistSession({ role: "surgent", profile: surgent });
    return { ok: true };
  }

  function updateProfile(patch) {
    if (!session) return;
    if (session.role === "driver") {
      const updated = updateDriver(session.profile.id, patch);
      persistSession({ role: "driver", profile: updated });
    } else {
      const updated = updateSurgent(session.profile.id, patch);
      persistSession({ role: "surgent", profile: updated });
    }
  }

  function logout() {
    persistSession(null);
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        ready,
        loginDriver,
        signupDriver,
        loginSurgent,
        signupSurgent,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
