# Traffic Management System — Frontend (React)

A frontend-only React app for a Bangladesh traffic citation system, with two
portals:

- **Driver** — log in with phone + name, register with NID, view fines with
  full evidence, pay or appeal a fine, manage vehicles, edit account details.
- **Sergeant** — log in with name + phone + sergeant ID, look up a vehicle by
  number/QR, issue a fine against Bangladesh's Road Transport Act 2018
  violation list, see daily/weekly/monthly/yearly duty stats, and resolve
  driver appeals.

There is **no backend**. All data (accounts, vehicles, fines) lives in your
browser's `localStorage` via `src/data/mockData.js`, which is written so you
can swap each function for a real API call later without touching any page
component.

---

## 1. Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer (includes `npm`)
- A code editor (VS Code)
- A free [Vercel](https://vercel.com/) account, for step 4

Check Node is installed:
```bash
node -v
npm -v
```

## 2. Get the project running locally

You already have the full project folder (`traffic-app/`). You do **not**
need to run `create-react-app` yourself — this folder already has the
`react-scripts` setup `create-react-app` would generate.

1. Unzip/copy the `traffic-app` folder somewhere on your machine and open it
   in VS Code.
2. Open a terminal in that folder and install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm start
   ```
4. Your browser opens `http://localhost:3000`. You'll land on the portal
   picker (Driver / Sergeant).

### Demo logins (seeded automatically on first load)

| Portal    | Fields                                                       |
|-----------|---------------------------------------------------------------|
| Driver    | Phone `01711000001`, Name `Kamal Hossain`                    |
| Sergeant  | Name `Anisur Rahman`, Phone `01911000042`, ID `SGT-0042`      |

Or use **Register** on either portal to create a brand-new account — it's
saved to `localStorage` immediately.

> Tip: to reset all demo data, open DevTools → Application → Local Storage →
> delete the `tms_*` keys, then refresh.

## 3. Project structure

```
traffic-app/
├── public/
│   └── index.html          # HTML shell, loads Barlow Condensed + Public Sans
├── src/
│   ├── index.js             # App entry, wraps App in AuthProvider + Router
│   ├── index.css            # All design tokens + component styles
│   ├── App.js                # All routes (public + protected)
│   ├── context/
│   │   └── AuthContext.js    # Login/signup/session logic (mock, swap for API)
│   ├── data/
│   │   └── mockData.js       # "Database": violations, seed data, CRUD helpers
│   ├── components/
│   │   ├── AppShell.js        # Sidebar layout used by both portals
│   │   └── ProtectedRoute.js  # Redirects to login if not authenticated
│   └── pages/
│       ├── Landing.js
│       ├── driver/  (Login, Signup, Home, Fines, Vehicles, Settings, Account)
│       └── surgent/ (Login, Signup, Home, Stats, Complaints, Settings, Account)
└── package.json
```

## 4. Connecting a real backend later

Every read/write goes through `src/data/mockData.js` and the functions in
`src/context/AuthContext.js`. To go live:

1. Replace the body of each function in `mockData.js` (e.g. `addFine`,
   `getFinesByDriver`) with a `fetch`/`axios` call to your API — keep the
   same function names and return shapes, and no page component needs to
   change.
2. Replace the mock `loginDriver` / `loginSurgent` in `AuthContext.js` with a
   real authentication call (OTP over SMS is the usual pattern for phone
   login in Bangladesh), and store a real token instead of the raw profile.
3. Swap the driver "Pay fine" button's `confirmPayment` for a real mobile
   banking gateway redirect (bKash/Nagad/Rocket all provide checkout SDKs or
   redirect URLs).

## 5. Deploying to Vercel

**Option A — Vercel CLI**
```bash
npm install -g vercel
vercel login
vercel        # first deploy, follow the prompts (framework: Create React App)
vercel --prod # promote to your production URL
```

**Option B — GitHub + Vercel dashboard**
1. Push this folder to a new GitHub repo:
   ```bash
   git init
   git add .
   git commit -m "Traffic management frontend"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```
2. Go to [vercel.com/new](https://vercel.com/new), import the repo.
3. Vercel auto-detects Create React App:
   - Build command: `npm run build` (auto-filled)
   - Output directory: `build` (auto-filled)
4. Click **Deploy**. You'll get a `*.vercel.app` link in about a minute.

No environment variables are needed for this frontend-only build.

## 6. Notes on scope

- QR "scanning" on the sergeant's Issue Fine screen is a text field, not a
  live camera — wire up a library like `react-qr-reader` when you add the
  camera/native app.
- Proof photos are read client-side with `FileReader` and stored as base64 in
  `localStorage` for the demo; a real backend should upload to object storage
  (e.g. S3) and store a URL instead.
- Fine amounts in `mockData.js` are illustrative placeholders aligned to the
  general structure of Bangladesh's Road Transport Act 2018 — confirm exact
  figures with BRTA/DMP before using this for anything real.
