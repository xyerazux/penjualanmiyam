import React, { useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useApp } from '../../services/AppContext';
import { formatNumber } from '../../utils/formatters';

export const PengajuanStokPage: React.FC = () => {
  const { inventory, stockRequests, addStockRequest, updateStockRequestStatus, user } = useApp();

  const [itemName, setItemName] = useState('Ayam fillet');
  const [category, setCategory] = useState('Bahan baku');
  const [requestedQty, setRequestedQty] = useState('10');
  const [unit, setUnit] = useState('kg');
  const [urgency, setUrgency] = useState<'Normal' | 'Menipis'>('Menipis');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(requestedQty) || 1;
    addStockRequest({
      itemName: itemName.trim() || 'Bahan baku',
      category,
      requestedQty: qty,
      unit,
      urgency,
      date: '2026-11-12',
      notes: notes.trim() || 'Pengajuan pengisian stok gudang',
    });
    setNotes('');
  };

  const mobileSubNav = [
    { label: 'Catat Penjualan', path: '/penjualan', active: false },
    { label: 'Catat Pengeluaran', path: '/pengeluaran-karyawan', active: false },
    { label: 'Gunakan Bahan', path: '/penggunaan-bahan', active: false },
    { label: 'Ajukan Stok', path: '/pengajuan-stok', active: true },
  ];

  return (
    <AppLayout
      title="Pengajuan Stok"
      subtitle="Ajukan pembelian ulang untuk bahan yang menipis"
      mobileSubNav={mobileSubNav}
    >
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-[24px] items-start">
        {/* Form Pengajuan Stok */}
        <div className="xl:col-span-6 rounded-[13px] bg-[#FFFFFF] border border-[#E4EAE6] p-[18px] md:p-[24px]">
          <h2 className="text-[14px] font-[650] text-[#1D2B25]">Form Pengajuan Stok</h2>
          <p className="mt-1 text-[12px] text-[#738078]">
            Kirim permohonan restock bahan kepada pemilik toko.
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-[16px]">
            <div>
              <label
                htmlFor="req-item"
                className="block text-[11px] font-[650] text-[#1D2B25] mb-[6px]"
              >
                Nama Bahan
              </label>
              <select
                id="req-item"
                value={itemName}
                onChange={(e) => {
                  const val = e.target.value;
                  setItemName(val);
                  const found = inventory.find((i) => i.name === val);
                  if (found) {
                    setCategory(found.category);
                    setUnit(found.unit);
                    setUrgency(found.status);
                  }
                }}
                className="w-full h-[43px] rounded-[7px] bg-[#FFFFFF] border border-[#E4EAE6] px-[13px] text-[12px] text-[#1D2B25] focus:outline-none focus:border-[#145B46]"
              >
                {inventory.map((inv) => (
                  <option key={inv.id} value={inv.name}>
                    {inv.name} (Sisa: {formatNumber(inv.quantity)} {inv.unit})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="req-qty"
                  className="block text-[11px] font-[650] text-[#1D2B25] mb-[6px]"
                >
                  Jumlah Diajukan ({unit})
                </label>
                <input
                  id="req-qty"
                  type="number"
                  min="1"
                  value={requestedQty}
                  onChange={(e) => setRequestedQty(e.target.value)}
                  className="w-full h-[43px] rounded-[7px] bg-[#FFFFFF] border border-[#E4EAE6] px-[13px] text-[12px] text-[#1D2B25] focus:outline-none focus:border-[#145B46]"
                />
              </div>

              <div>
                <label
                  htmlFor="req-urgency"
                  className="block text-[11px] font-[650] text-[#1D2B25] mb-[6px]"
                >
                  Prioritas Stok
                </label>
                <select
                  id="req-urgency"
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as 'Normal' | 'Menipis')}
                  className="w-full h-[43px] rounded-[7px] bg-[#FFFFFF] border border-[#E4EAE6] px-[13px] text-[12px] text-[#1D2B25] focus:outline-none focus:border-[#145B46]"
                >
                  <option value="Menipis">Menipis (Segera)</option>
                  <option value="Normal">Normal (Rutin)</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="req-notes"
                className="block text-[11px] font-[650] text-[#1D2B25] mb-[6px]"
              >
                Catatan
              </label>
              <input
                id="req-notes"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Masukkan catatan tambahan..."
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

        {/* Daftar Pengajuan Stok */}
        <div className="xl:col-span-6 rounded-[13px] bg-[#FFFFFF] border border-[#E4EAE6] p-[18px] md:p-[24px]">
          <h2 className="text-[14px] font-[650] text-[#1D2B25] mb-3">Daftar Pengajuan Stok</h2>

          <div className="divide-y divide-[#E4EAE6]">
            {stockRequests.map((req) => (
              <div key={req.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-[650] text-[#1D2B25]">
                    {req.itemName} ({formatNumber(req.requestedQty)} {req.unit})
                  </div>
                  <div className="text-[10px] text-[#738078] mt-0.5">
                    {req.notes} · Diajukan oleh {req.requestedBy} ({req.updatedAt})
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <StatusBadge label={req.urgency} />
                  <StatusBadge
                    label={req.status}
                    variant={req.status === 'Menunggu' ? 'warning' : 'success'}
                    onClick={
                      user?.role === 'owner'
                        ? () =>
                            updateStockRequestStatus(
                              req.id,
                              req.status === 'Menunggu' ? 'Disetujui' : 'Selesai'
                            )
                        : undefined
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

