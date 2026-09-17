import React from "react";
import { useAuth } from "../../context/AuthContext";
import { VIOLATION_TYPES } from "../../data/mockData";

const RULES = [
  { title: "লাল বাতিতে সম্পূর্ণ থামুন", body: "স্টপ লাইনের আগে সম্পূর্ণ থামুন। ক্রসিংয়ের ভেতরে ধীরে এগোলেও তা সংকেত অমান্য হিসেবে গণ্য হতে পারে।" },
  { title: "সবসময় হেলমেট পরুন", body: "যে কোনো সড়কে মোটরসাইকেলের চালক ও আরোহী উভয়ের বাঁধা হেলমেট পরা বাধ্যতামূলক।" },
  { title: "হাতে মোবাইল নয়", body: "গাড়ি চলার সময় হাতে মোবাইলে কথা বলা বা বার্তা লেখা বেপরোয়া চালনা হিসেবে গণ্য হতে পারে।" },
  { title: "কাগজপত্র হালনাগাদ রাখুন", body: "ফিটনেস সনদ, ট্যাক্স টোকেন ও রুট পারমিট বৈধ রাখুন এবং প্রয়োজনীয় কপি সঙ্গে রাখুন।" },
  { title: "সঠিক লেনে চলুন", body: "ভুল লেনে ওভারটেক করা বা মোড় আটকে রাখা দুর্ঘটনা না ঘটলেও জরিমানাযোগ্য হতে পারে।" },
  { title: "অনুমোদিত বোঝা বহন করুন", body: "অতিরিক্ত যাত্রী বা পণ্য বহন করলে জরিমানা এবং গাড়ির ফিটনেট সনদ উভয়ই ঝুঁকিতে পড়তে পারে।" },
];

export default function DriverHome() {
  const { session } = useAuth();
  const firstName = session?.profile?.name?.split(" ")[0];

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <div className="page__eyebrow">হোম</div>
          <h1>স্বাগতম, {firstName}</h1>
          <p className="page__sub">যেসব সড়ক আইনে বেশি জরিমানা হয়, সেগুলোর সংক্ষিপ্ত নির্দেশনা।</p>
        </div>
      </header>

      <section className="rule-grid">
        {RULES.map((rule) => (
          <article key={rule.title} className="rule-card">
            <h3>{rule.title}</h3>
            <p>{rule.body}</p>
          </article>
        ))}
      </section>

      <section className="panel">
        <div className="panel__header">
          <h2>সাধারণ লঙ্ঘন ও জরিমানা</h2>
          <span className="panel__meta">সড়ক পরিবহন আইন, ২০১৮</span>
        </div>
        <div className="table">
          <div className="table__row table__row--head">
            <div>লঙ্ঘনের ধরন</div>
            <div>আইনি ধারা</div>
            <div>জরিমানা</div>
          </div>
          {VIOLATION_TYPES.slice(0, 8).map((v) => (
            <div className="table__row" key={v.id}>
              <div>{v.label}</div>
              <div className="table__muted">{v.section}</div>
              <div className="table__amount">৳{v.amount.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
