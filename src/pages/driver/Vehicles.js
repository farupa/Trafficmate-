import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getVehiclesByDriver, addVehicle, updateVehicle } from "../../data/mockData";
import { vehicleTypeLabel } from "../../data/labels";

const BLANK = {
  vehicleNumber: "",
  type: "Private Car",
  licenseNumber: "",
  registrationNumber: "",
  fitnessExpiry: "",
  taxTokenExpiry: "",
  insuranceExpiry: "",
};

const VEHICLE_TYPES = ["Private Car", "Motorcycle", "CNG / Auto-rickshaw", "Bus", "Truck", "Pickup", "Microbus"];

function daysLeft(dateStr) {
  if (!dateStr) return null;
  const diff = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
  return diff;
}

function ExpiryBadge({ label, date }) {
  const d = daysLeft(date);
  if (d === null) return null;
  let tone = "ok";
  if (d < 0) tone = "danger";
  else if (d < 30) tone = "warn";
  return (
    <div className={`expiry expiry--${tone}`}>
      <span>{label}</span>
      <strong>{date}</strong>
      <em>{d < 0 ? "মেয়াদ শেষ" : `${d} দিন বাকি`}</em>
    </div>
  );
}

export default function DriverVehicles() {
  const { session } = useAuth();
  const [vehicles, setVehicles] = useState(() => getVehiclesByDriver(session.profile.id));
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(BLANK);

  function refresh() {
    setVehicles(getVehiclesByDriver(session.profile.id));
  }

  function startAdd() {
    setForm(BLANK);
    setEditingId(null);
    setShowForm(true);
  }

  function startEdit(vehicle) {
    setForm(vehicle);
    setEditingId(vehicle.id);
    setShowForm(true);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (editingId) {
      updateVehicle(editingId, form);
    } else {
      addVehicle({ ...form, driverId: session.profile.id, lastIssuedDate: new Date().toISOString().slice(0, 10) });
    }
    setShowForm(false);
    refresh();
  }

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <div className="page__eyebrow">গাড়ির তথ্য</div>
          <h1>নিবন্ধিত গাড়ি</h1>
          <p className="page__sub">জরিমানা এড়াতে লাইসেন্স, ফিটনেস ও ট্যাক্সের তথ্য হালনাগাদ রাখুন।</p>
        </div>
        <button className="btn btn--primary" onClick={startAdd}>+ গাড়ি যোগ করুন</button>
      </header>

      {vehicles.length === 0 && !showForm && (
        <div className="empty">এখনও কোনো গাড়ি যোগ করা হয়নি। শুরু করতে প্রথম গাড়িটি যোগ করুন।</div>
      )}

      <div className="vehicle-grid">
        {vehicles.map((v) => (
          <article key={v.id} className="vehicle-card">
            <div className="vehicle-card__plate">{v.vehicleNumber}</div>
            <div className="vehicle-card__type">{vehicleTypeLabel(v.type)}</div>
            <div className="vehicle-card__row"><span>লাইসেন্স নম্বর</span><strong>{v.licenseNumber}</strong></div>
            <div className="vehicle-card__row"><span>নিবন্ধন নম্বর</span><strong>{v.registrationNumber}</strong></div>
            <div className="vehicle-card__row"><span>সর্বশেষ জরিমানার তারিখ</span><strong>{v.lastIssuedDate || "—"}</strong></div>
            <div className="vehicle-card__expiries">
              <ExpiryBadge label="ফিটনেস" date={v.fitnessExpiry} />
              <ExpiryBadge label="ট্যাক্স টোকেন" date={v.taxTokenExpiry} />
              <ExpiryBadge label="বিমা" date={v.insuranceExpiry} />
            </div>
            <button className="btn btn--outline btn--block" onClick={() => startEdit(v)}>তথ্য সম্পাদনা</button>
          </article>
        ))}
      </div>

      {showForm && (
        <div className="modal-backdrop" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingId ? "গাড়ির তথ্য সম্পাদনা" : "গাড়ি যোগ করুন"}</h2>
            <form onSubmit={handleSubmit} className="form form--grid">
              <label className="field field--span2">
                <span>গাড়ির নম্বর</span>
                <input required value={form.vehicleNumber} onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value })} placeholder="Dhaka Metro-Ga 12-3456" />
              </label>
              <label className="field">
                <span>গাড়ির ধরন</span>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  {VEHICLE_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </label>
              <label className="field">
                <span>ড্রাইভিং লাইসেন্স নম্বর</span>
                <input required value={form.licenseNumber} onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })} />
              </label>
              <label className="field">
                <span>নিবন্ধন নম্বর</span>
                <input required value={form.registrationNumber} onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })} />
              </label>
              <label className="field">
                <span>ফিটনেস সনদের মেয়াদ</span>
                <input required type="date" value={form.fitnessExpiry} onChange={(e) => setForm({ ...form, fitnessExpiry: e.target.value })} />
              </label>
              <label className="field">
                <span>ট্যাক্স টোকেনের মেয়াদ</span>
                <input required type="date" value={form.taxTokenExpiry} onChange={(e) => setForm({ ...form, taxTokenExpiry: e.target.value })} />
              </label>
              <label className="field">
                <span>বিমার মেয়াদ</span>
                <input type="date" value={form.insuranceExpiry} onChange={(e) => setForm({ ...form, insuranceExpiry: e.target.value })} />
              </label>

              <div className="ticket__actions field--span2">
                <button type="submit" className="btn btn--primary">{editingId ? "পরিবর্তন সংরক্ষণ" : "গাড়ি যোগ করুন"}</button>
                <button type="button" className="btn btn--ghost" onClick={() => setShowForm(false)}>বাতিল</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
