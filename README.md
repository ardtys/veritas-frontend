# Veritas

**Indonesian manufacturing runs on trust. Veritas makes it verifiable.**

Veritas is a proof-of-concept platform built by Daffa Arditya that combines AI anomaly detection with blockchain-sealed records to solve the trust infrastructure problem in Indonesian manufacturing. Three modules — Supply Chain Tracker, AI Quality Control, and Smart Invoice — work together so that every batch, every shipment, and every payment is recorded once and verified forever. Buyers, banks, and vendors all read from the same immutable record instead of chasing each other on WhatsApp.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the landing page and [http://localhost:3000/dashboard](http://localhost:3000/dashboard) for the dashboard.

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router), TypeScript, Tailwind CSS v4 |
| Animations | Framer Motion |
| Charts | Recharts |
| Fonts | Playfair Display · DM Sans · JetBrains Mono (via next/font) |
| Blockchain | Solana (Rust smart contracts) — simulated in this prototype |
| AI/CV | Python computer vision — simulated in this prototype |
| Database | PostgreSQL — simulated in this prototype |

## Structure

```
app/
  page.tsx                      Landing page
  dashboard/
    page.tsx                    Overview (live activity feed + KPIs)
    supply-chain/page.tsx       Shipment records + anomaly detection
    quality-control/page.tsx    Batch QC scores + certificates
    invoices/page.tsx           Invoice table + smart contract log
components/
  landing/                      Landing-specific components
  dashboard/                    Dashboard-specific components
  shared/                       Used in both (Modal)
lib/
  mockData.ts                   All simulated data and generators
  utils.ts                      IDR formatting, date formatting, hash generation
```

## Notes

All data is simulated — no real backend, blockchain, or AI model is running. The dashboard updates every 5–8 seconds using `setInterval` to simulate live event ingestion. Transaction hashes shown in modals are randomly generated and not real Solana signatures.

---

*Built by Daffa Arditya · 2026*
