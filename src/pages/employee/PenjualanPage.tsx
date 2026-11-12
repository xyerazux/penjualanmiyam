import React, { useState, useMemo } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { useApp } from '../../services/AppContext';
import { formatRupiah, getCurrentTimeStr } from '../../utils/formatters';
import { Trash2, Pencil } from 'lucide-react';

const MENU_PRESETS: Record<string, { price: number; category: string }> = {
  'Mie Ayam Original': { price: 14000, category: 'Makanan Utama' },
  'Mie Ayam Bakso Spesial': { price: 18000, category: 'Makanan Utama' },
  'Mie Ayam Pangsit Rebus': { price: 16000, category: 'Makanan Utama' },
  'Mie Ayam Pangsit Goreng': { price: 16000, category: 'Makanan Utama' },
  'Mie Ayam Komplit + Es Teh': { price: 22000, category: 'Paket Hemat' },
  'Pangsit Goreng Tambahan': { price: 10000, category: 'Pendamping' },
};

export const PenjualanPage: React.FC = () => {
  const { sales, addSale, updateSale, deleteSale, globalSearch } = useApp();

  // Form state
  const [showDesktopForm, setShowDesktopForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [itemName, setItemName] = useState('Mie Ayam Original');
  const [category, setCategory] = useState('Makanan Utama');
  const [portions, setPortions] = useState('2');
  const [unitPrice, setUnitPrice] = useState('14000');
  const [paymentMethod, setPaymentMethod] = useState<'Tunai' | 'QRIS' | 'Transfer'>('Tunai');
  const [date, setDate] = useState('2026-11-12');
  const [time, setTime] = useState(() => getCurrentTimeStr());
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');

  // Table state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const itemsPerPage = 7;
  const combinedSearch = (searchQuery || globalSearch).trim().toLowerCase();

  const parsedPortions = Math.max(0, Number(portions) || 0);
  const parsedPrice = Math.max(0, Number(unitPrice) || 0);
  const totalTransaction = parsedPortions * parsedPrice;

  const filteredSales = useMemo(() => {
    return sales.filter((item) => {
      const matchesSearch =
        !combinedSearch ||
        item.itemName.toLowerCase().includes(combinedSearch) ||
        item.category.toLowerCase().includes(combinedSearch) ||
        item.paymentMethod.toLowerCase().includes(combinedSearch) ||
        item.recordedBy.toLowerCase().includes(combinedSearch);

      const matchesFilter =
        filterCategory === 'Semua' ||
        item.category === filterCategory ||
        item.paymentMethod === filterCategory;

      return matchesSearch && matchesFilter;
    });
  }, [sales, combinedSearch, filterCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredSales.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedItems = filteredSales.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  );

  const resetForm = () => {
    setEditingId(null);
    setItemName('Mie Ayam Original');
    setCategory('Makanan Utama');
    setPortions('2');
    setUnitPrice('14000');
    setPaymentMethod('Tunai');
    setDate('2026-11-12');
    setTime(getCurrentTimeStr());
    setNotes('');
    setFormError('');
  };

  const handleEditClick = (saleId: string) => {
    const target = sales.find((s) => s.id === saleId);
    if (!target) return;
    setEditingId(target.id);
    setItemName(target.itemName);
    setCategory(target.category);
    setPortions(String(target.portions));
    setUnitPrice(String(target.unitPrice));
    setPaymentMethod(target.paymentMethod);
    setDate(target.date);
    setTime(target.time);
    setNotes(target.notes);
    setShowDesktopForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) {
      setFormError('Nama menu / keterangan penjualan wajib diisi.');
      return;
    }
    if (parsedPortions <= 0) {
      setFormError('Jumlah porsi harus lebih dari 0.');
      return;
    }
    if (parsedPrice <= 0) {
      setFormError('Harga satuan harus lebih dari 0.');
      return;
    }

    if (editingId) {
      updateSale(editingId, {
        itemName: itemName.trim(),
        category,
        portions: parsedPortions,
        unitPrice: parsedPrice,
        totalPrice: totalTransaction,
        paymentMethod,
        date,
        time,
        notes: notes.trim(),
      });
    } else {
      addSale({
        itemName: itemName.trim(),
        category,
        portions: parsedPortions,
        unitPrice: parsedPrice,
        totalPrice: totalTransaction,
        paymentMethod,
        status: 'Normal',
        date,
        time,
        notes: notes.trim(),
      });
    }
    resetForm();
    setShowDesktopForm(false);
  };

  const mobileSubNav = [
    { label: 'Catat Penjualan', path: '/penjualan', active: true },
    { label: 'Catat Pengeluaran', path: '/pengeluaran-karyawan', active: false },
    { label: 'Gunakan Bahan', path: '/penggunaan-bahan', active: false },
    { label: 'Ajukan Stok', path: '/pengajuan-stok', active: false },
  ];

  return (
    <AppLayout
      title="Pencatatan Penjualan"
      subtitle="Catat pesanan yang masuk"
      mobileSubNav={mobileSubNav}
      actionButton={{
        label: showDesktopForm ? 'Tutup form' : '+ Tambah data',
        onClick: () => {
          if (showDesktopForm) {
            resetForm();
            setShowDesktopForm(false);
          } else {
            setShowDesktopForm(true);
          }
        },
      }}
    >
      {/* Mobile Form Card (Always visible on mobile to match M05_Penjualan_Mobile.svg, toggleable on desktop) */}
      <div
        className={`${
          showDesktopForm ? 'block' : 'md:hidden'
        } mb-6 rounded-[13px] bg-[#FFFFFF] border border-[#E4EAE6] p-[18px] md:p-[24px]`}
      >
        <h2 className="text-[14px] font-[650] text-[#1D2B25]">
          {editingId ? 'Edit Pencatatan Penjualan' : 'Form Pencatatan Penjualan'}
        </h2>

        {formError && (
          <div
            role="alert"
            className="mt-3 px-3.5 py-2 rounded-[8px] bg-[#FDECEC] text-[#B42318] text-[11px] font-semibold"
          >
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-[16px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="sal-name"
                className="block text-[11px] font-[650] text-[#1D2B25] mb-[6px]"
              >
                Nama / Keterangan
              </label>
              <input
                id="sal-name"
                list="menu-mie-list"
                type="text"
                value={itemName}
                onChange={(e) => {
                  const val = e.target.value;
                  setItemName(val);
                  setFormError('');
                  if (MENU_PRESETS[val]) {
                    setUnitPrice(String(MENU_PRESETS[val].price));
                    setCategory(MENU_PRESETS[val].category);
                  }
                }}
                placeholder="Masukkan nama / keterangan..."
                className="w-full h-[43px] rounded-[7px] bg-[#FFFFFF] border border-[#E4EAE6] px-[13px] text-[12px] text-[#1D2B25] placeholder-[#A0AAA4] focus:outline-none focus:border-[#145B46]"
              />
              <datalist id="menu-mie-list">
                {Object.keys(MENU_PRESETS).map((menuName) => (
                  <option key={menuName} value={menuName} />
                ))}
              </datalist>
            </div>

            <div>
              <label
                htmlFor="sal-category"
                className="block text-[11px] font-[650] text-[#1D2B25] mb-[6px]"
              >
                Kategori
              </label>
              <select
                id="sal-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-[43px] rounded-[7px] bg-[#FFFFFF] border border-[#E4EAE6] px-[13px] text-[12px] text-[#1D2B25] focus:outline-none focus:border-[#145B46]"
              >
                <option value="Makanan Utama">Makanan Utama</option>
                <option value="Paket Hemat">Paket Hemat</option>
                <option value="Pendamping">Pendamping</option>
                <option value="Minuman">Minuman</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="sal-portions"
                className="block text-[11px] font-[650] text-[#1D2B25] mb-[6px]"
              >
                Jumlah (Porsi)
              </label>
              <input
                id="sal-portions"
                type="number"
                min="1"
                value={portions}
                onChange={(e) => {
                  setPortions(e.target.value);
                  setFormError('');
                }}
                placeholder="Masukkan jumlah..."
                className="w-full h-[43px] rounded-[7px] bg-[#FFFFFF] border border-[#E4EAE6] px-[13px] text-[12px] text-[#1D2B25] placeholder-[#A0AAA4] focus:outline-none focus:border-[#145B46]"
              />
            </div>

            <div>
              <label
                htmlFor="sal-price"
                className="block text-[11px] font-[650] text-[#1D2B25] mb-[6px]"
              >
                Harga per Porsi (Rp)
              </label>
              <input
                id="sal-price"
                type="number"
                min="0"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                placeholder="Harga satuan..."
                className="w-full h-[43px] rounded-[7px] bg-[#FFFFFF] border border-[#E4EAE6] px-[13px] text-[12px] text-[#1D2B25] placeholder-[#A0AAA4] focus:outline-none focus:border-[#145B46]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-[650] text-[#1D2B25] mb-[6px]">
                Total Transaksi
              </label>
              <div className="w-full h-[43px] rounded-[7px] bg-[#EAF4EF] border border-[#145B46]/25 px-[13px] flex items-center text-[13px] font-bold text-[#145B46]">
                {formatRupiah(totalTransaction)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="sal-date"
                className="block text-[11px] font-[650] text-[#1D2B25] mb-[6px]"
              >
                Tanggal
              </label>
              <input
                id="sal-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-[43px] rounded-[7px] bg-[#FFFFFF] border border-[#E4EAE6] px-[13px] text-[12px] text-[#1D2B25] focus:outline-none focus:border-[#145B46]"
              />
            </div>

            <div>
              <label
                htmlFor="sal-time"
                className="block text-[11px] font-[650] text-[#1D2B25] mb-[6px]"
              >
                Waktu Transaksi
              </label>
              <input
                id="sal-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full h-[43px] rounded-[7px] bg-[#FFFFFF] border border-[#E4EAE6] px-[13px] text-[12px] text-[#1D2B25] focus:outline-none focus:border-[#145B46]"
              />
            </div>

            <div>
              <label
                htmlFor="sal-method"
                className="block text-[11px] font-[650] text-[#1D2B25] mb-[6px]"
              >
                Metode Pembayaran
              </label>
              <select
                id="sal-method"
                value={paymentMethod}
                onChange={(e) =>
                  setPaymentMethod(e.target.value as 'Tunai' | 'QRIS' | 'Transfer')
                }
                className="w-full h-[43px] rounded-[7px] bg-[#FFFFFF] border border-[#E4EAE6] px-[13px] text-[12px] text-[#1D2B25] focus:outline-none focus:border-[#145B46]"
              >
                <option value="Tunai">Tunai</option>
                <option value="QRIS">QRIS</option>
                <option value="Transfer">Transfer</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="sal-notes"
              className="block text-[11px] font-[650] text-[#1D2B25] mb-[6px]"
            >
              Catatan
            </label>
            <input
              id="sal-notes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Masukkan catatan..."
              className="w-full h-[43px] rounded-[7px] bg-[#FFFFFF] border border-[#E4EAE6] px-[13px] text-[12px] text-[#1D2B25] placeholder-[#A0AAA4] focus:outline-none focus:border-[#145B46]"
            />
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              className="w-full md:w-[160px] h-[38px] rounded-[8px] bg-[#145B46] hover:bg-[#0F4736] text-[#FFFFFF] text-[12px] font-semibold flex items-center justify-start md:justify-center px-[14px] transition-colors cursor-pointer"
            >
              Simpan data
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowDesktopForm(false);
                }}
                className="h-[38px] px-4 rounded-[8px] border border-[#145B46] text-[#145B46] text-[12px] font-semibold cursor-pointer"
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Daftar Pencatatan Penjualan Card (Matches 14_Penjualan_Karyawan.svg) */}
      <div className="rounded-[13px] bg-[#FFFFFF] border border-[#E4EAE6] p-[16px] md:p-[20px]">
        <h2 className="text-[14px] font-[650] text-[#1D2B25] mb-3">
          Daftar pencatatan penjualan
        </h2>

        {/* Search & Filter Bar */}
        <div className="w-full min-h-[42px] rounded-[7px] bg-[#F5F7F5] px-3.5 py-1.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center flex-1">
            <span className="text-[12px] text-[#738078] mr-2 select-none" aria-hidden="true">
              ⌕
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari data..."
              aria-label="Cari data penjualan"
              className="w-full bg-transparent text-[12px] text-[#1D2B25] placeholder-[#738078] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <label htmlFor="filter-penjualan" className="text-[12px] text-[#738078]">
              Filter:
            </label>
            <select
              id="filter-penjualan"
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-[12px] font-medium text-[#1D2B25] focus:outline-none cursor-pointer"
            >
              <option value="Semua">Semua</option>
              <option value="Makanan Utama">Makanan Utama</option>
              <option value="Paket Hemat">Paket Hemat</option>
              <option value="Pendamping">Pendamping</option>
              <option value="Tunai">Metode: Tunai</option>
              <option value="QRIS">Metode: QRIS</option>
            </select>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block mt-4 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E4EAE6]">
                <th className="py-3 px-1 text-[11px] font-bold text-[#738078]">
                  Nama / Keterangan
                </th>
                <th className="py-3 px-1 text-[11px] font-bold text-[#738078]">Kategori</th>
                <th className="py-3 px-1 text-[11px] font-bold text-[#738078]">Jumlah</th>
                <th className="py-3 px-1 text-[11px] font-bold text-[#738078]">Status</th>
                <th className="py-3 px-1 text-[11px] font-bold text-[#738078]">
                  Terakhir diperbarui
                </th>
                <th className="py-3 px-1 text-right text-[11px] font-bold text-[#738078]">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((sale) => (
                <tr
                  key={sale.id}
                  className="border-b border-[#E4EAE6] hover:bg-[#F5F7F5]/50 transition-colors"
                >
                  <td className="py-[14px] px-1">
                    <div className="text-[12px] font-[550] text-[#1D2B25]">{sale.itemName}</div>
                    <div className="text-[10px] text-[#738078] mt-0.5">
                      {formatRupiah(sale.totalPrice)} · {sale.paymentMethod}
                    </div>
                  </td>
                  <td className="py-[14px] px-1 text-[12px] font-[550] text-[#1D2B25]">
                    {sale.category}
                  </td>
                  <td className="py-[14px] px-1 text-[12px] font-[550] text-[#1D2B25]">
                    {sale.portions} porsi
                  </td>
                  <td className="py-[14px] px-1">
                    <StatusBadge label={sale.status} />
                  </td>
                  <td className="py-[14px] px-1 text-[12px] font-[550] text-[#1D2B25]">
                    {sale.updatedAt}
                  </td>
                  <td className="py-[14px] px-1 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleEditClick(sale.id)}
                        aria-label={`Edit ${sale.itemName}`}
                        className="p-1.5 rounded-[7px] text-[#145B46] hover:bg-[#EAF4EF] cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTargetId(sale.id)}
                        aria-label={`Hapus ${sale.itemName}`}
                        className="p-1.5 rounded-[7px] text-[#B42318] hover:bg-[#FDECEC] cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="md:hidden mt-4 flex flex-col gap-[12px]">
          {paginatedItems.map((sale) => (
            <div
              key={sale.id}
              className="min-h-[88px] rounded-[13px] bg-[#FFFFFF] border border-[#E4EAE6] p-[14px] flex items-center justify-between gap-3"
            >
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-[650] text-[#1D2B25] truncate">
                  {sale.itemName}
                </div>
                <div className="mt-0.5 text-[10px] text-[#738078]">
                  {sale.portions} porsi · {sale.paymentMethod}
                </div>
                <div className="mt-1 text-[13px] font-bold text-[#1D2B25]">
                  {formatRupiah(sale.totalPrice)}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <StatusBadge label={sale.status} />
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleEditClick(sale.id)}
                    className="px-2 py-1 rounded-[6px] bg-[#EAF4EF] text-[#145B46] text-[10px] font-semibold cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTargetId(sale.id)}
                    className="px-2 py-1 rounded-[6px] bg-[#FDECEC] text-[#B42318] text-[10px] font-semibold cursor-pointer"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Footer */}
        <div className="mt-5 pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="text-[10px] font-normal text-[#738078]">
            Menampilkan {filteredSales.length === 0 ? 0 : (safePage - 1) * itemsPerPage + 1}–
            {Math.min(safePage * itemsPerPage, filteredSales.length)} dari {filteredSales.length}{' '}
            data
          </div>

          <div className="flex items-center gap-2 text-[11px] font-[650] text-[#145B46]">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="px-2 py-1 rounded hover:bg-[#EAF4EF] disabled:opacity-40 cursor-pointer"
            >
              ‹
            </button>
            {Array.from({ length: Math.max(3, totalPages) }, (_, idx) => idx + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(Math.min(pageNum, totalPages))}
                className={`w-6 h-6 rounded-[6px] flex items-center justify-center cursor-pointer ${
                  safePage === pageNum
                    ? 'bg-[#EAF4EF] text-[#145B46] font-bold'
                    : 'text-[#145B46] hover:bg-[#F5F7F5]'
                }`}
              >
                {pageNum}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className="px-2 py-1 rounded hover:bg-[#EAF4EF] disabled:opacity-40 cursor-pointer"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!deleteTargetId}
        title="Hapus Pencatatan Penjualan?"
        description="Apakah Anda yakin ingin menghapus data pencatatan penjualan ini?"
        onConfirm={() => {
          if (deleteTargetId) {
            deleteSale(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
        onCancel={() => setDeleteTargetId(null)}
      />
    </AppLayout>
  );
};

