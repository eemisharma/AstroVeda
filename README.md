# AstroConsult — Production-Ready Astrology Consultation PWA

A mobile-first **Progressive Web App (PWA)** for an online Vedic astrology consultation and personalized astrology analysis business designed for traffic acquisition via Instagram Ads.

---

## 1. What the Application Does

AstroConsult allows users discovering the brand on Instagram to seamlessly navigate through a high-converting 4-step mobile funnel:
1. **Discover on Instagram Ad** with automatic UTM attribution capture (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `fbclid`).
2. **Explore Services**: Complete Birth Chart Analysis, Career & Money Analysis, Love & Relationship Analysis, and General Life Analysis.
3. **Submit Accurate Birth Details**: Date of birth, exact time of birth, and birth location with prominent accuracy notices.
4. **Complete Secure Payment**: Seamless Indian online payments via UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards, and NetBanking via Razorpay.
5. **Vedic Calculation & AI Analysis Engine**: Computes exact sidereal Ascendant, planetary degrees, Nakshatra, and Vimshottari Mahadasha timeline, followed by ethical, grounded personal guidance.
6. **Customer Dashboard & Interactive Report**: Full 10-section structured report, visual North Indian Kundli chart (SVG), print-to-PDF generation, and permanent account access.
7. **WhatsApp Notifications**: Instant automated dispatch for order confirmation and report readiness alerts.
8. **Admin Control Panel**: Real-time KPI analytics, order management, customer directory, dynamic service pricing adjustments, and manual report regeneration.

---

## 2. Tech Stack

- **Framework**: Next.js 14+ (App Router, Server Components & Server Actions, Route Handlers)
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS (Celestial Navy `#0b0e17`, Spiritual Gold `#e5b842`, Mystic Purple `#8b5cf6`, Glassmorphic backdrop blurs)
- **Database & ORM**: PostgreSQL via Prisma ORM (with zero-config SQLite fallback for instant local development)
- **Authentication**: Secure JWT stored in HTTP-only cookies with bcrypt password hashing
- **Payment Gateway**: Razorpay (UPI, Cards, NetBanking) with cryptographic HMAC-SHA256 signature verification and integrated test simulator
- **Vedic Astrology Engine**: Modular `AstrologyProvider` interface with high-precision sidereal astronomical approximations (Lahiri Ayanamsha) and commercial API adapter
- **AI Analysis Engine**: Modular `AIAnalysisService` with ethical guardrails, Gemini 1.5 API support, and deterministic Vedic synthesis fallback
- **PWA**: Web App Manifest (`manifest.webmanifest`), custom Service Worker (`sw.js`), offline navigation fallback, and non-intrusive install prompt
- **Icons**: Lucide React

---

## 3. Project Structure

```text
astro-consult-pwa/
├── public/
│   ├── icons/                 # PWA icons (192x192, 512x512, maskable, SVG)
│   ├── manifest.webmanifest   # Web App Manifest specification
│   ├── manifest.json          # Manifest fallback
│   └── sw.js                  # Service Worker with CacheFirst & NetworkFirst strategies
├── prisma/
│   ├── schema.prisma          # Prisma schema (SQLite dev / PostgreSQL ready)
│   └── schema.postgresql.prisma # PostgreSQL production schema
├── scripts/
│   ├── seed.js                # Database seed script (services, admin, demo customer)
│   └── generate-icons.js      # Programmatic PWA icon generator
├── src/
│   ├── app/
│   │   ├── admin/             # Admin Portal (KPIs, orders, customers, pricing, settings)
│   │   ├── api/               # Decoupled REST API endpoints (Auth, Checkout, Customer, Admin, Webhooks)
│   │   ├── checkout/          # Multi-step checkout funnel
│   │   ├── dashboard/         # Customer Dashboard & interactive 10-section report
│   │   ├── login/ & signup/   # Authentication pages
│   │   ├── payment/           # Payment success & failure screens
│   │   ├── services/          # Services catalog & detailed slug landing pages
│   │   ├── offline/           # PWA offline fallback page
│   │   ├── globals.css        # Tailwind styles & print stylesheets
│   │   ├── layout.tsx         # Root layout with PWA meta & bottom navigation
│   │   └── page.tsx           # Conversion-focused homepage
│   ├── components/
│   │   ├── checkout/          # Payment Simulator Modal for demo mode
│   │   ├── kundli/            # North Indian Vedic Chart SVG component
│   │   ├── layout/            # Navbar, Footer, MobileNav (bottom bar)
│   │   ├── marketing/         # UTM tracker & Meta Pixel triggers
│   │   ├── pwa/               # InstallPrompt, OfflineBanner, ServiceWorkerRegister
│   │   └── report/            # Report client actions (print/PDF, share, WhatsApp help)
│   └── lib/
│       ├── ai/                # Ethical AI prompt, Gemini client & Vedic synthesis engine
│       ├── astrology/         # Modular AstrologyProvider, types, sidereal calculations
│       ├── auth/              # JWT tokens, password hashing, session resolvers
│       ├── db.ts              # Prisma client singleton
│       ├── marketing/         # UTM parameters & analytics helpers
│       ├── orders/            # Order processor coordinator
│       ├── payment/           # Razorpay order creator & signature verifier
│       └── whatsapp/          # WhatsApp Cloud API dispatcher & deep links
├── .env.example               # Environment variables template
├── next.config.mjs            # Next.js configuration & security headers
├── tailwind.config.ts         # Custom celestial theme
├── tsconfig.json              # TypeScript configuration
└── package.json
```

