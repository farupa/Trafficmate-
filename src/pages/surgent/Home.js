import React, { useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { VIOLATION_TYPES, getVehicles, addFine, findViolation } from "../../data/mockData";
import { vehicleTypeLabel } from "../../data/labels";

export default function SurgentHome() {
  const { session } = useAuth();
  const fileRef = useRef(null);

  const [lookupValue, setLookupValue] = useState("");
  const [matchedVehicle, setMatchedVehicle] = useState(null);
  const [lookupTried, setLookupTried] = useState(false);

  const [violationId, setViolationId] = useState(VIOLATION_TYPES[0].id);
  const [amount, setAmount] = useState(VIOLATION_TYPES[0].amount);
  const [location, setLocation] = useState("");
  const [dateTime, setDateTime] = useState(() => new Date().toISOString().slice(0, 16));
  const [proofUrl, setProofUrl] = useState("");
  const [confirmation, setConfirmation] = useState(null);

  function handleLookup(e) {
    e.preventDefault();
    setLookupTried(true);
    const found = getVehicles().find(
      (v) => v.vehicleNumber.toLowerCase().replace(/\s+/g, "") === lookupValue.toLowerCase().replace(/\s+/g, "")
    );
    setMatchedVehicle(found || null);
  }

  function handleViolationChange(id) {
    setViolationId(id);
    const v = findViolation(id);
    if (v) setAmount(v.amount);
  }

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProofUrl(reader.result);
    reader.readAsDataURL(file);
  }

  function issueFine(e) {
    e.preventDefault();
    const violation = findViolation(violationId);
    const fine = addFine({
      driverId: matchedVehicle?.driverId || null,
      vehicleNumber: lookupValue,
      violationId,
      amount: Number(amount),
      dateTime: new Date(dateTime).toISOString(),
      location,
      proofUrl,
      surgentId: session.profile.id,
      surgentName: session.profile.name,
      paymentMethod: "",
    });
    setConfirmation({ id: fine.id, violation: violation.label, amount: fine.amount });

    // reset for the next stop
    setLookupValue("");
    setMatchedVehicle(null);
    setLookupTried(false);
    setLocation("");
    setProofUrl("");
    setDateTime(new Date().toISOString().slice(0, 16));
  }

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <div className="page__eyebrow">জরিমানা প্রদান</div>
          <h1>গাড়ি স্ক্যান বা নম্বর লিখুন</h1>
          <p className="page__sub">গাড়ির তথ্য খুঁজে নিয়ে লঙ্ঘনের বিবরণ ও প্রমাণ সংযুক্ত করুন।</p>
        </div>
      </header>

      {confirmation && (
        <div className="confirmation-banner">
          <strong>{confirmation.id}</strong> নম্বরের জরিমানা প্রদান হয়েছে: <strong>{confirmation.violation}</strong> — ৳{confirmation.amount.toLocaleString()}।
          <button onClick={() => setConfirmation(null)}>বন্ধ করুন</button>
        </div>
      )}

      <section className="panel">
        <div className="lookup-row">
          <label className="field field--grow">
            <span>কিউআর কোড বা গাড়ির নম্বর</span>
            <input
              value={lookupValue}
              onChange={(e) => setLookupValue(e.target.value)}
              placeholder="কিউআর স্ক্যান করুন অথবা লিখুন: Dhaka Metro-Ga 12-3456"
            />
          </label>
          <button className="btn btn--primary" onClick={handleLookup}>তথ্য খুঁজুন</button>
        </div>

        {lookupTried && (
          matchedVehicle ? (
            <div className="lookup-result lookup-result--found">
              নিবন্ধিত গাড়ির তথ্য পাওয়া গেছে — {vehicleTypeLabel(matchedVehicle.type)}, লাইসেন্স {matchedVehicle.licenseNumber}।
            </div>
          ) : (
            <div className="lookup-result lookup-result--missing">
              এই নম্বরের কোনো নিবন্ধিত গাড়ির তথ্য পাওয়া যায়নি। তবুও জরিমানা দেওয়া যাবে, তবে চালকের সঙ্গে ম্যানুয়ালি যুক্ত করার জন্য চিহ্নিত থাকবে।
            </div>
          )
        )}
      </section>

      <section className="panel">
        <div className="panel__header"><h2>জরিমানার বিবরণ</h2></div>
        <form onSubmit={issueFine} className="form form--grid">
          <label className="field field--span2">
            <span>লঙ্ঘনের ধরন</span>
            <select value={violationId} onChange={(e) => handleViolationChange(e.target.value)}>
              {VIOLATION_TYPES.map((v) => (
                <option key={v.id} value={v.id}>{v.label} — {v.section}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>জরিমানার পরিমাণ (৳)</span>
            <input required type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </label>
          <label className="field">
            <span>তারিখ ও সময়</span>
            <input required type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} />
          </label>
          <label className="field field--span2">
            <span>ঘটনার স্থান</span>
            <input required value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Science Lab Crossing, Dhanmondi, Dhaka" />
          </label>
          <label className="field field--span2">
            <span>প্রমাণ (ছবি)</span>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} />
            {proofUrl && <img className="proof-preview" src={proofUrl} alt="সংযুক্ত প্রমাণ" />}
          </label>

          <div className="field field--span2">
            <div className="officer-tag">
              জরিমানা প্রদানকারী কর্মকর্তা: <strong>{session.profile.name}</strong> ({session.profile.id}) · {session.profile.zone}
            </div>
          </div>

          <button type="submit" className="btn btn--primary field--span2" disabled={!lookupValue}>
            জরিমানা প্রদান করুন
          </button>
        </form>
      </section>
    </div>
  );
}
