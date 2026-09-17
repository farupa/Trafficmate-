import React, { useState } from "react";

const TOGGLES = [
  { key: "appealAlerts", label: "আপত্তির সতর্কতা", desc: "কোনো চালক আপনার দেওয়া জরিমানার বিরুদ্ধে আপত্তি জানালে জানান।" },
  { key: "dailySummary", label: "দৈনিক সারসংক্ষেপ", desc: "দায়িত্ব শেষে প্রদত্ত জরিমানার সারসংক্ষেপ পাঠান।" },
  { key: "offlineMode", label: "অফলাইন তথ্য সংগ্রহ", desc: "নেটওয়ার্ক না থাকলে জরিমানার তথ্য স্থানীয়ভাবে রেখে পরে সিঙ্ক করুন।" },
];

export default function SurgentSettings() {
  const [state, setState] = useState({ appealAlerts: true, dailySummary: true, offlineMode: false });

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
    </div>
  );
}