---

## 4. Local Setup & Quickstart

### Prerequisites
- Node.js 18+ (tested on Node.js v24)
- npm or pnpm

### Installation
1. Clone or navigate to the repository:
   ```bash
   cd C:\Users\SWAGAT\.gemini\antigravity\scratch\astro-consult-pwa
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize the database and generate the Prisma Client:
   ```bash
   npx prisma db push
   npx prisma generate
   ```
4. Seed default services and demo accounts:
   ```bash
   node scripts/seed.js
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```
6. Open your browser:
   - **Public Website & PWA**: [http://localhost:3010](http://localhost:3010)
   - **Customer Sign In**: [http://localhost:3010/login](http://localhost:3010/login)
   - **Admin Control Panel**: [http://localhost:3010/admin](http://localhost:3010/admin)

---

## 5. Default Accounts & Credentials

### Administrator Account
- **Email**: `admin@astroconsult.com`
- **Password**: `AdminPassword123!`
- **Role**: `ADMIN`
- **Permissions**: Full access to `/admin`, order status updates, report regeneration, and service pricing edits.

### Demo Customer Account
- **Email**: `customer@example.com`
- **Password**: `CustomerPassword123!`
- **Role**: `CUSTOMER`
- **Permissions**: View personal consultations in `/dashboard`.

---

## 6. Environment Variables Configuration (`.env`)

Create a `.env` file based on `.env.example`:

```env
# Database connection
DATABASE_URL="file:./dev.db" # Or postgresql://user:password@localhost:5432/astroconsult?schema=public

# Authentication secret (Generate a strong 32+ char secret for production)
AUTH_SECRET="your-super-secure-jwt-auth-secret-key-min-32-chars"
JWT_EXPIRES_IN="7d"

# Razorpay Payment Gateway (Test or Live credentials)
RAZORPAY_KEY_ID="rzp_test_placeholder"
RAZORPAY_KEY_SECRET="rzp_test_placeholder_secret"
RAZORPAY_WEBHOOK_SECRET="rzp_test_placeholder_webhook"

# External Astrology API (optional)
ASTROLOGY_API_KEY=""
ASTROLOGY_API_URL=""

# AI Engine API Key (Gemini API or compatible LLM)
AI_API_KEY=""

# WhatsApp Cloud API
WHATSAPP_ACCESS_TOKEN=""
WHATSAPP_PHONE_NUMBER_ID=""
WHATSAPP_VERIFY_TOKEN=""
NEXT_PUBLIC_WHATSAPP_SUPPORT_PHONE="919876543210"

# Marketing Tracking
NEXT_PUBLIC_META_PIXEL_ID=""
NEXT_PUBLIC_GA_ID=""
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Demo Mode (Simulates instant payment & real-time report generation for development/testing)
DEMO_MODE="true"
```

---

## 7. Demo Mode & Test Simulator

When developing or validating without active external API credentials:
- **Test Payment Simulator**: When `RAZORPAY_KEY_ID` contains `placeholder` or is omitted, an elegant test gateway dialog automatically appears on checkout. You can test instant simulated payment success or failure with zero configuration.
- **Vedic Astronomical Engine**: Computes realistic planetary degrees, signs, houses, Nakshatras, and Mahadasha cycles using sidereal math and Lahiri Ayanamsha.
- **AI Synthesis Fallback**: When `AI_API_KEY` is not provided, the built-in deterministic engine synthesizes an authentic, deeply personalized 10-section report following all ethical guidelines.
- **WhatsApp Logger**: Dispatched messages are printed to the server terminal and logged into the `Notification` table in the database so admins can inspect outgoing notifications.

---

## 8. Switching to PostgreSQL for Production

1. Update your `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:your_password@your_host:5432/astroconsult?schema=public"
   ```
2. Replace `prisma/schema.prisma` datasource provider:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
   *(Or simply copy `prisma/schema.postgresql.prisma` over `prisma/schema.prisma`)*
3. Run the migration:
   ```bash
   npx prisma migrate dev --name init
   node scripts/seed.js
   ```

---

## 9. PWA Installation & Offline Support

- **Manifest**: Located at `/manifest.webmanifest` and `/manifest.json`, configured for `display: standalone` in portrait mode with background `#0b0e17`.
- **Icons**: Generated at 192x192, 512x512, and maskable formats.
- **Service Worker**: Precaches core static assets and falls back to `/offline` if network connectivity drops.
- **Install Prompt**: An unobtrusive prompt appears on mobile devices when the browser fires `beforeinstallprompt`.

---

## 10. Security & Ethical Guidelines

- **Strict Access Control**: Customers can only view their own consultation orders and reports (`order.userId === session.userId`). URL parameter tampering is rejected with `403 Forbidden`.
- **No Fear-Mongering**: In accordance with the ethical prompt guidelines, the AI and calculation engine strictly avoid fatalistic claims, curses, medical diagnosis, legal advice, or financial guarantees.
- **Payment Verification**: Payments are strictly verified server-side using HMAC-SHA256 signatures before updating order state to `PAID`.
