import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function SurgentLogin() {
  const { loginSurgent } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ phone: "", name: "", surgentId: "" });
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const res = loginSurgent(form);
    if (res.ok) navigate("/surgent/app/home");
    else setError(res.error);
  }

  return (
    <div className="auth auth--surgent">
      <div className="auth__panel">
        <Link to="/" className="auth__back">← মূল পাতায় ফিরুন</Link>
        <div className="auth__badge auth__badge--surgent">ট্রাফিক কর্মকর্তা</div>
        <h1>দায়িত্বে লগইন</h1>
        <p className="auth__sub">নাম, নিবন্ধিত মোবাইল নম্বর ও কর্মকর্তা আইডি দিয়ে লগইন করুন।</p>

        <form onSubmit={handleSubmit} className="form">
          <label className="field">
            <span>পূর্ণ নাম</span>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label className="field">
            <span>মোবাইল নম্বর</span>
            <input required type="tel" placeholder="019XXXXXXXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </label>
          <label className="field">
            <span>কর্মকর্তা আইডি</span>
            <input required value={form.surgentId} onChange={(e) => setForm({ ...form, surgentId: e.target.value })} placeholder="SGT-0042" />
          </label>

          {error && <div className="form__error">{error}</div>}

          <button type="submit" className="btn btn--primary btn--block">লগইন</button>
        </form>

        <p className="auth__switch">
          নিবন্ধিত নন? <Link to="/surgent/signup">কর্মকর্তা হিসেবে নিবন্ধন করুন</Link>
        </p>

        <div className="auth__hint">
          ডেমো ব্যবহার: <strong>আনিসুর রহমান</strong> · <strong>01911000042</strong> · <strong>SGT-0042</strong>
        </div>
      </div>
      <div className="auth__aside auth__aside--surgent" aria-hidden="true">
        <div className="auth__aside-badge">⚑</div>
      </div>
    </div>
  );
}
