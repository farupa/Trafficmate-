import React, { useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getFinesByDriver, findViolation, updateFine, PAYMENT_METHODS } from "../../data/mockData";
import { paymentMethodLabel, statusLabel } from "../../data/labels";

const TABS = ["সব", "অপরিশোধিত", "পরিশোধিত", "আপত্তিকৃত"];

function formatDateTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString("bn-BD", { dateStyle: "medium", timeStyle: "short" });
}

export default function DriverFines() {
  const { session } = useAuth();
  const [tab, setTab] = useState("সব");
  const [fines, setFines] = useState(() => getFinesByDriver(session.profile.id));
  const [openId, setOpenId] = useState(null);
  const [payingId, setPayingId] = useState(null);
  const [disputingId, setDisputingId] = useState(null);
  const [disputeReason, setDisputeReason] = useState("");
  const [method, setMethod] = useState(PAYMENT_METHODS[0]);

  const visible = useMemo(() => {
    if (tab === "সব") return fines;
    if (tab === "অপরিশোধিত") return fines.filter((f) => f.status === "unpaid");
    if (tab === "পরিশোধিত") return fines.filter((f) => f.status === "paid");
    return fines.filter((f) => f.status === "disputed");
  }, [fines, tab]);

  function refresh() {
    setFines(getFinesByDriver(session.profile.id));
  }

  function confirmPayment(fine) {
    updateFine(fine.id, { status: "paid", paymentMethod: method, paidAt: new Date().toISOString() });
    setPayingId(null);
    refresh();
  }

  function submitDispute(fine) {
    if (!disputeReason.trim()) return;
    const appointment = new Date();
    appointment.setDate(appointment.getDate() + 7);
    updateFine(fine.id, {
      status: "disputed",
      dispute: {
        reason: disputeReason.trim(),
        submittedAt: new Date().toISOString(),
        thana: `${fine.location.split(",").slice(-2, -1)[0]?.trim() || "Local"} Thana`,
        appointmentDate: appointment.toISOString().slice(0, 10),
        appointmentTime: "11:00 AM",
        status: "pending review",
      },
    });
    setDisputingId(null);
    setDisputeReason("");
    refresh();
  }

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <div className="page__eyebrow">জরিমানা ও রেকর্ড</div>
          <h1>আপনার জরিমানার ইতিহাস</h1>
          <p className="page__sub">আপনার গাড়ির বিরুদ্ধে দেওয়া সব জরিমানা, প্রমাণ ও পরিশোধের অবস্থা দেখুন।</p>
        </div>
      </header>

      <div className="tabs">
        {TABS.map((t) => (
          <button key={t} className={`tabs__item ${tab === t ? "is-active" : ""}`} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      {visible.length === 0 && (
        <div className="empty">এই শ্রেণিতে কোনো জরিমানা নেই। এভাবেই পরিষ্কার রেকর্ড রাখুন।</div>
      )}

      <div className="ticket-list">
        {visible.map((fine) => {
          const violation = findViolation(fine.violationId);
          const isOpen = openId === fine.id;
          return (
            <article key={fine.id} className={`ticket ticket--${fine.status}`}>
              <button className="ticket__summary" onClick={() => setOpenId(isOpen ? null : fine.id)}>
                <div className="ticket__summary-left">
                  <span className={`status-pill status-pill--${fine.status}`}>{statusLabel(fine.status)}</span>
                  <div>
                    <div className="ticket__violation">{violation?.label}</div>
                    <div className="ticket__meta">{fine.vehicleNumber} · {formatDateTime(fine.dateTime)}</div>
                  </div>
                </div>
                <div className="ticket__amount">৳{fine.amount.toLocaleString()}</div>
              </button>

              {isOpen && (
                <div className="ticket__body">
                  <div className="ticket__grid">
                    <div><span>জরিমানা আইডি</span><strong>{fine.id}</strong></div>
                    <div><span>আইনি ধারা</span><strong>{violation?.section}</strong></div>
                    <div><span>ঘটনার স্থান</span><strong>{fine.location}</strong></div>
                    <div><span>তারিখ ও সময়</span><strong>{formatDateTime(fine.dateTime)}</strong></div>
                    <div><span>প্রদানকারী কর্মকর্তা</span><strong>{fine.surgentName} ({fine.surgentId})</strong></div>
                    <div><span>পরিশোধের মাধ্যম</span><strong>{fine.paymentMethod ? paymentMethodLabel(fine.paymentMethod) : "এখনও পরিশোধ করা হয়নি"}</strong></div>
                  </div>

                  {fine.proofUrl ? (
                    <div className="ticket__proof">
                      <span>লঙ্ঘনের প্রমাণ</span>
                      <img src={fine.proofUrl} alt="কর্মকর্তার জমা দেওয়া প্রমাণ" />
                    </div>
                  ) : (
                    <div className="ticket__proof ticket__proof--empty">এই জরিমানার সঙ্গে কোনো ছবি সংযুক্ত নেই।</div>
                  )}

                  {fine.dispute && (
                    <div className="dispute-note">
                      <strong>আপত্তি জমা হয়েছে</strong>
                      <p>{fine.dispute.reason}</p>
                      <p>
                        <strong>{fine.dispute.thana}</strong>-এ <strong>{fine.dispute.appointmentDate}</strong> তারিখে{" "}
                        <strong>{fine.dispute.appointmentTime}</strong>-এ উপস্থিত হন। অবস্থা: {statusLabel(fine.dispute.status)}।
                      </p>
                    </div>
                  )}

                  {fine.status === "unpaid" && (
                    <div className="ticket__actions">
                      {payingId === fine.id ? (
                        <div className="pay-box">
                          <label className="field">
                            <span>পরিশোধের মাধ্যম</span>
                            <select value={method} onChange={(e) => setMethod(e.target.value)}>
                              {PAYMENT_METHODS.map((m) => <option key={m}>{m}</option>)}
                            </select>
                          </label>
                          <div className="ticket__actions">
                            <button className="btn btn--primary" onClick={() => confirmPayment(fine)}>পরিশোধ নিশ্চিত করুন</button>
                            <button className="btn btn--ghost" onClick={() => setPayingId(null)}>বাতিল</button>
                          </div>
                        </div>
                      ) : disputingId === fine.id ? (
                        <div className="pay-box">
                          <label className="field">
                            <span>কেন মনে করছেন জরিমানাটি সঠিক নয়?</span>
                            <textarea
                              rows={3}
                              value={disputeReason}
                              onChange={(e) => setDisputeReason(e.target.value)}
                              placeholder="ঘটনাটি বিস্তারিত লিখুন..."
                            />
                          </label>
                          <div className="ticket__actions">
                            <button className="btn btn--primary" onClick={() => submitDispute(fine)}>আপত্তি জমা দিন</button>
                            <button className="btn btn--ghost" onClick={() => setDisputingId(null)}>বাতিল</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <button className="btn btn--primary" onClick={() => setPayingId(fine.id)}>জরিমানা পরিশোধ</button>
                          <button className="btn btn--outline" onClick={() => setDisputingId(fine.id)}>
                            আপত্তি জানাতে চাই
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
