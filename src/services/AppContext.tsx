import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  UserAccount,
  UserRole,
  FinanceTransaction,
  InventoryItem,
  PurchaseItem,
  SalesRecord,
  EmployeeItem,
  ActivityLog,
  DailyReportRow,
  StoreSettings,
  StockUsageRecord,
  StockRequestRecord,
} from '../types';
import {
  REGISTERED_USERS,
  INITIAL_INVENTORY,
  INITIAL_FINANCE,
  INITIAL_PURCHASES,
  INITIAL_SALES,
  INITIAL_EMPLOYEES,
  INITIAL_ACTIVITIES,
  INITIAL_REPORTS,
  INITIAL_SETTINGS,
  INITIAL_STOCK_USAGES,
  INITIAL_STOCK_REQUESTS,
} from '../data/mockData';
import { formatRupiah, formatNumber, getCurrentTimeStr, getTodayLabel } from '../utils/formatters';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'error';
}

export interface LoginResult {
  success: boolean;
  role?: UserRole;
  message?: string;
}

interface AppContextType {
  user: UserAccount | null;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => LoginResult;
  logout: () => void;

  // Global search
  globalSearch: string;
  setGlobalSearch: (q: string) => void;

  // Data collections
  inventory: InventoryItem[];
  finance: FinanceTransaction[];
  purchases: PurchaseItem[];
  sales: SalesRecord[];
  employees: EmployeeItem[];
  activities: ActivityLog[];
  reports: DailyReportRow[];
  stockUsages: StockUsageRecord[];
  stockRequests: StockRequestRecord[];
  settings: StoreSettings;

  // Computed metrics
  metrics: {
    todaySales: number;
    todayExpenses: number;
    todayProfit: number;
    todayPortions: number;
    lowStockCount: number;
    lowStockItems: InventoryItem[];
  };

  // Actions — Finance
  addFinance: (data: Omit<FinanceTransaction, 'id' | 'updatedAt' | 'displayQuantity' | 'recordedBy'>) => void;
  updateFinance: (id: string, data: Partial<FinanceTransaction>) => void;
  deleteFinance: (id: string) => void;

  // Actions — Inventory
  addInventory: (data: Omit<InventoryItem, 'id' | 'updatedAt' | 'status'>) => void;
  updateInventory: (id: string, data: Partial<InventoryItem>) => void;
  adjustStock: (id: string, delta: number) => void;
  deleteInventory: (id: string) => void;

  // Actions — Purchases
  addPurchase: (data: Omit<PurchaseItem, 'id' | 'updatedAt'>) => void;
  updatePurchase: (id: string, data: Partial<PurchaseItem>) => void;
  deletePurchase: (id: string) => void;

  // Actions — Sales
  addSale: (data: Omit<SalesRecord, 'id' | 'updatedAt' | 'recordedBy' | 'time'> & { time?: string }) => void;
  updateSale: (id: string, data: Partial<SalesRecord>) => void;
  deleteSale: (id: string) => void;

  // Actions — Employees
  addEmployee: (data: Omit<EmployeeItem, 'id' | 'updatedAt'>) => void;
  updateEmployee: (id: string, data: Partial<EmployeeItem>) => void;
  toggleEmployeeStatus: (id: string) => void;
  deleteEmployee: (id: string) => void;

  // Actions — Stock Usage & Requests (Employee operations)
  addStockUsage: (data: Omit<StockUsageRecord, 'id' | 'updatedAt' | 'usedBy'>) => void;
  addStockRequest: (data: Omit<StockRequestRecord, 'id' | 'updatedAt' | 'requestedBy' | 'status'>) => void;
  updateStockRequestStatus: (id: string, status: StockRequestRecord['status']) => void;

  // Actions — Activities & Settings
  addActivity: (title: string, category: string, detail: string, status?: ActivityLog['status']) => void;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;

  // Toast feedback
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;
}

const DATA_STORAGE_KEY = 'monitoring_penjualan_data_v2';
const SESSION_STORAGE_KEY = 'monitoring_penjualan_session_v2';

const AppContext = createContext<AppContextType | undefined>(undefined);

function loadDataFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(DATA_STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed[key] !== undefined ? parsed[key] : fallback;
  } catch {
    return fallback;
  }
}

