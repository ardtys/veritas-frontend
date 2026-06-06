'use client';

/**
 * Dashboard data store.
 *
 * A single client-side source of truth for the whole operable dashboard:
 * shipments, QC batches, invoices, the live activity feed, the contract log
 * and operator settings. Every action ripples across pages (KPIs, sidebar
 * badges, feeds) and is persisted to localStorage, so the system behaves like
 * something you can actually run — reload the page and your changes are still
 * there. A light "live" ticker keeps the feed moving like a real plant floor.
 */

import {
  createContext, useContext, useEffect, useReducer, useState, useCallback, useMemo,
} from 'react';
import {
  SHIPMENTS, QC_BATCHES, INVOICES, INITIAL_ACTIVITY, CONTRACT_LOG,
  generateActivityEvent,
  type ShipmentRecord, type QCBatch, type InvoiceRecord,
  type ActivityEvent, type ContractLogEntry, type EventType,
} from '@/lib/mockData';
import { generateVTXHash, randomBetween, formatIDRCompact } from '@/lib/utils';

const STORAGE_KEY = 'veritas-dashboard-v1';
const ACTIVITY_CAP = 60;

export type ShipmentStatus = ShipmentRecord['status'];
export type InvoiceStatus = InvoiceRecord['status'];

export interface Settings {
  companyName: string;
  companyAddress: string;
  operatorName: string;
  operatorRole: string;
  operatorEmail: string;
  qcThreshold: number;   // score at/above which a batch passes
  autoRelease: boolean;  // pay invoices automatically once verified
  liveFeed: boolean;     // keep the activity feed ticking
}

interface Counters { sealed: number; qcToday: number; invoicesToday: number; }

interface State {
  shipments: ShipmentRecord[];
  qcBatches: QCBatch[];
  invoices: InvoiceRecord[];
  activity: ActivityEvent[];
  contractLog: ContractLogEntry[];
  counters: Counters;
  settings: Settings;
}

export const DEFAULT_SETTINGS: Settings = {
  companyName: 'PT Demo Pabrik',
  companyAddress: 'Kawasan Industri SIER, Surabaya, Jawa Timur',
  operatorName: 'Daffa Arditya',
  operatorRole: 'Owner',
  operatorEmail: 'ardtys06@gmail.com',
  qcThreshold: 70,
  autoRelease: true,
  liveFeed: true,
};

// ─── helpers ──────────────────────────────────────────────

const PRODUCT_LINES = [
  'Baja Lembaran G-40', 'Komponen Otomotif K-12', 'Pelat Aluminium A3',
  'Kawat Las WL-200', 'Polymer PP-N50', 'Pipa Galvanis PG-8',
];

let _eid = 0;
const eid = () => `e-${Date.now().toString(36)}-${++_eid}`;

function evt(type: EventType, description: string): ActivityEvent {
  return { id: eid(), type, description, timestamp: new Date() };
}

/** Next sequential id, e.g. nextId(shipments,'SHP-',4) -> "SHP-2282". */
function nextId(items: { id: string }[], prefix: string, pad: number): string {
  const max = items.reduce((m, it) => {
    const n = parseInt(it.id.replace(/\D/g, ''), 10);
    return Number.isFinite(n) ? Math.max(m, n) : m;
  }, 0);
  return `${prefix}${String(max + 1).padStart(pad, '0')}`;
}

export function initials(name: string): string {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('') || 'VX';
}

function seed(): State {
  return {
    shipments: SHIPMENTS.map(s => ({ ...s })),
    qcBatches: QC_BATCHES.map(b => ({ ...b })),
    invoices: INVOICES.map(i => ({ ...i })),
    activity: INITIAL_ACTIVITY.map(a => ({ ...a })),
    contractLog: CONTRACT_LOG.map(c => ({ ...c })),
    counters: { sealed: 12_400, qcToday: 84, invoicesToday: 31 },
    settings: { ...DEFAULT_SETTINGS },
  };
}

const prepend = <T,>(item: T, list: T[], cap = Infinity): T[] => [item, ...list].slice(0, cap);

// ─── actions ──────────────────────────────────────────────

