import React from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="landing">
      <div className="landing__stripes" aria-hidden="true" />
      <div className="landing__content">
        <div className="landing__eyebrow">বাংলাদেশ সড়ক পরিবহন</div>
        <h1 className="landing__title">
          সড়ক চলাচল, <span>তথ্য থাকুক স্বচ্ছ।</span>
        </h1>
        <p className="landing__lede">
          জরিমানা, গাড়ি ও দায়িত্বপ্রাপ্ত কর্মকর্তার তথ্য এক জায়গায় রাখুন।
          প্রমাণভিত্তিক সেবা ও স্বচ্ছ আপত্তি নিষ্পত্তি নিশ্চিত করুন।
        </p>

        <div className="landing__cards">
          <div className="landing__card">
            <div className="landing__card-tag">নাগরিকদের জন্য</div>
            <h2>চালক</h2>
            <p>নিজের জরিমানা দেখুন, গাড়ির তথ্য হালনাগাদ করুন এবং অনলাইনে পরিশোধ বা আপত্তি জানান।</p>
            <div className="landing__card-actions">
              <Link to="/driver/login" className="btn btn--primary">লগইন</Link>
              <Link to="/driver/signup" className="btn btn--ghost">নিবন্ধন</Link>
            </div>
          </div>

          <div className="landing__card landing__card--sergeant">
            <div className="landing__card-tag">কর্মকর্তাদের জন্য</div>
            <h2>ট্রাফিক কর্মকর্তা</h2>
            <p>গাড়ির নম্বর বা কিউআর কোড দিয়ে ঘটনাস্থলে জরিমানা প্রদান করুন এবং দায়িত্বের হিসাব রাখুন।</p>
            <div className="landing__card-actions">
              <Link to="/surgent/login" className="btn btn--primary">লগইন</Link>
              <Link to="/surgent/signup" className="btn btn--ghost">নিবন্ধন</Link>
            </div>
          </div>
        </div>

        <p className="landing__footnote">
          ডেমো সংস্করণ — প্রদর্শিত অ্যাকাউন্ট ও জরিমানার তথ্য শুধু আপনার ব্রাউজারে সংরক্ষিত নমুনা ডেটা।
        </p>
      </div>
    </div>
  );
}
