import React from "react";
import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import ProtectedRoute from "./components/ProtectedRoute";
import AppShell from "./components/AppShell";

import DriverLogin from "./pages/driver/Login";
import DriverSignup from "./pages/driver/Signup";
import DriverHome from "./pages/driver/Home";
import DriverFines from "./pages/driver/Fines";
import DriverVehicles from "./pages/driver/Vehicles";
import DriverSettings from "./pages/driver/Settings";
import DriverAccount from "./pages/driver/Account";

import SurgentLogin from "./pages/surgent/Login";
import SurgentSignup from "./pages/surgent/Signup";
import SurgentHome from "./pages/surgent/Home";
import SurgentStats from "./pages/surgent/Stats";
import SurgentComplaints from "./pages/surgent/Complaints";
import SurgentSettings from "./pages/surgent/Settings";
import SurgentAccount from "./pages/surgent/Account";

const driverNav = [
  { to: "/driver/app/home", label: "হোম", icon: "⌂", end: true },
  { to: "/driver/app/fines", label: "জরিমানা ও রেকর্ড", icon: "⚑" },
  { to: "/driver/app/vehicles", label: "গাড়ির তথ্য", icon: "🚗" },
  { to: "/driver/app/settings", label: "সেটিংস", icon: "⚙" },
  { to: "/driver/app/account", label: "অ্যাকাউন্ট", icon: "◍" },
];

const surgentNav = [
  { to: "/surgent/app/home", label: "জরিমানা প্রদান", icon: "⚑", end: true },
  { to: "/surgent/app/stats", label: "কার্যক্রম", icon: "▤" },
  { to: "/surgent/app/complaints", label: "আপত্তি নিষ্পত্তি", icon: "⚖" },
  { to: "/surgent/app/settings", label: "সেটিংস", icon: "⚙" },
  { to: "/surgent/app/account", label: "অ্যাকাউন্ট", icon: "◍" },
];

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      {/* Driver public */}
      <Route path="/driver/login" element={<DriverLogin />} />
      <Route path="/driver/signup" element={<DriverSignup />} />

      {/* Driver protected */}
      <Route element={<ProtectedRoute role="driver" />}>
        <Route path="/driver/app" element={<AppShell navItems={driverNav} roleLabel="চালক" roleTag="চালক পোর্টাল" />}>
          <Route path="home" element={<DriverHome />} />
          <Route path="fines" element={<DriverFines />} />
          <Route path="vehicles" element={<DriverVehicles />} />
          <Route path="settings" element={<DriverSettings />} />
          <Route path="account" element={<DriverAccount />} />
        </Route>
      </Route>

      {/* Surgent public */}
      <Route path="/surgent/login" element={<SurgentLogin />} />
      <Route path="/surgent/signup" element={<SurgentSignup />} />

      {/* Surgent protected */}
      <Route element={<ProtectedRoute role="surgent" />}>
        <Route path="/surgent/app" element={<AppShell navItems={surgentNav} roleLabel="ট্রাফিক কর্মকর্তা" roleTag="কর্মকর্তা পোর্টাল" />}>
          <Route path="home" element={<SurgentHome />} />
          <Route path="stats" element={<SurgentStats />} />
          <Route path="complaints" element={<SurgentComplaints />} />
          <Route path="settings" element={<SurgentSettings />} />
          <Route path="account" element={<SurgentAccount />} />
        </Route>
      </Route>

      <Route path="*" element={<Landing />} />
    </Routes>
  );
}
