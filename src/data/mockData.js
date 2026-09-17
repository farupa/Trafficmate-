// ---------------------------------------------------------------------------
// Mock "database" for the Traffic Management frontend.
// Everything is persisted to localStorage so the demo survives a refresh.
// Swap the functions in this file for real API calls when the backend is ready.
// ---------------------------------------------------------------------------

const KEYS = {
  DRIVERS: "tms_drivers",
  SURGENTS: "tms_surgents",
  VEHICLES: "tms_vehicles",
  FINES: "tms_fines",
  SESSION: "tms_session",
};

// Violation catalogue, roughly aligned with Bangladesh's Road Transport Act 2018.
// Amounts are illustrative placeholders — wire up real figures on the backend later.
export const VIOLATION_TYPES = [
  { id: "no-license", label: "বৈধ ড্রাইভিং লাইসেন্স ছাড়া গাড়ি চালানো", amount: 25000, section: "সড়ক পরিবহন আইন ২০১৮, ধারা ১৪৮" },
  { id: "no-fitness", label: "বৈধ ফিটনেস সনদ না থাকা", amount: 5000, section: "সড়ক পরিবহন আইন ২০১৮, ধারা ৫১" },
  { id: "no-registration", label: "নিবন্ধন সনদ না থাকা", amount: 25000, section: "সড়ক পরিবহন আইন ২০১৮, ধারা ৪৭" },
  { id: "no-route-permit", label: "রুট পারমিট ছাড়া চলাচল", amount: 20000, section: "সড়ক পরিবহন আইন ২০১৮, ধারা ৬৬" },
  { id: "signal-violation", label: "ট্রাফিক সংকেত বা সাইন অমান্য করা", amount: 3000, section: "সড়ক পরিবহন আইন ২০১৮, ধারা ৯২" },
  { id: "reckless-driving", label: "বেপরোয়া বা বিপজ্জনকভাবে গাড়ি চালানো", amount: 25000, section: "সড়ক পরিবহন আইন ২০১৮, ধারা ৯৮" },
  { id: "no-helmet", label: "হেলমেট ছাড়া মোটরসাইকেল চালানো", amount: 500, section: "সড়ক পরিবহন আইন ২০১৮, ধারা ৯২(ক)" },
  { id: "no-seatbelt", label: "সিটবেল্ট ব্যবহার না করা", amount: 500, section: "সড়ক পরিবহন আইন ২০১৮, ধারা ৯২(ক)" },
  { id: "mobile-phone", label: "গাড়ি চালানোর সময় মোবাইল ব্যবহার", amount: 5000, section: "সড়ক পরিবহন আইন ২০১৮, ধারা ৯২(ক)" },
  { id: "overloading", label: "যাত্রী বা পণ্য অতিরিক্ত বোঝাই করা", amount: 5000, section: "সড়ক পরিবহন আইন ২০১৮, ধারা ৯৪" },
  { id: "illegal-parking", label: "অবৈধ বা চলাচলে বাধাদানকারী পার্কিং", amount: 1000, section: "সড়ক পরিবহন আইন ২০১৮, ধারা ৯৬" },
  { id: "expired-tax-token", label: "মেয়াদোত্তীর্ণ ট্যাক্স টোকেন", amount: 5000, section: "সড়ক পরিবহন আইন ২০১৮, ধারা ৪৭" },
  { id: "wrong-lane", label: "ভুল পাশ বা ভুল লেনে গাড়ি চালানো", amount: 3000, section: "সড়ক পরিবহন আইন ২০১৮, ধারা ৯২" },
];

export const PAYMENT_METHODS = ["bKash", "Nagad", "Rocket", "Bank Card", "Bank Challan (Sonali Bank)"];

const SEED_DRIVERS = [
  {
    id: "DRV-1001",
    name: "কামাল হোসেন",
    phone: "01711000001",
    nid: "1994778812340",
    permanentAddress: "গ্রাম: বানিয়াচং, হবিগঞ্জ",
    presentAddress: "বাড়ি ১৪, সড়ক ৭, ধানমন্ডি, ঢাকা",
    password: "1234",
  },
];

const SEED_SURGENTS = [
  {
    id: "SGT-0042",
    name: "আনিসুর রহমান",
    phone: "01911000042",
    badgeId: "DMP-TR-0042",
    rank: "সার্জেন্ট",
    zone: "ধানমন্ডি ট্রাফিক এলাকা",
    password: "1234",
  },
];

