import React, { useState } from "react";

const TOGGLES = [
  { key: "fineAlerts", label: "নতুন জরিমানার সতর্কতা", desc: "আপনার গাড়ির বিরুদ্ধে জরিমানা হলে সঙ্গে সঙ্গে জানান।" },
  { key: "renewalReminders", label: "নবায়নের স্মরণবার্তা", desc: "ফিটনেস, ট্যাক্স বা বিমার মেয়াদ শেষ হওয়ার ৩০ দিন আগে জানান।" },
  { key: "smsBackup", label: "এসএমএস ব্যাকআপ", desc: "অ্যাপ বন্ধ থাকলেও এসএমএসের মাধ্যমে সতর্কতা পাঠান।" },
  { key: "shareLocation", label: "লাইভ অবস্থান শেয়ার", desc: "আপত্তি জানালে কর্মকর্তাকে আপনার লাইভ অবস্থান দেখার অনুমতি দিন।" },
];

export default function DriverSettings() {
  const [state, setState] = useState({
    fineAlerts: true,
    renewalReminders: true,
    smsBackup: false,
    shareLocation: false,
  });
  const [language, setLanguage] = useState("বাংলা");

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <div className="page__eyebrow">সেটিংস</div>
          <h1>অ্যাপের পছন্দসমূহ</h1>
        </div>
      </header>

      <section className="panel">
        <div className="panel__header"><h2>নোটিফিকেশন</h2></div>
        <div className="toggle-list">
          {TOGGLES.map((t) => (
            <label className="toggle-row" key={t.key}>
              <div>
                <div className="toggle-row__label">{t.label}</div>
                <div className="toggle-row__desc">{t.desc}</div>
              </div>
              <input
                type="checkbox"
                checked={state[t.key]}
                onChange={() => setState((s) => ({ ...s, [t.key]: !s[t.key] }))}
              />
            </label>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel__header"><h2>ভাষা</h2></div>
        <div className="toggle-list">
          <label className="field">
            <span>অ্যাপের ভাষা</span>
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option>বাংলা</option>
              <option>English</option>
            </select>
          </label>
        </div>
      </section>
    </div>
  );
}
