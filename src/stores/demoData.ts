export interface CartItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  category: string;
  taxRate: number;
  taxLabel: string;
  convenienceFee?: number;
  discountAmount?: number;
  discountLabel?: string;
  sourceSystem?: string;
  accountRef?: string;
}

export interface Payment {
  method: 'credit' | 'cash' | 'cheque';
  amount: number;
  reference?: string;
  last4?: string;
}

export interface Transaction {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  totalTax: number;
  totalConvenienceFee: number;
  total: number;
  payments: Payment[];
  status: 'completed' | 'partial_refund' | 'refunded';
  refunds?: { itemId: string; amount: number; reason: string; refundId: string; date: string }[];
  receiptNumber: string;
}

export const CASHIER = {
  name: 'Maria Lopez',
  role: 'Cashier',
  location: 'Kingston Service Counter',
  initials: 'ML',
};

export const CUSTOMER = {
  name: 'David Chen',
  email: 'david.chen@email.com',
};

export interface LookupResult {
  name: string;
  ref: string;
  amount: number;
  detail: string;
  source: string;
  category: string;
}

export const LOOKUP_RESULTS: Record<string, LookupResult[]> = {
  'Property Tax': [
    { name: 'Property Tax — 125 Princess St', ref: 'Account #448291', amount: 900.00, detail: 'Property Owner: David Chen — 125 Princess St, Kingston ON\nOutstanding Balance: $900.00 — Due: Mar 31, 2026', source: 'Municipal Tax System', category: 'Property Tax' },
  ],
  'Transit Pass': [
    { name: 'Monthly Transit Pass Renewal', ref: 'TRANSIT123', amount: 45.00, detail: 'Pass Holder: David Chen — Adult Monthly Pass\nRenewal Fee: $45.00 — Next Billing: Feb 2026', source: 'Kingston Transit', category: 'Transit' },
  ],
  'D365 Invoices': [
    { name: 'Parks & Recreation Program', ref: 'INV-10092', amount: 120.00, detail: 'Account Holder: David Chen\nBalance Due: $120.00 — Due: Feb 15, 2026', source: 'Dynamics 365', category: 'D365 Invoices' },
  ],
  'Parking Tickets': [
    { name: 'Parking Ticket #83921', ref: 'Ticket #83921', amount: 75.00, detail: 'Violation: No Parking Zone — Princess St & Division St\nDate: Jan 10, 2026 — Status: Outstanding', source: 'Parking Enforcement', category: 'Parking' },
  ],
  'Permits': [
    { name: 'Building Permit Fee', ref: 'PER-2026-18', amount: 110.00, detail: 'Residential Renovation Permit — 125 Queen St\nApplicant: David Chen', source: 'Permits & Licensing', category: 'Permits' },
    { name: 'Business License Renewal', ref: 'PER-2026-42', amount: 85.00, detail: 'Annual Business License — Downtown BIA', source: 'Permits & Licensing', category: 'Permits' },
  ],
};

// Smart search: maps known demo inputs to the correct lookup category and result index
export interface SearchMatch {
  category: string;
  resultIndex: number;
}

