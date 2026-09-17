import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getFinesBySurgent } from "../../data/mockData";

export default function SurgentAccount() {
  const { session, updateProfile, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(session.profile);
  const fines = getFinesBySurgent(session.profile.id);

  function save(e) {
    e.preventDefault();
    updateProfile(form);
    setEditing(false);
  }

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <div className="page__eyebrow">অ্যাকাউন্ট</div>
          <h1>{session.profile.name}</h1>
          <p className="page__sub">কর্মকর্তা আইডি: {session.profile.id}</p>
        </div>
        {!editing && <button className="btn btn--outline" onClick={() => { setForm(session.profile); setEditing(true); }}>প্রোফাইল সম্পাদনা</button>}
      </header>

      {editing ? (
        <form className="form form--grid panel" onSubmit={save}>
          <label className="field">
            <span>পূর্ণ নাম</span>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label className="field">
            <span>মোবাইল নম্বর</span>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </label>
          <label className="field">
            <span>ব্যাজ নম্বর</span>
            <input value={form.badgeId} onChange={(e) => setForm({ ...form, badgeId: e.target.value })} />
          </label>
          <label className="field">
            <span>এলাকা</span>
            <input value={form.zone} onChange={(e) => setForm({ ...form, zone: e.target.value })} />
          </label>
          <div className="ticket__actions field--span2">
            <button className="btn btn--primary" type="submit">পরিবর্তন সংরক্ষণ</button>
            <button className="btn btn--ghost" type="button" onClick={() => setEditing(false)}>বাতিল</button>
          </div>
        </form>
      ) : (
        <section className="panel">
          <div className="detail-grid">
            <div><span>মোবাইল নম্বর</span><strong>{session.profile.phone}</strong></div>
            <div><span>ব্যাজ নম্বর</span><strong>{session.profile.badgeId}</strong></div>
            <div><span>পদমর্যাদা</span><strong>{session.profile.rank}</strong></div>
            <div><span>এলাকা</span><strong>{session.profile.zone}</strong></div>
            <div><span>মোট প্রদত্ত জরিমানা</span><strong>{fines.length}</strong></div>
          </div>
        </section>
      )}

      <button className="btn btn--danger" onClick={logout}>লগআউট</button>
    </div>
  );
}
