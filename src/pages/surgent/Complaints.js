import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getFinesBySurgent, findViolation, updateFine } from "../../data/mockData";
import { statusLabel } from "../../data/labels";

export default function SurgentComplaints() {
  const { session } = useAuth();
  const [fines, setFines] = useState(() => getFinesBySurgent(session.profile.id).filter((f) => f.status === "disputed"));

  function refresh() {
    setFines(getFinesBySurgent(session.profile.id).filter((f) => f.status === "disputed"));
  }

  function resolve(fine, outcome) {
    updateFine(fine.id, {
      status: outcome === "upheld" ? "unpaid" : "paid",
      dispute: { ...fine.dispute, status: outcome === "upheld" ? "upheld — fine stands" : "dismissed — fine waived" },
    });
    refresh();
  }

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <div className="page__eyebrow">আপত্তি নিষ্পত্তি</div>
          <h1>জরিমানার বিরুদ্ধে চালকের আপত্তি</h1>
          <p className="page__sub">আপত্তি নিষ্পত্তির জন্য চালককে নির্ধারিত তারিখে সংশ্লিষ্ট থানায় উপস্থিত হতে হবে।</p>
        </div>
      </header>

      {fines.length === 0 && <div className="empty">এই মুহূর্তে কোনো আপত্তি নিষ্পত্তির জন্য নেই।</div>}

      <div className="ticket-list">
        {fines.map((f) => (
          <article key={f.id} className="ticket ticket--disputed">
            <div className="ticket__body" style={{ paddingTop: "var(--sp-5)" }}>
              <div className="ticket__grid">
                <div><span>জরিমানা আইডি</span><strong>{f.id}</strong></div>
                <div><span>লঙ্ঘনের ধরন</span><strong>{findViolation(f.violationId)?.label}</strong></div>
                <div><span>গাড়ি</span><strong>{f.vehicleNumber}</strong></div>
                <div><span>পরিমাণ</span><strong>৳{f.amount.toLocaleString()}</strong></div>
              </div>

              <div className="dispute-note">
                <strong>চালকের বক্তব্য</strong>
                <p>{f.dispute?.reason}</p>
                <p>
                  <strong>{f.dispute?.thana}</strong>-এ <strong>{f.dispute?.appointmentDate}</strong> তারিখে{" "}
                  <strong>{f.dispute?.appointmentTime}</strong>-এ নির্ধারিত।
                </p>
                <p>বর্তমান অবস্থা: {statusLabel(f.dispute?.status)}</p>
              </div>

              {f.dispute?.status === "pending review" && (
                <div className="ticket__actions">
                  <button className="btn btn--primary" onClick={() => resolve(f, "upheld")}>জরিমানা বহাল রাখুন</button>
                  <button className="btn btn--outline" onClick={() => resolve(f, "dismissed")}>জরিমানা খারিজ করুন</button>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