const SEARCH_ALIASES: Record<string, SearchMatch> = {
  // Parking ticket inputs
  'abc 123': { category: 'Parking Tickets', resultIndex: 0 },
  'abc123': { category: 'Parking Tickets', resultIndex: 0 },
  '83921': { category: 'Parking Tickets', resultIndex: 0 },
  'parking': { category: 'Parking Tickets', resultIndex: 0 },
  'parking ticket': { category: 'Parking Tickets', resultIndex: 0 },
  'princess': { category: 'Parking Tickets', resultIndex: 0 },
  'division': { category: 'Parking Tickets', resultIndex: 0 },
  'no parking': { category: 'Parking Tickets', resultIndex: 0 },
  // Property tax inputs
  '448291': { category: 'Property Tax', resultIndex: 0 },
  '448-291': { category: 'Property Tax', resultIndex: 0 },
  'chen': { category: 'Property Tax', resultIndex: 0 },
  'david chen': { category: 'Property Tax', resultIndex: 0 },
  'david': { category: 'Property Tax', resultIndex: 0 },
  'property tax': { category: 'Property Tax', resultIndex: 0 },
  '125 princess': { category: 'Property Tax', resultIndex: 0 },
  'princess st': { category: 'Property Tax', resultIndex: 0 },
  // Transit pass inputs
  'transit123': { category: 'Transit Pass', resultIndex: 0 },
  'transit': { category: 'Transit Pass', resultIndex: 0 },
  'transit pass': { category: 'Transit Pass', resultIndex: 0 },
  'monthly pass': { category: 'Transit Pass', resultIndex: 0 },
  'bus pass': { category: 'Transit Pass', resultIndex: 0 },
  // D365 invoice inputs
  'inv-10092': { category: 'D365 Invoices', resultIndex: 0 },
  '10092': { category: 'D365 Invoices', resultIndex: 0 },
  'parks': { category: 'D365 Invoices', resultIndex: 0 },
  'recreation': { category: 'D365 Invoices', resultIndex: 0 },
  'parks & recreation': { category: 'D365 Invoices', resultIndex: 0 },
  'invoice': { category: 'D365 Invoices', resultIndex: 0 },
  // Permits
  'per-2026-18': { category: 'Permits', resultIndex: 0 },
  'per-2026-42': { category: 'Permits', resultIndex: 1 },
  'permit': { category: 'Permits', resultIndex: 0 },
  'building permit': { category: 'Permits', resultIndex: 0 },
  'business license': { category: 'Permits', resultIndex: 1 },
};

export function findSearchMatch(query: string): SearchMatch | null {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return null;

  // Exact match first
  if (SEARCH_ALIASES[normalized]) return SEARCH_ALIASES[normalized];

  // Partial match — check if input is contained in any alias key or vice versa
  for (const [key, match] of Object.entries(SEARCH_ALIASES)) {
    if (key.includes(normalized) || normalized.includes(key)) {
      return match;
    }
  }

  // Fallback: search through all results for any matching text
  for (const [category, results] of Object.entries(LOOKUP_RESULTS)) {
    for (let i = 0; i < results.length; i++) {
      const r = results[i];
      const searchable = `${r.name} ${r.ref} ${r.detail} ${r.source}`.toLowerCase();
      if (searchable.includes(normalized)) {
        return { category, resultIndex: i };
      }
    }
  }

  return null;
}

export const STATIC_PRODUCTS = [
  { id: 'bag-tag', name: 'Garbage Bag Tag', price: 4.00, category: 'Products', taxRate: 0.13, taxLabel: 'HST 13%' },
  { id: 'blue-box', name: 'Blue Box', price: 8.00, category: 'Products', taxRate: 0.13, taxLabel: 'HST 13%' },
  { id: 'green-bin', name: 'Green Bin', price: 12.00, category: 'Products', taxRate: 0.13, taxLabel: 'HST 13%' },
  { id: 'dog-tag', name: 'Dog Tag', price: 25.00, category: 'Products', taxRate: 0, taxLabel: 'Exempt' },
  { id: 'coffee', name: 'Coffee', price: 3.50, category: 'Prepared Food', taxRate: 0.05, taxLabel: 'GST 5%' },
  { id: 'sandwich', name: 'Sandwich', price: 6.00, category: 'Prepared Food', taxRate: 0.13, taxLabel: 'HST 13%' },
];

// Only waste management products appear in the quick-add grid (no prepared food)
export const GRID_PRODUCTS = STATIC_PRODUCTS.filter(p => p.category === 'Products');

