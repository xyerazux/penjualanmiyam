export type UserRole = 'owner' | 'employee';

export interface UserAccount {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  roleLabel: string;
  position: string;
  phone: string;
  shift: string;
  canRecordExpense: boolean;
  avatarInitial: string;
}

export type TransactionType = 'Pemasukan' | 'Pengeluaran';

export interface FinanceTransaction {
  id: string;
  title: string;
  category: string;
  type: TransactionType;
  amount: number;
  displayQuantity: string;
  status: 'Normal' | 'Menipis' | 'Selesai' | 'Tercatat';
  date: string;
  updatedAt: string;
  notes: string;
  recordedBy: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Bahan baku' | 'Sayuran' | 'Bumbu' | 'Operasional' | 'Minuman' | string;
  quantity: number;
  unit: string;
  minStock: number;
  status: 'Normal' | 'Menipis';
  updatedAt: string;
  date: string;
  notes: string;
}

export interface PurchaseItem {
  id: string;
  itemName: string;
  category: string;
  supplier: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  status: 'Normal' | 'Menipis' | 'Selesai' | 'Diproses';
  date: string;
  updatedAt: string;
  notes: string;
  inventoryItemId?: string;
}

export interface SalesRecord {
  id: string;
  itemName: string;
  category: string;
  portions: number;
  unitPrice: number;
  totalPrice: number;
  paymentMethod: 'Tunai' | 'QRIS' | 'Transfer';
  status: 'Normal' | 'Selesai';
  date: string;
  time: string;
  updatedAt: string;
  notes: string;
  recordedBy: string;
}

export interface EmployeeItem {
  id: string;
  name: string;
  role: UserRole;
  position: string;
  phone: string;
  email: string;
  shift: string;
  status: 'Normal' | 'Aktif' | 'Nonaktif' | 'Menipis';
  joinDate: string;
  updatedAt: string;
  canRecordExpense: boolean;
  notes: string;
}

export interface ActivityLog {
  id: string;
  title: string;
  category: string;
  detail: string;
  status: 'Normal' | 'Menipis' | 'Selesai';
  time: string;
  updatedAt: string;
  actor: string;
  actorRole: string;
}

export interface DailyReportRow {
  id: string;
  date: string;
  sales: number;
  expenses: number;
  profit: number;
  portionsSold: number;
}

export interface StockUsageRecord {
  id: string;
  inventoryId: string;
  itemName: string;
  category: string;
  amountUsed: number;
  unit: string;
  date: string;
  updatedAt: string;
  usedBy: string;
  notes: string;
}

export interface StockRequestRecord {
  id: string;
  itemName: string;
  category: string;
  requestedQty: number;
  unit: string;
  urgency: 'Normal' | 'Menipis';
  status: 'Menunggu' | 'Disetujui' | 'Selesai';
  date: string;
  updatedAt: string;
  requestedBy: string;
  notes: string;
}

export interface StoreSettings {
  storeName: string;
  address: string;
  phone: string;
  operationalHours: string;
  lowStockNotification: boolean;
  dailyReportReminder: boolean;
  allowEmployeeExpense: boolean;
}
