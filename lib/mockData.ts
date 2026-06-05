import { generateVTXHash, generateBlockHash, generateBlockNumber, randomBetween } from './utils';

let _idCounter = 0;
function uid(): string {
  return `id-${++_idCounter}`;
}

// ─── Types ───────────────────────────────────────────────

export type EventType =
  | 'SHIPMENT_SEALED'
  | 'QC_PASSED'
  | 'QC_FAILED'
  | 'INVOICE_TRIGGERED'
  | 'PAYMENT_RELEASED';

export interface ActivityEvent {
  id: string;
  type: EventType;
  description: string;
  timestamp: Date;
}

export interface ShipmentRecord {
  id: string;
  origin: string;
  destination: string;
  status: 'In Transit' | 'Delivered' | 'Flagged' | 'Pending';
  timestamp: Date;
  hash: string;
}

export interface QCBatch {
  id: string;
  productLine: string;
  score: number;
  status: 'Passed' | 'Failed' | 'Pending';
  timestamp: Date;
  hash: string;
}

export interface InvoiceRecord {
  id: string;
  vendor: string;
  amount: number;
  status: 'Pending' | 'Verified' | 'Released' | 'Failed';
  triggeredAt: Date | null;
  hash: string;
}

export interface HourlyEvent {
  hour: string;
  events: number;
}

export interface ContractLogEntry {
  id: string;
  event: string;
  timestamp: Date;
  hash: string;
}

export interface BlockchainRecord {
  hash: string;
  blockNumber: number;
  timestamp: Date;
  event: string;
  data: Record<string, string | number>;
}

// ─── Seed data ───────────────────────────────────────────

const CITIES = [
  'Surabaya', 'Jakarta', 'Bandung', 'Semarang', 'Medan',
  'Makassar', 'Balikpapan', 'Palembang', 'Batam', 'Pekanbaru',
];

const VENDORS = [
  'PT Baja Nusantara', 'CV Pratama Teknik', 'PT Sumber Makmur',
  'UD Karya Mandiri', 'PT Indo Polymer', 'CV Mitra Industri',
  'PT Logam Jaya', 'UD Prima Plastik', 'PT Kawat Baja Sejati',
  'CV Fajar Teknik',
];

const PRODUCT_LINES = [
  'Baja Lembaran G-40', 'Komponen Otomotif K-12', 'Pelat Aluminium A3',
  'Kawat Las WL-200', 'Polymer PP-N50', 'Pipa Galvanis PG-8',
  'Seng Bergelombang SB-6', 'Baut & Mur Set BM-100',
];

function makeTimestamp(minutesAgo: number): Date {
  return new Date(Date.now() - minutesAgo * 60 * 1000);
}

// ─── Activity Feed ────────────────────────────────────────

const EVENT_TEMPLATES: Record<EventType, (id: string) => string> = {
  SHIPMENT_SEALED: (id) => `Shipment ${id} recorded — ${CITIES[randomBetween(0, 4)]} to ${CITIES[randomBetween(5, 9)]}`,
  QC_PASSED: (id) => `Batch ${id} passed quality check — scored ${randomBetween(91, 99)}/100`,
  QC_FAILED: (id) => `Batch ${id} failed quality check — scored ${randomBetween(52, 69)}/100`,
  INVOICE_TRIGGERED: (id) => `Invoice ${id} checked — quality and delivery matched`,
  PAYMENT_RELEASED: (id) => `Payment sent automatically for ${id}`,
};

export function generateActivityEvent(): ActivityEvent {
  const types: EventType[] = ['SHIPMENT_SEALED', 'QC_PASSED', 'QC_FAILED', 'INVOICE_TRIGGERED', 'PAYMENT_RELEASED'];
  const weights = [3, 4, 1, 3, 3];
  let r = Math.random() * weights.reduce((a, b) => a + b, 0);
  let type: EventType = types[0];
  for (let i = 0; i < types.length; i++) {
    r -= weights[i];
    if (r <= 0) { type = types[i]; break; }
  }
  const prefix = type.startsWith('QC') ? 'BATCH' : type.startsWith('SHIP') ? 'SHP' : 'INV';
  const id = `${prefix}-${randomBetween(1000, 9999)}`;
  return {
    id: uid(),
    type,
    description: EVENT_TEMPLATES[type](id),
    timestamp: new Date(),
  };
}

