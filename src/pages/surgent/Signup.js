import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function SurgentSignup() {
  const { signupSurgent } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", badgeId: "", rank: "Sergeant", zone: "" });
  const [error, setError] = useState("");

  function update(key) {
    return (e) => setForm({ ...form, [key]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const res = signupSurgent(form);
    if (res.ok) navigate("/surgent/app/home");
    else setError(res.error);
  }

  return (
    <div className="auth auth--surgent">
      <div className="auth__panel auth__panel--wide">
        <Link to="/" className="auth__back">← মূল পাতায় ফিরুন</Link>
        <div className="auth__badge auth__badge--surgent">ট্রাফিক কর্মকর্তা</div>
        <h1>দায়িত্বের অ্যাক্সেস নিবন্ধন</h1>
        <p className="auth__sub">জরিমানা প্রদান ও দায়িত্বের রেকর্ড রাখার জন্য কর্মকর্তার প্রোফাইল তৈরি করুন।</p>

        <form onSubmit={handleSubmit} className="form form--grid">
          <label className="field">
            <span>পূর্ণ নাম</span>
            <input required value={form.name} onChange={update("name")} />
          </label>
          <label className="field">
            <span>মোবাইল নম্বর</span>
            <input required type="tel" placeholder="019XXXXXXXX" value={form.phone} onChange={update("phone")} />
          </label>
          <label className="field">
            <span>ব্যাজ / ওয়ারেন্ট নম্বর</span>
            <input required value={form.badgeId} onChange={update("badgeId")} />
          </label>
          <label className="field">
            <span>পদমর্যাদা</span>
            <select value={form.rank} onChange={update("rank")}>
              <option value="Sergeant">সার্জেন্ট</option>
              <option value="Traffic Constable">ট্রাফিক কনস্টেবল</option>
              <option value="Inspector">ইন্সপেক্টর</option>
              <option value="Assistant Commissioner">সহকারী কমিশনার</option>
            </select>
          </label>
          <label className="field field--span2">
            <span>ট্রাফিক এলাকা</span>
            <input required value={form.zone} onChange={update("zone")} placeholder="e.g. Dhanmondi Traffic Zone" />
          </label>

          {error && <div className="form__error">{error}</div>}

          <button type="submit" className="btn btn--primary btn--block field--span2">অ্যাকাউন্ট তৈরি করুন</button>
        </form>

        <p className="auth__switch">
          আগে থেকেই অ্যাক্সেস আছে? <Link to="/surgent/login">লগইন করুন</Link>
        </p>
      </div>
    </div>
  );
}