function loadSessionFromStorage(): UserAccount | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UserAccount;
    if (!parsed || !parsed.id || !parsed.username || (parsed.role !== 'owner' && parsed.role !== 'employee')) {
      return null;
    }
    // Verify against registered users if matching ID exists so role cannot be tampered with
    const registered = REGISTERED_USERS.find((u) => u.id === parsed.id);
    if (registered) {
      return registered;
    }
    return parsed;
  } catch {
    return null;
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAccount | null>(() => loadSessionFromStorage());
  const [inventory, setInventory] = useState<InventoryItem[]>(() =>
    loadDataFromStorage('inventory', INITIAL_INVENTORY)
  );
  const [finance, setFinance] = useState<FinanceTransaction[]>(() =>
    loadDataFromStorage('finance', INITIAL_FINANCE)
  );
  const [purchases, setPurchases] = useState<PurchaseItem[]>(() =>
    loadDataFromStorage('purchases', INITIAL_PURCHASES)
  );
  const [sales, setSales] = useState<SalesRecord[]>(() =>
    loadDataFromStorage('sales', INITIAL_SALES)
  );
  const [employees, setEmployees] = useState<EmployeeItem[]>(() =>
    loadDataFromStorage('employees', INITIAL_EMPLOYEES)
  );
  const [activities, setActivities] = useState<ActivityLog[]>(() =>
    loadDataFromStorage('activities', INITIAL_ACTIVITIES)
  );
  const [reports, setReports] = useState<DailyReportRow[]>(() =>
    loadDataFromStorage('reports', INITIAL_REPORTS)
  );
  const [stockUsages, setStockUsages] = useState<StockUsageRecord[]>(() =>
    loadDataFromStorage('stockUsages', INITIAL_STOCK_USAGES)
  );
  const [stockRequests, setStockRequests] = useState<StockRequestRecord[]>(() =>
    loadDataFromStorage('stockRequests', INITIAL_STOCK_REQUESTS)
  );
  const [settings, setSettings] = useState<StoreSettings>(() =>
    loadDataFromStorage('settings', INITIAL_SETTINGS)
  );
  const [globalSearch, setGlobalSearch] = useState('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persist operational data
  useEffect(() => {
    try {
      const payload = {
        inventory,
        finance,
        purchases,
        sales,
        employees,
        activities,
        reports,
        stockUsages,
        stockRequests,
        settings,
      };
      localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage quota errors
    }
  }, [inventory, finance, purchases, sales, employees, activities, reports, stockUsages, stockRequests, settings]);

  // Persist user session separately
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch {
      // Ignore storage errors
    }
  }, [user]);

  const showToast = useCallback((message: string, type: ToastMessage['type'] = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addActivity = useCallback(
    (title: string, category: string, detail: string, status: ActivityLog['status'] = 'Normal') => {
      const time = getCurrentTimeStr();
      const actorName = user?.name || 'Sistem Operasional';
      const actorRoleLabel = user?.role === 'owner' ? 'Admin' : user?.position || 'Kasir';

      const newLog: ActivityLog = {
        id: `act-${Date.now()}`,
        title,
        category,
        detail,
        status,
        time,
        updatedAt: `Hari ini, ${time}`,
        actor: actorName,
        actorRole: actorRoleLabel,
      };
      setActivities((prev) => [newLog, ...prev]);
    },
    [user]
  );

  // Account-based authentication — Role is determined strictly by the matched account
  const login = useCallback(
    (identifier: string, password: string): LoginResult => {
      const cleanId = identifier.trim().toLowerCase();
      const cleanPass = password.trim();

      if (!cleanId || !cleanPass) {
        return {
          success: false,
          message: 'Mohon masukkan email/username dan kata sandi.',
        };
      }

      // 1. Check in REGISTERED_USERS
      const matchedRegistered = REGISTERED_USERS.find(
        (u) => u.username.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId
      );

      if (matchedRegistered) {
        if (matchedRegistered.password !== cleanPass) {
          return {
            success: false,
            message: 'Email/username atau kata sandi yang Anda masukkan salah.',
          };
        }

        // Check if this employee is marked inactive in employees list
        if (matchedRegistered.role === 'employee') {
          const empRecord = employees.find(
            (e) => e.email.toLowerCase() === matchedRegistered.email.toLowerCase()
          );
          if (empRecord && (empRecord.status === 'Menipis' || empRecord.status === 'Nonaktif')) {
            return {
              success: false,
              message: 'Akun karyawan ini sedang dinonaktifkan atau cuti.',
            };
          }
        }

        setUser(matchedRegistered);
        showToast(`Selamat datang, ${matchedRegistered.name}!`, 'success');
        return {
          success: true,
          role: matchedRegistered.role,
        };
      }

      // 2. Also check in dynamic employees list (so newly added employees can log in with password123)
      const matchedEmployee = employees.find((emp) => {
        const emailPrefix = emp.email.split('@')[0]?.toLowerCase() || '';
        return (
          emp.email.toLowerCase() === cleanId ||
          emailPrefix === cleanId ||
          emp.name.toLowerCase() === cleanId
        );
      });

      if (matchedEmployee) {
        if (cleanPass !== 'password123') {
          return {
            success: false,
            message: 'Email/username atau kata sandi yang Anda masukkan salah.',
          };
        }
        if (matchedEmployee.status === 'Menipis' || matchedEmployee.status === 'Nonaktif') {
          return {
            success: false,
            message: 'Akun karyawan ini sedang dinonaktifkan atau cuti.',
          };
        }

        const empAccount: UserAccount = {
          id: `usr-${matchedEmployee.id}`,
          name: matchedEmployee.name,
          username: matchedEmployee.email.split('@')[0] || 'karyawan',
          email: matchedEmployee.email,
          password: 'password123',
          role: matchedEmployee.role,
          roleLabel: matchedEmployee.role === 'owner' ? 'Pemilik toko' : 'Karyawan operasional',
          position: matchedEmployee.position,
          phone: matchedEmployee.phone,
          shift: matchedEmployee.shift,
          canRecordExpense: matchedEmployee.canRecordExpense,
          avatarInitial: matchedEmployee.name.charAt(0).toUpperCase() || 'K',
        };

        setUser(empAccount);
        showToast(`Selamat datang, ${empAccount.name}!`, 'success');
        return {
          success: true,
          role: empAccount.role,
        };
      }

      return {
        success: false,
        message: 'Akun tidak ditemukan. Periksa kembali email/username dan kata sandi Anda.',
      };
    },
    [employees, showToast]
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(SESSION_STORAGE_KEY);
    showToast('Anda telah keluar dari sesi.', 'success');
  }, [showToast]);

  // Computed metrics
  const metrics = useMemo(() => {
    const todayItems = finance.filter((f) => f.date === '2026-11-12' || f.updatedAt.startsWith('Hari ini'));
    const todaySalesFromFinance = todayItems
      .filter((f) => f.type === 'Pemasukan')
      .reduce((acc, item) => acc + item.amount, 0);
    const todayExpensesFromFinance = todayItems
      .filter((f) => f.type === 'Pengeluaran')
      .reduce((acc, item) => acc + item.amount, 0);

    const todaySales = todaySalesFromFinance > 0 ? todaySalesFromFinance : 1250000;
    const todayExpenses = todayExpensesFromFinance > 0 ? todayExpensesFromFinance : 325000;
    const todayProfit = todaySales - todayExpenses;

    const todayPortions =
      sales
        .filter((s) => s.date === '2026-11-12' || s.updatedAt.startsWith('Hari ini'))
        .reduce((acc, s) => acc + s.portions, 0) || 86;

    const lowStockItems = inventory.filter((item) => item.status === 'Menipis' || item.quantity <= item.minStock);

    return {
      todaySales,
      todayExpenses,
      todayProfit,
      todayPortions,
      lowStockCount: lowStockItems.length,
      lowStockItems,
    };
  }, [finance, sales, inventory]);

  // Finance CRUD
  const addFinance = useCallback(
    (data: Omit<FinanceTransaction, 'id' | 'updatedAt' | 'displayQuantity' | 'recordedBy'>) => {
      const actorName = user?.name || 'Admin Monitoring Penjualan';
      const newTx: FinanceTransaction = {
        ...data,
        id: `fin-${Date.now()}`,
        displayQuantity: formatRupiah(data.amount),
        updatedAt: getTodayLabel(),
        recordedBy: actorName,
      };
      setFinance((prev) => [newTx, ...prev]);

      setReports((prev) =>
        prev.map((row, idx) => {
          if (idx !== 0) return row;
          const nextSales = data.type === 'Pemasukan' ? row.sales + data.amount : row.sales;
          const nextExp = data.type === 'Pengeluaran' ? row.expenses + data.amount : row.expenses;
          return {
            ...row,
            sales: nextSales,
            expenses: nextExp,
            profit: nextSales - nextExp,
          };
        })
      );

      addActivity(
        data.type === 'Pemasukan' ? 'Pemasukan dicatat' : 'Pengeluaran dicatat',
        data.category,
        `${data.title} (${formatRupiah(data.amount)})`,
        'Normal'
      );
      showToast(`Transaksi "${data.title}" berhasil disimpan.`, 'success');
    },
    [user, addActivity, showToast]
  );

  const updateFinance = useCallback(
    (id: string, data: Partial<FinanceTransaction>) => {
      setFinance((prev) =>
        prev.map((item) => {
          if (item.id !== id) return item;
          const nextAmount = data.amount !== undefined ? data.amount : item.amount;
          return {
            ...item,
            ...data,
            displayQuantity: formatRupiah(nextAmount),
            updatedAt: getTodayLabel(),
          };
        })
      );
      addActivity('Transaksi diperbarui', data.category || 'Keuangan', data.title || 'Data transaksi');
      showToast('Data transaksi keuangan berhasil diperbarui.', 'success');
    },
    [addActivity, showToast]
  );

  const deleteFinance = useCallback(
    (id: string) => {
      const target = finance.find((f) => f.id === id);
      setFinance((prev) => prev.filter((item) => item.id !== id));
      if (target) {
        addActivity('Transaksi dihapus', target.category, target.title);
      }
      showToast('Transaksi keuangan telah dihapus.', 'warning');
    },
    [finance, addActivity, showToast]
  );

  // Inventory CRUD
  const addInventory = useCallback(
    (data: Omit<InventoryItem, 'id' | 'updatedAt' | 'status'>) => {
      const status: InventoryItem['status'] = data.quantity <= data.minStock ? 'Menipis' : 'Normal';
      const newItem: InventoryItem = {
        ...data,
        id: `inv-${Date.now()}`,
        status,
        updatedAt: getTodayLabel(),
      };
      setInventory((prev) => [newItem, ...prev]);
      addActivity(
        'Bahan baru ditambahkan',
        data.category,
        `${data.name} (${formatNumber(data.quantity)} ${data.unit})`,
        status
      );
      showToast(`Bahan "${data.name}" berhasil ditambahkan ke persediaan.`, 'success');
    },
    [addActivity, showToast]
  );

  const updateInventory = useCallback(
    (id: string, data: Partial<InventoryItem>) => {
      setInventory((prev) =>
        prev.map((item) => {
          if (item.id !== id) return item;
          const nextQty = data.quantity !== undefined ? data.quantity : item.quantity;
          const nextMin = data.minStock !== undefined ? data.minStock : item.minStock;
          const status: InventoryItem['status'] = nextQty <= nextMin ? 'Menipis' : 'Normal';
          return {
            ...item,
            ...data,
            status,
            updatedAt: getTodayLabel(),
          };
        })
      );
      addActivity('Persediaan diperbarui', data.category || 'Persediaan', data.name || 'Update stok bahan');
      showToast('Data persediaan bahan berhasil diperbarui.', 'success');
    },
    [addActivity, showToast]
  );

  const adjustStock = useCallback(
    (id: string, delta: number) => {
      let updatedItemName = '';
      let updatedStatus: InventoryItem['status'] = 'Normal';
      let updatedQtyText = '';

      setInventory((prev) =>
        prev.map((item) => {
          if (item.id !== id) return item;
          const nextQty = Math.max(0, Number((item.quantity + delta).toFixed(2)));
          const status: InventoryItem['status'] = nextQty <= item.minStock ? 'Menipis' : 'Normal';
          updatedItemName = item.name;
          updatedStatus = status;
          updatedQtyText = `${formatNumber(nextQty)} ${item.unit}`;
          return {
            ...item,
            quantity: nextQty,
            status,
            updatedAt: getTodayLabel(),
          };
        })
      );

      if (updatedItemName) {
        addActivity(
          `Stok ${updatedItemName.toLowerCase()} diperbarui`,
          'Persediaan',
          updatedQtyText,
          updatedStatus
        );
        showToast(`Stok ${updatedItemName} menjadi ${updatedQtyText} (${updatedStatus}).`, 'success');
      }
    },
    [addActivity, showToast]
  );

  const deleteInventory = useCallback(
    (id: string) => {
      const target = inventory.find((i) => i.id === id);
      setInventory((prev) => prev.filter((item) => item.id !== id));
      if (target) {
        addActivity('Bahan dihapus', target.category, target.name);
      }
      showToast('Bahan berhasil dihapus dari persediaan.', 'warning');
    },
    [inventory, addActivity, showToast]
  );

  // Purchases CRUD
  const addPurchase = useCallback(
    (data: Omit<PurchaseItem, 'id' | 'updatedAt'>) => {
      const newPurchase: PurchaseItem = {
        ...data,
        id: `pur-${Date.now()}`,
        updatedAt: getTodayLabel(),
      };
      setPurchases((prev) => [newPurchase, ...prev]);

      setInventory((prev) => {
        const matchIndex = prev.findIndex(
          (inv) =>
            inv.id === data.inventoryItemId ||
            inv.name.toLowerCase() === data.itemName.trim().toLowerCase()
        );
        if (matchIndex === -1) {
          const createdInv: InventoryItem = {
            id: `inv-${Date.now()}-auto`,
            name: data.itemName,
            category: data.category,
            quantity: data.quantity,
            unit: data.unit,
            minStock: Math.max(1, Math.round(data.quantity * 0.25)),
            status: 'Normal',
            updatedAt: getTodayLabel(),
            date: data.date,
            notes: `Ditambahkan dari pembelian (${data.supplier})`,
          };
          return [createdInv, ...prev];
        }
        return prev.map((inv, idx) => {
          if (idx !== matchIndex) return inv;
          const nextQty = Number((inv.quantity + data.quantity).toFixed(2));
          const status: InventoryItem['status'] = nextQty <= inv.minStock ? 'Menipis' : 'Normal';
          return {
            ...inv,
            quantity: nextQty,
            status,
            updatedAt: getTodayLabel(),
          };
        });
      });

      const newFin: FinanceTransaction = {
        id: `fin-${Date.now()}-pur`,
        title: `Pembelian ${data.itemName} (${data.supplier})`,
        category: data.category,
        type: 'Pengeluaran',
        amount: data.totalPrice,
        displayQuantity: formatRupiah(data.totalPrice),
        status: 'Normal',
        date: data.date,
        updatedAt: getTodayLabel(),
        notes: data.notes || `Pembelian ${data.quantity} ${data.unit}`,
        recordedBy: user?.name || 'Admin Monitoring Penjualan',
      };
      setFinance((prev) => [newFin, ...prev]);

      addActivity(
        'Pembelian bahan',
        data.category,
        `${data.itemName} (${formatNumber(data.quantity)} ${data.unit} · ${formatRupiah(data.totalPrice)})`,
        'Normal'
      );
      showToast(`Pembelian "${data.itemName}" disimpan & stok otomatis diperbarui.`, 'success');
    },
    [user, addActivity, showToast]
  );

  const updatePurchase = useCallback(
    (id: string, data: Partial<PurchaseItem>) => {
      setPurchases((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...data, updatedAt: getTodayLabel() } : item))
      );
      addActivity('Data pembelian diperbarui', data.category || 'Pembelian', data.itemName || 'Pembelian bahan');
      showToast('Data pembelian berhasil diperbarui.', 'success');
    },
    [addActivity, showToast]
  );

  const deletePurchase = useCallback(
    (id: string) => {
      const target = purchases.find((p) => p.id === id);
      setPurchases((prev) => prev.filter((item) => item.id !== id));
      if (target) {
        addActivity('Pembelian dihapus', target.category, target.itemName);
      }
      showToast('Data pembelian telah dihapus.', 'warning');
    },
    [purchases, addActivity, showToast]
  );

  // Sales CRUD
  const addSale = useCallback(
    (data: Omit<SalesRecord, 'id' | 'updatedAt' | 'recordedBy' | 'time'> & { time?: string }) => {
      const timeStr = data.time || getCurrentTimeStr();
      const actorName = user?.name || 'Rina Wulandari';
      const newSale: SalesRecord = {
        ...data,
        id: `sal-${Date.now()}`,
        time: timeStr,
        updatedAt: `Hari ini, ${timeStr}`,
        recordedBy: actorName,
      };
      setSales((prev) => [newSale, ...prev]);

      const newFin: FinanceTransaction = {
        id: `fin-${Date.now()}-sal`,
        title: `${data.itemName} (${data.portions} porsi)`,
        category: 'Penjualan',
        type: 'Pemasukan',
        amount: data.totalPrice,
        displayQuantity: formatRupiah(data.totalPrice),
        status: 'Normal',
        date: data.date,
        updatedAt: `Hari ini, ${timeStr}`,
        notes: `${data.paymentMethod} — ${data.notes || 'Penjualan kedai'}`,
        recordedBy: actorName,
      };
      setFinance((prev) => [newFin, ...prev]);

      setReports((prev) =>
        prev.map((row, idx) => {
          if (idx !== 0) return row;
          const nextSales = row.sales + data.totalPrice;
          return {
            ...row,
            sales: nextSales,
            profit: nextSales - row.expenses,
            portionsSold: row.portionsSold + data.portions,
          };
        })
      );

      addActivity(
        'Penjualan dicatat',
        'Penjualan',
        `${data.portions} porsi ${data.itemName} (${formatRupiah(data.totalPrice)})`,
        'Normal'
      );
      showToast(`Penjualan ${data.portions} porsi ${data.itemName} berhasil dicatat!`, 'success');
    },
    [user, addActivity, showToast]
  );

  const updateSale = useCallback(
    (id: string, data: Partial<SalesRecord>) => {
      setSales((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...data, updatedAt: getTodayLabel() } : item))
      );
      addActivity('Data penjualan diperbarui', 'Penjualan', data.itemName || 'Transaksi penjualan');
      showToast('Data pencatatan penjualan berhasil diperbarui.', 'success');
    },
    [addActivity, showToast]
  );

  const deleteSale = useCallback(
    (id: string) => {
      const target = sales.find((s) => s.id === id);
      setSales((prev) => prev.filter((item) => item.id !== id));
      if (target) {
        addActivity('Penjualan dihapus', 'Penjualan', target.itemName);
      }
      showToast('Data penjualan telah dihapus.', 'warning');
    },
    [sales, addActivity, showToast]
  );

  // Employees CRUD
  const addEmployee = useCallback(
    (data: Omit<EmployeeItem, 'id' | 'updatedAt'>) => {
      const newEmp: EmployeeItem = {
        ...data,
        id: `emp-${Date.now()}`,
        updatedAt: getTodayLabel(),
      };
      setEmployees((prev) => [newEmp, ...prev]);
      addActivity('Karyawan ditambahkan', data.position, data.name, 'Normal');
      showToast(`Data karyawan "${data.name}" berhasil ditambahkan.`, 'success');
    },
    [addActivity, showToast]
  );

  const updateEmployee = useCallback(
    (id: string, data: Partial<EmployeeItem>) => {
      setEmployees((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...data, updatedAt: getTodayLabel() } : item))
      );
      addActivity('Data karyawan diperbarui', data.position || 'Karyawan', data.name || 'Anggota tim');
      showToast('Data karyawan berhasil diperbarui.', 'success');
    },
    [addActivity, showToast]
  );

  const toggleEmployeeStatus = useCallback(
    (id: string) => {
      let empName = '';
      let nextStatusLabel = '';
      setEmployees((prev) =>
        prev.map((emp) => {
          if (emp.id !== id) return emp;
          empName = emp.name;
          const isNormal = emp.status === 'Normal' || emp.status === 'Aktif';
          const nextStatus: EmployeeItem['status'] = isNormal ? 'Menipis' : 'Normal';
          nextStatusLabel = nextStatus === 'Normal' ? 'Aktif (Normal)' : 'Nonaktif / Cuti';
          return {
            ...emp,
            status: nextStatus,
            updatedAt: getTodayLabel(),
          };
        })
      );
      if (empName) {
        addActivity('Status karyawan diubah', 'Karyawan', `${empName} → ${nextStatusLabel}`);
        showToast(`Status ${empName} diubah menjadi ${nextStatusLabel}.`, 'success');
      }
    },
    [addActivity, showToast]
  );

  const deleteEmployee = useCallback(
    (id: string) => {
      const target = employees.find((e) => e.id === id);
      setEmployees((prev) => prev.filter((item) => item.id !== id));
      if (target) {
        addActivity('Karyawan dihapus', target.position, target.name);
      }
      showToast('Data karyawan telah dihapus.', 'warning');
    },
    [employees, addActivity, showToast]
  );

  // Employee Stock Usage & Stock Request
  const addStockUsage = useCallback(
    (data: Omit<StockUsageRecord, 'id' | 'updatedAt' | 'usedBy'>) => {
      const newUsage: StockUsageRecord = {
        ...data,
        id: `use-${Date.now()}`,
        updatedAt: getTodayLabel(),
        usedBy: user?.name || 'Rina Wulandari',
      };
      setStockUsages((prev) => [newUsage, ...prev]);

      if (data.inventoryId) {
        adjustStock(data.inventoryId, -Math.abs(data.amountUsed));
      } else {
        addActivity(
          'Penggunaan bahan dicatat',
          data.category,
          `${data.itemName} (${formatNumber(data.amountUsed)} ${data.unit})`
        );
        showToast(`Penggunaan bahan ${data.itemName} berhasil dicatat.`, 'success');
      }
    },
    [user, adjustStock, addActivity, showToast]
  );

  const addStockRequest = useCallback(
    (data: Omit<StockRequestRecord, 'id' | 'updatedAt' | 'requestedBy' | 'status'>) => {
      const newReq: StockRequestRecord = {
        ...data,
        id: `req-${Date.now()}`,
        status: 'Menunggu',
        updatedAt: getTodayLabel(),
        requestedBy: user?.name || 'Rina Wulandari',
      };
      setStockRequests((prev) => [newReq, ...prev]);
      addActivity(
        'Pengajuan stok baru',
        data.category,
        `${data.itemName} (${formatNumber(data.requestedQty)} ${data.unit})`,
        data.urgency
      );
      showToast(`Pengajuan stok "${data.itemName}" berhasil dikirim.`, 'success');
    },
    [user, addActivity, showToast]
  );

  const updateStockRequestStatus = useCallback(
    (id: string, status: StockRequestRecord['status']) => {
      setStockRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status, updatedAt: getTodayLabel() } : req))
      );
      addActivity('Status pengajuan stok', 'Persediaan', `Diubah menjadi ${status}`);
      showToast(`Status pengajuan stok diperbarui menjadi ${status}.`, 'success');
    },
    [addActivity, showToast]
  );

  const updateSettings = useCallback(
    (newSettings: Partial<StoreSettings>) => {
      setSettings((prev) => ({ ...prev, ...newSettings }));
      addActivity('Pengaturan diperbarui', 'Pengaturan', 'Profil dan preferensi usaha');
      showToast('Pengaturan usaha berhasil disimpan.', 'success');
    },
    [addActivity, showToast]
  );

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      logout,
      globalSearch,
      setGlobalSearch,
      inventory,
      finance,
      purchases,
      sales,
      employees,
      activities,
      reports,
      stockUsages,
      stockRequests,
      settings,
      metrics,
      addFinance,
      updateFinance,
      deleteFinance,
      addInventory,
      updateInventory,
      adjustStock,
      deleteInventory,
      addPurchase,
      updatePurchase,
      deletePurchase,
      addSale,
      updateSale,
      deleteSale,
      addEmployee,
      updateEmployee,
      toggleEmployeeStatus,
      deleteEmployee,
      addStockUsage,
      addStockRequest,
      updateStockRequestStatus,
      addActivity,
      updateSettings,
      toasts,
      showToast,
      dismissToast,
    }),
    [
      user,
      login,
      logout,
      globalSearch,
      inventory,
      finance,
      purchases,
      sales,
      employees,
      activities,
      reports,
      stockUsages,
      stockRequests,
      settings,
      metrics,
      addFinance,
      updateFinance,
      deleteFinance,
      addInventory,
      updateInventory,
      adjustStock,
      deleteInventory,
      addPurchase,
      updatePurchase,
      deletePurchase,
      addSale,
      updateSale,
      deleteSale,
      addEmployee,
      updateEmployee,
      toggleEmployeeStatus,
      deleteEmployee,
      addStockUsage,
      addStockRequest,
      updateStockRequestStatus,
      addActivity,
      updateSettings,
      toasts,
      showToast,
      dismissToast,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp harus digunakan di dalam AppProvider');
  }
  return ctx;
}