type Action =
  | { type: 'HYDRATE'; state: State }
  | { type: 'RESET' }
  | { type: 'ADD_SHIPMENT'; origin: string; destination: string; status: ShipmentStatus }
  | { type: 'UPDATE_SHIPMENT'; id: string; patch: Partial<ShipmentRecord> }
  | { type: 'DELETE_SHIPMENT'; id: string }
  | { type: 'ADVANCE_SHIPMENT'; id: string }
  | { type: 'RUN_QC'; productLine: string; score?: number }
  | { type: 'DELETE_BATCH'; id: string }
  | { type: 'ADD_INVOICE'; vendor: string; amount: number }
  | { type: 'VERIFY_INVOICE'; id: string }
  | { type: 'RELEASE_INVOICE'; id: string }
  | { type: 'FAIL_INVOICE'; id: string }
  | { type: 'RETRY_INVOICE'; id: string }
  | { type: 'UPDATE_SETTINGS'; patch: Partial<Settings> }
  | { type: 'TICK' };

const NEXT_SHIPMENT: Record<ShipmentStatus, ShipmentStatus> = {
  Pending: 'In Transit', 'In Transit': 'Delivered', Flagged: 'In Transit', Delivered: 'Delivered',
};

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'HYDRATE': return a.state;
    case 'RESET':   return seed();

    case 'ADD_SHIPMENT': {
      const ship: ShipmentRecord = {
        id: nextId(s.shipments, 'SHP-', 4),
        origin: a.origin, destination: a.destination, status: a.status,
        timestamp: new Date(), hash: generateVTXHash(),
      };
      return {
        ...s,
        shipments: [ship, ...s.shipments],
        activity: prepend(evt('SHIPMENT_SEALED', `Shipment ${ship.id} recorded — ${a.origin} to ${a.destination}`), s.activity, ACTIVITY_CAP),
        counters: { ...s.counters, sealed: s.counters.sealed + 1 },
      };
    }

    case 'UPDATE_SHIPMENT':
      return { ...s, shipments: s.shipments.map(r => r.id === a.id ? { ...r, ...a.patch, timestamp: new Date() } : r) };

    case 'DELETE_SHIPMENT':
      return { ...s, shipments: s.shipments.filter(r => r.id !== a.id) };

    case 'ADVANCE_SHIPMENT': {
      const cur = s.shipments.find(r => r.id === a.id);
      if (!cur) return s;
      const next = NEXT_SHIPMENT[cur.status];
      if (next === cur.status) return s;
      return {
        ...s,
        shipments: s.shipments.map(r => r.id === a.id ? { ...r, status: next, timestamp: new Date() } : r),
        activity: prepend(evt('SHIPMENT_SEALED', `Shipment ${a.id} updated — now ${next}`), s.activity, ACTIVITY_CAP),
        counters: { ...s.counters, sealed: s.counters.sealed + 1 },
      };
    }

    case 'RUN_QC': {
      const score = a.score ?? randomBetween(48, 99);
      const passed = score >= s.settings.qcThreshold;
      const batch: QCBatch = {
        id: nextId(s.qcBatches, 'BATCH-', 4),
        productLine: a.productLine, score,
        status: passed ? 'Passed' : 'Failed',
        timestamp: new Date(), hash: generateVTXHash(),
      };
      return {
        ...s,
        qcBatches: [batch, ...s.qcBatches],
        activity: prepend(
          evt(passed ? 'QC_PASSED' : 'QC_FAILED', `Batch ${batch.id} ${passed ? 'passed' : 'failed'} quality check — scored ${score}/100`),
          s.activity, ACTIVITY_CAP,
        ),
        counters: { ...s.counters, qcToday: s.counters.qcToday + 1, sealed: s.counters.sealed + 1 },
      };
    }

    case 'DELETE_BATCH':
      return { ...s, qcBatches: s.qcBatches.filter(b => b.id !== a.id) };

    case 'ADD_INVOICE': {
      const inv: InvoiceRecord = {
        id: nextId(s.invoices, 'INV-', 4),
        vendor: a.vendor, amount: a.amount, status: 'Pending', triggeredAt: null, hash: generateVTXHash(),
      };
      return {
        ...s,
        invoices: [inv, ...s.invoices],
        counters: { ...s.counters, invoicesToday: s.counters.invoicesToday + 1 },
      };
    }

    case 'VERIFY_INVOICE': {
      const inv = s.invoices.find(i => i.id === a.id);
      if (!inv) return s;
      return {
        ...s,
        invoices: s.invoices.map(i => i.id === a.id ? { ...i, status: 'Verified', triggeredAt: new Date() } : i),
        activity: prepend(evt('INVOICE_TRIGGERED', `Invoice ${a.id} checked — quality and delivery matched`), s.activity, ACTIVITY_CAP),
        contractLog: prepend({ id: eid(), event: `Invoice ${a.id} verified — waiting for delivery confirmation`, timestamp: new Date(), hash: generateVTXHash() }, s.contractLog, 40),
        counters: { ...s.counters, sealed: s.counters.sealed + 1 },
      };
    }

    case 'RELEASE_INVOICE': {
      const inv = s.invoices.find(i => i.id === a.id);
      if (!inv) return s;
      return {
        ...s,
        invoices: s.invoices.map(i => i.id === a.id ? { ...i, status: 'Released', triggeredAt: i.triggeredAt ?? new Date() } : i),
        activity: prepend(evt('PAYMENT_RELEASED', `Payment sent automatically for ${a.id}`), s.activity, ACTIVITY_CAP),
        contractLog: prepend({ id: eid(), event: `Payment sent to ${inv.vendor} — ${formatIDRCompact(inv.amount)}`, timestamp: new Date(), hash: generateVTXHash() }, s.contractLog, 40),
        counters: { ...s.counters, sealed: s.counters.sealed + 1 },
      };
    }

    case 'FAIL_INVOICE': {
      const inv = s.invoices.find(i => i.id === a.id);
      if (!inv) return s;
      return {
        ...s,
        invoices: s.invoices.map(i => i.id === a.id ? { ...i, status: 'Failed' } : i),
        contractLog: prepend({ id: eid(), event: `Payment held for ${a.id} — quality did not match the order`, timestamp: new Date(), hash: generateVTXHash() }, s.contractLog, 40),
      };
    }

    case 'RETRY_INVOICE':
      return { ...s, invoices: s.invoices.map(i => i.id === a.id ? { ...i, status: 'Pending', triggeredAt: null } : i) };

    case 'UPDATE_SETTINGS':
      return { ...s, settings: { ...s.settings, ...a.patch } };

    case 'TICK': {
      const e = generateActivityEvent();
      return {
        ...s,
        activity: prepend(e, s.activity, ACTIVITY_CAP),
        counters: {
          sealed: s.counters.sealed + randomBetween(1, 3),
          qcToday: s.counters.qcToday + (Math.random() > 0.7 ? 1 : 0),
          invoicesToday: s.counters.invoicesToday + (Math.random() > 0.82 ? 1 : 0),
        },
      };
    }

    default: return s;
  }
}

