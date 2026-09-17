import React, { useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { getFinesBySurgent, findViolation } from "../../data/mockData";

function isSameDay(a, b) { return a.toDateString() === b.toDateString(); }
function startOfWeek(d) {
  const date = new Date(d);
  const day = date.getDay();
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date;
}

export default function SurgentStats() {
  const { session } = useAuth();
  const fines = getFinesBySurgent(session.profile.id);

  const stats = useMemo(() => {
    const now = new Date();
    const weekStart = startOfWeek(now);
    let day = 0, week = 0, month = 0, year = 0, dayAmount = 0, weekAmount = 0, monthAmount = 0, yearAmount = 0;

    fines.forEach((f) => {
      const d = new Date(f.dateTime);
      if (d.getFullYear() === now.getFullYear()) { year++; yearAmount += f.amount; }
      if (d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()) { month++; monthAmount += f.amount; }
      if (d >= weekStart) { week++; weekAmount += f.amount; }
      if (isSameDay(d, now)) { day++; dayAmount += f.amount; }
    });

    return { day, week, month, year, dayAmount, weekAmount, monthAmount, yearAmount };
  }, [fines]);

  const byViolation = useMemo(() => {
    const map = {};
    fines.forEach((f) => { map[f.violationId] = (map[f.violationId] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [fines]);

  const maxCount = byViolation.length ? byViolation[0][1] : 1;

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <div className="page__eyebrow">কার্যক্রম</div>
          <h1>দায়িত্বের রেকর্ড</h1>
          <p className="page__sub">আপনার দেওয়া জরিমানার সময়ভিত্তিক হিসাব।</p>
        </div>
      </header>

      <section className="stat-grid">
        <StatCard label="আজ" count={stats.day} amount={stats.dayAmount} />
        <StatCard label="এই সপ্তাহ" count={stats.week} amount={stats.weekAmount} />
        <StatCard label="এই মাস" count={stats.month} amount={stats.monthAmount} />
        <StatCard label="এই বছর" count={stats.year} amount={stats.yearAmount} />
      </section>

      <section className="panel">
        <div className="panel__header"><h2>লঙ্ঘনের ধরন অনুযায়ী</h2></div>
        {byViolation.length === 0 && <div className="empty">এখনও কোনো জরিমানা দেওয়া হয়নি।</div>}
        <div className="bar-list">
          {byViolation.map(([id, count]) => {
            const v = findViolation(id);
            return (
              <div className="bar-row" key={id}>
                <div className="bar-row__label">{v?.label || id}</div>
                <div className="bar-row__track">
                  <div className="bar-row__fill" style={{ width: `${(count / maxCount) * 100}%` }} />
                </div>
                <div className="bar-row__count">{count}</div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="panel">
        <div className="panel__header"><h2>প্রদত্ত সব জরিমানা</h2></div>
        <div className="table">
          <div className="table__row table__row--head">
            <div>জরিমানা আইডি</div>
            <div>গাড়ি</div>
            <div>লঙ্ঘনের ধরন</div>
            <div>পরিমাণ</div>
          </div>
          {fines.map((f) => (
            <div className="table__row" key={f.id}>
              <div className="table__muted">{f.id}</div>
              <div>{f.vehicleNumber}</div>
              <div>{findViolation(f.violationId)?.label}</div>
              <div className="table__amount">৳{f.amount.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, count, amount }) {
  return (
    <div className="stat-card">
      <div className="stat-card__label">{label}</div>
      <div className="stat-card__count">{count}</div>
      <div className="stat-card__amount">মূল্য ৳{amount.toLocaleString()}</div>
    </div>
  );
}