export const INITIAL_ACTIVITY: ActivityEvent[] = [
  { id: uid(), type: 'PAYMENT_RELEASED',   description: 'Payment sent automatically for INV-3847',               timestamp: makeTimestamp(1) },
  { id: uid(), type: 'QC_PASSED',          description: 'Batch BATCH-0094 passed quality check — scored 97/100',  timestamp: makeTimestamp(2) },
  { id: uid(), type: 'SHIPMENT_SEALED',    description: 'Shipment SHP-2281 recorded — Surabaya to Jakarta',       timestamp: makeTimestamp(4) },
  { id: uid(), type: 'INVOICE_TRIGGERED',  description: 'Invoice INV-3848 checked — quality and delivery matched', timestamp: makeTimestamp(6) },
  { id: uid(), type: 'QC_PASSED',          description: 'Batch BATCH-0095 passed quality check — scored 92/100',  timestamp: makeTimestamp(8) },
  { id: uid(), type: 'SHIPMENT_SEALED',    description: 'Shipment SHP-2282 recorded — Bandung to Makassar',       timestamp: makeTimestamp(11) },
  { id: uid(), type: 'QC_FAILED',          description: 'Batch BATCH-0096 failed quality check — scored 63/100',  timestamp: makeTimestamp(14) },
  { id: uid(), type: 'PAYMENT_RELEASED',   description: 'Payment sent automatically for INV-3845',               timestamp: makeTimestamp(18) },
  { id: uid(), type: 'SHIPMENT_SEALED',    description: 'Shipment SHP-2283 recorded — Medan to Semarang',         timestamp: makeTimestamp(22) },
  { id: uid(), type: 'QC_PASSED',          description: 'Batch BATCH-0093 passed quality check — scored 95/100',  timestamp: makeTimestamp(27) },
  { id: uid(), type: 'INVOICE_TRIGGERED',  description: 'Invoice INV-3846 checked — quality and delivery matched', timestamp: makeTimestamp(31) },
  { id: uid(), type: 'SHIPMENT_SEALED',    description: 'Shipment SHP-2280 recorded — Jakarta to Balikpapan',     timestamp: makeTimestamp(38) },
];

// ─── Hourly chart data ────────────────────────────────────

export function generateHourlyData(): HourlyEvent[] {
  const now = new Date();
  return Array.from({ length: 12 }, (_, i) => {
    const h = new Date(now.getTime() - (11 - i) * 60 * 60 * 1000);
    const label = h.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Jakarta' });
    return { hour: label, events: randomBetween(18, 64) };
  });
}

// ─── Shipments ────────────────────────────────────────────

export const SHIPMENTS: ShipmentRecord[] = [
  { id: 'SHP-2281', origin: 'Surabaya',  destination: 'Jakarta',     status: 'Flagged',    timestamp: makeTimestamp(14), hash: generateVTXHash() },
  { id: 'SHP-2282', origin: 'Bandung',   destination: 'Makassar',    status: 'In Transit', timestamp: makeTimestamp(22), hash: generateVTXHash() },
  { id: 'SHP-2283', origin: 'Medan',     destination: 'Semarang',    status: 'In Transit', timestamp: makeTimestamp(38), hash: generateVTXHash() },
  { id: 'SHP-2280', origin: 'Jakarta',   destination: 'Balikpapan',  status: 'Delivered',  timestamp: makeTimestamp(72), hash: generateVTXHash() },
  { id: 'SHP-2279', origin: 'Semarang',  destination: 'Palembang',   status: 'Delivered',  timestamp: makeTimestamp(90), hash: generateVTXHash() },
  { id: 'SHP-2278', origin: 'Makassar',  destination: 'Batam',       status: 'Delivered',  timestamp: makeTimestamp(110), hash: generateVTXHash() },
  { id: 'SHP-2277', origin: 'Balikpapan', destination: 'Surabaya',   status: 'In Transit', timestamp: makeTimestamp(135), hash: generateVTXHash() },
  { id: 'SHP-2276', origin: 'Palembang', destination: 'Jakarta',     status: 'Delivered',  timestamp: makeTimestamp(160), hash: generateVTXHash() },
  { id: 'SHP-2275', origin: 'Pekanbaru', destination: 'Bandung',     status: 'Pending',    timestamp: makeTimestamp(180), hash: generateVTXHash() },
  { id: 'SHP-2274', origin: 'Batam',     destination: 'Makassar',    status: 'In Transit', timestamp: makeTimestamp(200), hash: generateVTXHash() },
];

// ─── QC Batches ───────────────────────────────────────────