// ─── persistence (revive Date fields) ─────────────────────

function reviveDate<T extends object>(o: T, keys: string[]): T {
  const out = { ...o } as Record<string, unknown>;
  for (const k of keys) if (typeof out[k] === 'string') out[k] = new Date(out[k] as string);
  return out as T;
}

function load(): State | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as State;
    return {
      shipments: (p.shipments ?? []).map(x => reviveDate(x, ['timestamp'])),
      qcBatches: (p.qcBatches ?? []).map(x => reviveDate(x, ['timestamp'])),
      invoices: (p.invoices ?? []).map(x => reviveDate(x, ['triggeredAt'])),
      activity: (p.activity ?? []).map(x => reviveDate(x, ['timestamp'])),
      contractLog: (p.contractLog ?? []).map(x => reviveDate(x, ['timestamp'])),
      counters: p.counters ?? seed().counters,
      settings: { ...DEFAULT_SETTINGS, ...(p.settings ?? {}) },
    };
  } catch {
    return null;
  }
}

// ─── context ──────────────────────────────────────────────

export interface Toast { id: string; msg: string; tone: 'ok' | 'warn' | 'info'; }

interface Ctx extends State {
  hydrated: boolean;
  addShipment: (origin: string, destination: string, status: ShipmentStatus) => void;
  updateShipment: (id: string, patch: Partial<ShipmentRecord>) => void;
  deleteShipment: (id: string) => void;
  advanceShipment: (id: string) => void;
  runQC: (productLine: string, score?: number) => void;
  deleteBatch: (id: string) => void;
  addInvoice: (vendor: string, amount: number) => void;
  verifyInvoice: (id: string) => void;
  releaseInvoice: (id: string) => void;
  failInvoice: (id: string) => void;
  retryInvoice: (id: string) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  resetAll: () => void;
  notify: (msg: string, tone?: Toast['tone']) => void;
  toasts: Toast[];
}

