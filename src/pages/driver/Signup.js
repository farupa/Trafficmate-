import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function DriverSignup() {
  const { signupDriver } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    nid: "",
    permanentAddress: "",
    presentAddress: "",
  });
  const [error, setError] = useState("");

  function update(key) {
    return (e) => setForm({ ...form, [key]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const res = signupDriver(form);
    if (res.ok) navigate("/driver/app/home");
    else setError(res.error);
  }

  return (
    <div className="auth">
      <div className="auth__panel auth__panel--wide">
        <Link to="/" className="auth__back">← মূল পাতায় ফিরুন</Link>
        <div className="auth__badge">চালক</div>
        <h1>অ্যাকাউন্ট তৈরি করুন</h1>
        <p className="auth__sub">নিবন্ধনের জন্য জাতীয় পরিচয়পত্র, মোবাইল নম্বর ও নাম প্রয়োজন।</p>

        <form onSubmit={handleSubmit} className="form form--grid">
          <label className="field">
            <span>পূর্ণ নাম</span>
            <input required type="text" value={form.name} onChange={update("name")} />
          </label>
          <label className="field">
            <span>মোবাইল নম্বর</span>
            <input required type="tel" placeholder="017XXXXXXXX" value={form.phone} onChange={update("phone")} />
          </label>
          <label className="field">
            <span>জাতীয় পরিচয়পত্র (NID) নম্বর</span>
            <input required type="text" value={form.nid} onChange={update("nid")} />
          </label>
          <label className="field field--span2">
            <span>বর্তমান ঠিকানা</span>
            <input required type="text" value={form.presentAddress} onChange={update("presentAddress")} />
          </label>
          <label className="field field--span2">
            <span>স্থায়ী ঠিকানা</span>
            <input required type="text" value={form.permanentAddress} onChange={update("permanentAddress")} />
          </label>

          {error && <div className="form__error">{error}</div>}

          <button type="submit" className="btn btn--primary btn--block field--span2">অ্যাকাউন্ট তৈরি করুন</button>
        </form>

        <p className="auth__switch">
          আগে থেকেই নিবন্ধিত? <Link to="/driver/login">লগইন করুন</Link>
        </p>
      </div>
    </div>
  );
}
