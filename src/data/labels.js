export const STATUS_LABELS = {
  unpaid: "অপরিশোধিত",
  paid: "পরিশোধিত",
  disputed: "আপত্তিকৃত",
  "pending review": "পর্যালোচনাধীন",
  "upheld — fine stands": "বহাল — জরিমানা কার্যকর",
  "dismissed — fine waived": "খারিজ — জরিমানা মওকুফ",
};

export const PAYMENT_METHOD_LABELS = {
  bKash: "বিকাশ",
  Nagad: "নগদ",
  Rocket: "রকেট",
  "Bank Card": "ব্যাংক কার্ড",
  "Bank Challan (Sonali Bank)": "ব্যাংক চালান (সোনালী ব্যাংক)",
};

export const VEHICLE_TYPE_LABELS = {
  "Private Car": "ব্যক্তিগত গাড়ি",
  Motorcycle: "মোটরসাইকেল",
  "CNG / Auto-rickshaw": "সিএনজি / অটোরিকশা",
  Bus: "বাস",
  Truck: "ট্রাক",
  Pickup: "পিকআপ",
  Microbus: "মাইক্রোবাস",
};

export function statusLabel(status) {
  return STATUS_LABELS[status] || status;
}

export function paymentMethodLabel(method) {
  return PAYMENT_METHOD_LABELS[method] || method;
}

export function vehicleTypeLabel(type) {
  return VEHICLE_TYPE_LABELS[type] || type;
}
