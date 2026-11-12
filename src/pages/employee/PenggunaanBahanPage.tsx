import React, { useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useApp } from '../../services/AppContext';
import { formatNumber } from '../../utils/formatters';

export const PenggunaanBahanPage: React.FC = () => {
  const { inventory, stockUsages, addStockUsage } = useApp();

  const [selectedInvId, setSelectedInvId] = useState(inventory[0]?.id || '');
  const [amountUsed, setAmountUsed] = useState('1');
  const [date, setDate] = useState('2026-11-12');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const selectedItem = inventory.find((i) => i.id === selectedInvId) || inventory[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(amountUsed.toString().replace(',', '.'));
    if (!selectedItem || isNaN(qty) || qty <= 0) {
      setError('Jumlah penggunaan bahan harus lebih dari 0.');
      return;
    }

    addStockUsage({
      inventoryId: selectedItem.id,
      itemName: selectedItem.name,
      category: selectedItem.category,
      amountUsed: qty,
      unit: selectedItem.unit,
      date,
      notes: notes.trim() || 'Pemakaian operasional dapur',
    });

    setAmountUsed('1');
    setNotes('');
    setError('');
  };

  const mobileSubNav = [
    { label: 'Catat Penjualan', path: '/penjualan', active: false },
    { label: 'Catat Pengeluaran', path: '/pengeluaran-karyawan', active: false },
    { label: 'Gunakan Bahan', path: '/penggunaan-bahan', active: true },
    { label: 'Ajukan Stok', path: '/pengajuan-stok', active: false },
  ];

  return (
    <AppLayout
      title="Penggunaan Bahan"
      subtitle="Catat pemakaian bahan baku harian dapur"
      mobileSubNav={mobileSubNav}
    >
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-[24px] items-start">
        {/* Left Form Card */}
        <div className="xl:col-span-6 rounded-[13px] bg-[#FFFFFF] border border-[#E4EAE6] p-[18px] md:p-[24px]">
          <h2 className="text-[14px] font-[650] text-[#1D2B25]">Form Penggunaan Bahan</h2>
          <p className="mt-1 text-[12px] text-[#738078]">
            Stok persediaan akan dikurangi secara otomatis.
          </p>

          {error && (
            <div
              role="alert"
              className="mt-3 px-3.5 py-2 rounded-[8px] bg-[#FDECEC] text-[#B42318] text-[11px] font-semibold"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-[16px]">
            <div>
              <label
                htmlFor="use-inv"
                className="block text-[11px] font-[650] text-[#1D2B25] mb-[6px]"
              >
                Pilih Bahan Persediaan
              </label>
              <select
                id="use-inv"
                value={selectedInvId}
                onChange={(e) => setSelectedInvId(e.target.value)}
                className="w-full h-[43px] rounded-[7px] bg-[#FFFFFF] border border-[#E4EAE6] px-[13px] text-[12px] text-[#1D2B25] focus:outline-none focus:border-[#145B46]"
              >
                {inventory.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.name} — Tersedia: {formatNumber(inv.quantity)} {inv.unit} ({inv.status})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="use-qty"
                  className="block text-[11px] font-[650] text-[#1D2B25] mb-[6px]"
                >
                  Jumlah Terpakai ({selectedItem?.unit || 'kg'})
                </label>
                <input
                  id="use-qty"
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={amountUsed}
                  onChange={(e) => {
                    setAmountUsed(e.target.value);
                    setError('');
                  }}
                  className="w-full h-[43px] rounded-[7px] bg-[#FFFFFF] border border-[#E4EAE6] px-[13px] text-[12px] text-[#1D2B25] focus:outline-none focus:border-[#145B46]"
                />
              </div>

              <div>
                <label
                  htmlFor="use-date"
                  className="block text-[11px] font-[650] text-[#1D2B25] mb-[6px]"
                >
                  Tanggal
                </label>
                <input
                  id="use-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-[43px] rounded-[7px] bg-[#FFFFFF] border border-[#E4EAE6] px-[13px] text-[12px] text-[#1D2B25] focus:outline-none focus:border-[#145B46]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="use-notes"
                className="block text-[11px] font-[650] text-[#1D2B25] mb-[6px]"
              >
                Catatan Pemakaian
              </label>
              <input
                id="use-notes"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Produksi kuah dan mie gelombang pagi..."
                className="w-full h-[43px] rounded-[7px] bg-[#FFFFFF] border border-[#E4EAE6] px-[13px] text-[12px] text-[#1D2B25] placeholder-[#A0AAA4] focus:outline-none focus:border-[#145B46]"
              />
            </div>

            <button
              type="submit"
              className="w-full h-[38px] rounded-[8px] bg-[#145B46] hover:bg-[#0F4736] text-[#FFFFFF] text-[12px] font-semibold flex items-center justify-start px-[14px] transition-colors cursor-pointer"
            >
              Simpan data
            </button>
          </form>
        </div>

        {/* Right History Card */}
        <div className="xl:col-span-6 rounded-[13px] bg-[#FFFFFF] border border-[#E4EAE6] p-[18px] md:p-[24px]">
          <h2 className="text-[14px] font-[650] text-[#1D2B25] mb-3">
            Riwayat Penggunaan Bahan Hari Ini
          </h2>

          <div className="divide-y divide-[#E4EAE6]">
            {stockUsages.map((usage) => (
              <div key={usage.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] font-[650] text-[#1D2B25]">{usage.itemName}</div>
                  <div className="text-[10px] text-[#738078] mt-0.5">
                    {usage.notes} · Oleh: {usage.usedBy}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-[12px] font-bold text-[#1D2B25]">
                    -{formatNumber(usage.amountUsed)} {usage.unit}
                  </span>
                  <StatusBadge label="Normal" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