const DashboardContext = createContext<Ctx | null>(null);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, seed);
  const [hydrated, setHydrated] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const liveFeed = state.settings.liveFeed;

  // Hydrate from localStorage once, on the client.
  useEffect(() => {
    const saved = load();
    if (saved) dispatch({ type: 'HYDRATE', state: saved });
    setHydrated(true);
  }, []);

  // Persist after hydration.
  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* quota / private mode */ }
  }, [state, hydrated]);

  // Live ticker.
  useEffect(() => {
    if (!hydrated || !liveFeed) return;
    let timer: ReturnType<typeof setTimeout>;
    const loop = () => { timer = setTimeout(() => { dispatch({ type: 'TICK' }); loop(); }, randomBetween(5000, 8500)); };
    loop();
    return () => clearTimeout(timer);
  }, [hydrated, liveFeed]);

  const notify = useCallback((msg: string, tone: Toast['tone'] = 'ok') => {
    const id = eid();
    setToasts(t => [...t, { id, msg, tone }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2800);
  }, []);

  const value: Ctx = useMemo(() => ({
    ...state,
    hydrated,
    toasts,
    notify,
    addShipment: (origin, destination, status) => dispatch({ type: 'ADD_SHIPMENT', origin, destination, status }),
    updateShipment: (id, patch) => dispatch({ type: 'UPDATE_SHIPMENT', id, patch }),
    deleteShipment: (id) => dispatch({ type: 'DELETE_SHIPMENT', id }),
    advanceShipment: (id) => dispatch({ type: 'ADVANCE_SHIPMENT', id }),
    runQC: (productLine, score) => dispatch({ type: 'RUN_QC', productLine, score }),
    deleteBatch: (id) => dispatch({ type: 'DELETE_BATCH', id }),
    addInvoice: (vendor, amount) => dispatch({ type: 'ADD_INVOICE', vendor, amount }),
    verifyInvoice: (id) => dispatch({ type: 'VERIFY_INVOICE', id }),
    releaseInvoice: (id) => dispatch({ type: 'RELEASE_INVOICE', id }),
    failInvoice: (id) => dispatch({ type: 'FAIL_INVOICE', id }),
    retryInvoice: (id) => dispatch({ type: 'RETRY_INVOICE', id }),
    updateSettings: (patch) => dispatch({ type: 'UPDATE_SETTINGS', patch }),
    resetAll: () => dispatch({ type: 'RESET' }),
  }), [state, hydrated, toasts, notify]);

  return (
    <DashboardContext.Provider value={value}>
      {hydrated ? children : <BootLoader />}
      <ToastStack toasts={toasts} />
    </DashboardContext.Provider>
  );
}

export function useDashboard(): Ctx {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used inside <DashboardProvider>');
  return ctx;
}

export { PRODUCT_LINES };

// ─── UI bits owned by the store ───────────────────────────

function BootLoader() {
  return (
    <div className="theme-dark" style={{ minHeight: '100vh', background: '#0C0E0D', display: 'grid', placeItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <span style={{ width: 26, height: 26, borderRadius: '50%', border: '2px solid rgba(76,195,138,0.25)', borderTopColor: '#4CC38A', animation: 'spin 0.8s linear infinite' }} />
        <span className="font-mono-custom" style={{ fontSize: 12, color: '#6B6E68' }}>Loading workspace…</span>
      </div>
    </div>
  );
}

function ToastStack({ toasts }: { toasts: Toast[] }) {
  const color = { ok: '#4CC38A', warn: '#C9853A', info: '#6B7C8B' };
  return (
    <div className="toast-stack" style={{ position: 'fixed', right: 18, bottom: 18, zIndex: 200, display: 'flex', flexDirection: 'column', gap: 8, pointerEvents: 'none' }}>
      {toasts.map(t => (
        <div key={t.id} className="veritas-toast"
          style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#191D18', border: '1px solid rgba(255,255,255,0.1)', borderLeft: `3px solid ${color[t.tone]}`, borderRadius: 8, padding: '11px 16px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)', maxWidth: 340 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: color[t.tone], flexShrink: 0 }} />
          <span style={{ fontSize: 13, color: '#E4E1D8' }}>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}