export const QC_BATCHES: QCBatch[] = [
  { id: 'BATCH-0094', productLine: PRODUCT_LINES[0], score: 97, status: 'Passed',  timestamp: makeTimestamp(2),   hash: generateVTXHash() },
  { id: 'BATCH-0095', productLine: PRODUCT_LINES[1], score: 92, status: 'Passed',  timestamp: makeTimestamp(8),   hash: generateVTXHash() },
  { id: 'BATCH-0096', productLine: PRODUCT_LINES[2], score: 63, status: 'Failed',  timestamp: makeTimestamp(14),  hash: generateVTXHash() },
  { id: 'BATCH-0093', productLine: PRODUCT_LINES[3], score: 95, status: 'Passed',  timestamp: makeTimestamp(27),  hash: generateVTXHash() },
  { id: 'BATCH-0092', productLine: PRODUCT_LINES[4], score: 88, status: 'Passed',  timestamp: makeTimestamp(45),  hash: generateVTXHash() },
  { id: 'BATCH-0091', productLine: PRODUCT_LINES[5], score: 74, status: 'Passed',  timestamp: makeTimestamp(58),  hash: generateVTXHash() },
  { id: 'BATCH-0090', productLine: PRODUCT_LINES[6], score: 58, status: 'Failed',  timestamp: makeTimestamp(70),  hash: generateVTXHash() },
  { id: 'BATCH-0089', productLine: PRODUCT_LINES[7], score: 99, status: 'Passed',  timestamp: makeTimestamp(82),  hash: generateVTXHash() },
  { id: 'BATCH-0088', productLine: PRODUCT_LINES[0], score: 91, status: 'Passed',  timestamp: makeTimestamp(94),  hash: generateVTXHash() },
  { id: 'BATCH-0087', productLine: PRODUCT_LINES[1], score: 45, status: 'Failed',  timestamp: makeTimestamp(108), hash: generateVTXHash() },
  { id: 'BATCH-0086', productLine: PRODUCT_LINES[2], score: 96, status: 'Passed',  timestamp: makeTimestamp(122), hash: generateVTXHash() },
  { id: 'BATCH-0085', productLine: PRODUCT_LINES[3], score: 83, status: 'Passed',  timestamp: makeTimestamp(135), hash: generateVTXHash() },
  { id: 'BATCH-0084', productLine: PRODUCT_LINES[4], score: 79, status: 'Passed',  timestamp: makeTimestamp(148), hash: generateVTXHash() },
  { id: 'BATCH-0083', productLine: PRODUCT_LINES[5], score: 93, status: 'Passed',  timestamp: makeTimestamp(160), hash: generateVTXHash() },
  { id: 'BATCH-0082', productLine: PRODUCT_LINES[6], score: 67, status: 'Passed',  timestamp: makeTimestamp(172), hash: generateVTXHash() },
];

export function generateQCBatchScores(): number[] {
  return QC_BATCHES.slice(0, 20).map(b => b.score);
}

// ─── Invoices ─────────────────────────────────────────────

export const INVOICES: InvoiceRecord[] = [
  { id: 'INV-3847', vendor: VENDORS[0], amount: 187_500_000, status: 'Released', triggeredAt: makeTimestamp(1),   hash: generateVTXHash() },
  { id: 'INV-3848', vendor: VENDORS[1], amount: 94_200_000,  status: 'Verified', triggeredAt: makeTimestamp(6),   hash: generateVTXHash() },
  { id: 'INV-3846', vendor: VENDORS[2], amount: 340_000_000, status: 'Released', triggeredAt: makeTimestamp(31),  hash: generateVTXHash() },
  { id: 'INV-3845', vendor: VENDORS[3], amount: 56_800_000,  status: 'Released', triggeredAt: makeTimestamp(72),  hash: generateVTXHash() },
  { id: 'INV-3844', vendor: VENDORS[4], amount: 210_000_000, status: 'Pending',  triggeredAt: null,               hash: generateVTXHash() },
  { id: 'INV-3843', vendor: VENDORS[5], amount: 128_600_000, status: 'Released', triggeredAt: makeTimestamp(130), hash: generateVTXHash() },
  { id: 'INV-3842', vendor: VENDORS[6], amount: 75_400_000,  status: 'Failed',   triggeredAt: makeTimestamp(155), hash: generateVTXHash() },
  { id: 'INV-3841', vendor: VENDORS[7], amount: 462_000_000, status: 'Released', triggeredAt: makeTimestamp(180), hash: generateVTXHash() },
  { id: 'INV-3840', vendor: VENDORS[8], amount: 33_900_000,  status: 'Pending',  triggeredAt: null,               hash: generateVTXHash() },
  { id: 'INV-3839', vendor: VENDORS[9], amount: 289_500_000, status: 'Verified', triggeredAt: makeTimestamp(210), hash: generateVTXHash() },
];

// ─── Contract log ─────────────────────────────────────────

export const CONTRACT_LOG: ContractLogEntry[] = [
  { id: uid(), event: 'Payment sent to PT Baja Nusantara — Rp 187,5 million',       timestamp: makeTimestamp(1),  hash: generateVTXHash() },
  { id: uid(), event: 'Invoice verified — waiting for delivery confirmation',       timestamp: makeTimestamp(6),  hash: generateVTXHash() },
  { id: uid(), event: 'Payment sent to PT Sumber Makmur — Rp 340 million',          timestamp: makeTimestamp(31), hash: generateVTXHash() },
  { id: uid(), event: 'Payment sent to UD Karya Mandiri — Rp 56,8 million',         timestamp: makeTimestamp(72), hash: generateVTXHash() },
  { id: uid(), event: 'Payment held — quality did not match the order',             timestamp: makeTimestamp(155), hash: generateVTXHash() },
];

// ─── Blockchain record (modal) ────────────────────────────

export function generateBlockchainRecord(id: string, eventType: string): BlockchainRecord {
  return {
    hash: generateBlockHash(),
    blockNumber: generateBlockNumber(),
    timestamp: new Date(),
    event: eventType,
    data: {
      ref_id: id,
      network: 'Solana Mainnet',
      program_id: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
      slot: generateBlockNumber(),
      lamports: randomBetween(5000, 15000),
      status: 'finalized',
    },
  };
}
