import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function DriverLogin() {
  const { loginDriver } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ phone: "", name: "" });
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const res = loginDriver(form);
    if (res.ok) navigate("/driver/app/home");
    else setError(res.error);
  }

  return (
    <div className="auth">
      <div className="auth__panel">
        <Link to="/" className="auth__back">← মূল পাতায় ফিরুন</Link>
        <div className="auth__badge">চালক</div>
        <h1>আবার স্বাগতম</h1>
        <p className="auth__sub">নিবন্ধিত মোবাইল নম্বর ও নাম দিয়ে লগইন করুন।</p>

        <form onSubmit={handleSubmit} className="form">
          <label className="field">
            <span>মোবাইল নম্বর</span>
            <input
              required
              type="tel"
              placeholder="017XXXXXXXX"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </label>
          <label className="field">
            <span>পূর্ণ নাম</span>
            <input
              required
              type="text"
              placeholder="জাতীয় পরিচয়পত্র অনুযায়ী নাম লিখুন"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>

          {error && <div className="form__error">{error}</div>}

          <button type="submit" className="btn btn--primary btn--block">লগইন</button>
        </form>

        <p className="auth__switch">
          নতুন ব্যবহারকারী? <Link to="/driver/signup">জাতীয় পরিচয়পত্র দিয়ে নিবন্ধন করুন</Link>
        </p>

        <div className="auth__hint">
          ডেমো ব্যবহার: <strong>01711000001</strong> · <strong>কামাল হোসেন</strong>
        </div>
      </div>
      <div className="auth__aside" aria-hidden="true">
        <div className="auth__aside-badge">🚦</div>
      </div>
    </div>
  );
}