const SEED_VEHICLES = [
  {
    id: "VEH-5001",
    driverId: "DRV-1001",
    vehicleNumber: "Dhaka Metro-Ga 12-3456",
    type: "Private Car",
    licenseNumber: "DL-DHK-0119947788",
    registrationNumber: "REG-2019-887766",
    fitnessExpiry: "2026-11-30",
    taxTokenExpiry: "2026-12-15",
    insuranceExpiry: "2027-01-20",
    lastIssuedDate: "2024-01-10",
  },
];

const SEED_FINES = [
  {
    id: "FINE-90001",
    driverId: "DRV-1001",
    vehicleNumber: "Dhaka Metro-Ga 12-3456",
    violationId: "signal-violation",
    amount: 3000,
    dateTime: "2026-09-02T10:24:00",
    location: "সায়েন্স ল্যাব মোড়, ধানমন্ডি, ঢাকা",
    proofUrl: "",
    surgentId: "SGT-0042",
    surgentName: "Anisur Rahman",
    paymentMethod: "bKash",
    status: "unpaid", // unpaid | paid | disputed
    dispute: null, // { reason, submittedAt, appointmentDate, appointmentTime, thana, status }
  },
];

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function seedIfEmpty() {
  if (!localStorage.getItem(KEYS.DRIVERS)) write(KEYS.DRIVERS, SEED_DRIVERS);
  if (!localStorage.getItem(KEYS.SURGENTS)) write(KEYS.SURGENTS, SEED_SURGENTS);
  if (!localStorage.getItem(KEYS.VEHICLES)) write(KEYS.VEHICLES, SEED_VEHICLES);
  if (!localStorage.getItem(KEYS.FINES)) write(KEYS.FINES, SEED_FINES);
}

// ---- Drivers ---------------------------------------------------------------
export const getDrivers = () => read(KEYS.DRIVERS, []);
export const saveDrivers = (list) => write(KEYS.DRIVERS, list);
export const addDriver = (driver) => {
  const list = getDrivers();
  list.push(driver);
  saveDrivers(list);
  return driver;
};
export const updateDriver = (id, patch) => {
  const list = getDrivers().map((d) => (d.id === id ? { ...d, ...patch } : d));
  saveDrivers(list);
  return list.find((d) => d.id === id);
};

// ---- Surgents ---------------------------------------------------------------
export const getSurgents = () => read(KEYS.SURGENTS, []);
export const saveSurgents = (list) => write(KEYS.SURGENTS, list);
export const addSurgent = (surgent) => {
  const list = getSurgents();
  list.push(surgent);
  saveSurgents(list);
  return surgent;
};
export const updateSurgent = (id, patch) => {
  const list = getSurgents().map((s) => (s.id === id ? { ...s, ...patch } : s));
  saveSurgents(list);
  return list.find((s) => s.id === id);
};

// ---- Vehicles ---------------------------------------------------------------
export const getVehicles = () => read(KEYS.VEHICLES, []);
export const getVehiclesByDriver = (driverId) => getVehicles().filter((v) => v.driverId === driverId);
export const addVehicle = (vehicle) => {
  const list = getVehicles();
  const record = { id: `VEH-${Date.now()}`, ...vehicle };
  list.push(record);
  write(KEYS.VEHICLES, list);
  return record;
};
export const updateVehicle = (id, patch) => {
  const list = getVehicles().map((v) => (v.id === id ? { ...v, ...patch } : v));
  write(KEYS.VEHICLES, list);
  return list.find((v) => v.id === id);
};

// ---- Fines ---------------------------------------------------------------
export const getFines = () => read(KEYS.FINES, []);
export const getFinesByDriver = (driverId) => getFines().filter((f) => f.driverId === driverId);
export const getFinesBySurgent = (surgentId) => getFines().filter((f) => f.surgentId === surgentId);
export const addFine = (fine) => {
  const list = getFines();
  const record = { id: `FINE-${Date.now()}`, status: "unpaid", dispute: null, ...fine };
  list.push(record);
  write(KEYS.FINES, list);
  return record;
};
export const updateFine = (id, patch) => {
  const list = getFines().map((f) => (f.id === id ? { ...f, ...patch } : f));
  write(KEYS.FINES, list);
  return list.find((f) => f.id === id);
};

export const findViolation = (id) => VIOLATION_TYPES.find((v) => v.id === id);