export const TILE_CATEGORIES = [
  { id: 'products', label: 'Products', icon: 'ShoppingBag', color: '#3b82f6' },
  { id: 'parking', label: 'Parking Tickets', icon: 'Car', color: '#3b82f6' },
  { id: 'utilities', label: 'Utilities', icon: 'Building', color: '#3b82f6' },
  { id: 'permits', label: 'Permits', icon: 'FileText', color: '#3b82f6' },
  { id: 'lookup', label: 'Lookup Bill', icon: 'Search', color: '#3b82f6' },
  { id: 'add-tile', label: 'Add Tile', icon: 'Plus', color: '#64748b' },
];

export const AVAILABLE_TILES = [
  { id: 'property-tax', label: 'Property Tax', icon: 'Building', color: '#3b82f6', description: 'Municipal property tax payments' },
  { id: 'transit', label: 'Transit Pass', icon: 'Bus', color: '#3b82f6', description: 'Kingston Transit pass renewals' },
  { id: 'prepared-food', label: 'Prepared Food', icon: 'Coffee', color: '#3b82f6', description: 'Cafeteria and prepared food items' },
];

export const CONVENIENCE_FEE_RATE = 0.02;
export const CONVENIENCE_FEE_CATEGORIES = ['Property Tax'];

export function calculateItemTax(item: CartItem): number {
  return item.price * item.quantity * item.taxRate;
}

export function calculateConvenienceFee(item: CartItem): number {
  if (CONVENIENCE_FEE_CATEGORIES.includes(item.category)) {
    return item.price * item.quantity * CONVENIENCE_FEE_RATE;
  }
  return 0;
}

export const DEMO_REPORTS = {
  itemSales: [
    { item: 'Property Tax Payments', qty: 38, revenue: 34200.00, gl: '10-1100-001' },
    { item: 'Parking Ticket Payments', qty: 51, revenue: 3825.00, gl: '44-5100-001' },
    { item: 'Transit Pass Renewals', qty: 67, revenue: 3015.00, gl: '42-3200-001' },
    { item: 'D365 Invoices', qty: 24, revenue: 4800.00, gl: '43-4100-001' },
    { item: 'Permits & Licensing', qty: 18, revenue: 1980.00, gl: '45-6100-001' },
    { item: 'Garbage Bag Tags', qty: 142, revenue: 568.00, gl: '41-2100-001' },
    { item: 'Prepared Food & Beverage', qty: 89, revenue: 412.50, gl: '46-7100-001' },
  ],
  glActivity: [
    { code: '10-1100-001', description: 'Property Tax Revenue', debits: 0, credits: 34200.00 },
    { code: '44-5100-001', description: 'Parking Revenue', debits: 0, credits: 3825.00 },
    { code: '42-3200-001', description: 'Transit Revenue', debits: 0, credits: 3015.00 },
    { code: '43-4100-001', description: 'D365 Invoice Revenue', debits: 0, credits: 4800.00 },
    { code: '45-6100-001', description: 'Permits & Licensing Revenue', debits: 0, credits: 1980.00 },
    { code: '41-2100-001', description: 'Waste Management Revenue', debits: 0, credits: 568.00 },
    { code: '46-7100-001', description: 'Prepared Food Revenue', debits: 0, credits: 412.50 },
    { code: '10-9900-001', description: 'Convenience Fee Revenue', debits: 0, credits: 684.00 },
  ],
  userActivity: [
    { user: 'Maria Lopez', transactions: 47, total: 12840.00, refunds: 2, voids: 0 },
    { user: 'James Wilson', transactions: 38, total: 9620.00, refunds: 1, voids: 1 },
    { user: 'Sarah Kim', transactions: 52, total: 15200.00, refunds: 3, voids: 0 },
  ],
};

export const END_OF_DAY = {
  totalCash: 450.00,
  totalCredit: 1780.00,
  totalCheque: 120.00,
  totalRefunds: 45.00,
  totalConvenienceFees: 684.00,
  transactionCount: 137,
  expectedTotal: 2305.00,
  actualTotal: 2305.00,
};
