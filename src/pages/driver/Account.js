import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getVehiclesByDriver } from "../../data/mockData";

export default function DriverAccount() {
  const { session, updateProfile, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(session.profile);
  const vehicles = getVehiclesByDriver(session.profile.id);

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
          <p className="page__sub">চালক আইডি: {session.profile.id}</p>
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
            <span>জাতীয় পরিচয়পত্র নম্বর</span>
            <input value={form.nid} onChange={(e) => setForm({ ...form, nid: e.target.value })} />
          </label>
          <label className="field field--span2">
            <span>বর্তমান ঠিকানা</span>
            <input value={form.presentAddress} onChange={(e) => setForm({ ...form, presentAddress: e.target.value })} />
          </label>
          <label className="field field--span2">
            <span>স্থায়ী ঠিকানা</span>
            <input value={form.permanentAddress} onChange={(e) => setForm({ ...form, permanentAddress: e.target.value })} />
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
            <div><span>জাতীয় পরিচয়পত্র নম্বর</span><strong>{session.profile.nid}</strong></div>
            <div><span>নিবন্ধিত গাড়ি</span><strong>{vehicles.length}</strong></div>
            <div className="detail-grid__span2"><span>বর্তমান ঠিকানা</span><strong>{session.profile.presentAddress || "—"}</strong></div>
            <div className="detail-grid__span2"><span>স্থায়ী ঠিকানা</span><strong>{session.profile.permanentAddress || "—"}</strong></div>
          </div>
        </section>
      )}

      <button className="btn btn--danger" onClick={logout}>লগআউট</button>
    </div>
  );
}
