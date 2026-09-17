import React, { useState } from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AppShell({ navItems, roleLabel, roleTag }) {
  const { session, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="shell">
      <button
        className="shell__menu-toggle"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="নেভিগেশন খুলুন বা বন্ধ করুন"
      >
        <span />
        <span />
        <span />
      </button>

      <aside className={`shell__sidebar ${menuOpen ? "is-open" : ""}`}>
        <div className="shell__brand">
          <span className="shell__brand-mark">ট</span>
          <div>
            <div className="shell__brand-name">Traffic MS</div>
            <div className="shell__brand-tag">{roleTag}</div>
          </div>
        </div>

        <nav className="shell__nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `shell__nav-link ${isActive ? "is-active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              <span className="shell__nav-icon" aria-hidden="true">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="shell__user">
          <div className="shell__user-avatar">{session?.profile?.name?.[0] ?? "?"}</div>
          <div className="shell__user-meta">
            <div className="shell__user-name">{session?.profile?.name}</div>
            <div className="shell__user-role">{roleLabel} · {session?.profile?.id}</div>
          </div>
        </div>
        <button className="shell__logout" onClick={handleLogout}>লগআউট</button>
      </aside>

      <main className="shell__content">
        <div className="shell__content-inner">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
