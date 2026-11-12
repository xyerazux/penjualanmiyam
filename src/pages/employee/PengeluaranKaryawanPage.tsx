import React, { useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useApp } from '../../services/AppContext';
import { formatRupiah } from '../../utils/formatters';

export const PengeluaranKaryawanPage: React.FC = () => {
  const { finance, addFinance, settings } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Operasional');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('2026-11-12');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const recentExpenses = finance.filter((f) => f.type === 'Pengeluaran').slice(0, 5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Nama / keterangan pengeluaran wajib diisi.');
      return;
    }
    const numericAmount = Number(amount.toString().replace(/[^0-9]/g, ''));
    if (!numericAmount || numericAmount <= 0) {
      setError('Jumlah pengeluaran harus lebih dari 0.');
      return;
    }

    addFinance({
      title: title.trim(),
      category,
      type: 'Pengeluaran',
      amount: numericAmount,
      status: 'Normal',
      date,
      notes: notes.trim(),
    });

    setTitle('');
    setAmount('');
    setNotes('');
    setError('');
  };

  const mobileSubNav = [
    { label: 'Catat Penjualan', path: '/penjualan', active: false },
    { label: 'Catat Pengeluaran', path: '/pengeluaran-karyawan', active: true },
    { label: 'Gunakan Bahan', path: '/penggunaan-bahan', active: false },
    { label: 'Ajukan Stok', path: '/pengajuan-stok', active: false },
  ];

  return (
    <AppLayout
      title="Catat Pengeluaran"
      subtitle="Catat pengeluaran operasional kedai"
      mobileSubNav={mobileSubNav}
    >
      {!settings.allowEmployeeExpense ? (
        <div className="rounded-[13px] bg-[#FFF2E5] border border-[#E89A45]/40 p-5 text-[#A96B22] text-[12px]">
          Fitur pencatatan pengeluaran oleh karyawan sedang dinonaktifkan oleh pemilik toko.
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-[24px] items-start">
          {/* Form Card (Matches M06_Pengeluaran_Mobile.svg: 350x610 on mobile, rx 13) */}
          <div className="xl:col-span-7 rounded-[13px] bg-[#FFFFFF] border border-[#E4EAE6] p-[18px] md:p-[24px] min-h-[560px]">
            <h2 className="text-[14px] font-[650] text-[#1D2B25]">Form Catat Pengeluaran</h2>

            {error && (
              <div
                role="alert"
                className="mt-3 px-3.5 py-2 rounded-[8px] bg-[#FDECEC] text-[#B42318] text-[11px] font-semibold"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-[22px] space-y-[18px]">
              <div>
                <label
                  htmlFor="exp-title"
                  className="block text-[11px] font-[650] text-[#1D2B25] mb-[7px]"
                >
                  Nama / Keterangan
                </label>
                <input
                  id="exp-title"
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setError('');
                  }}
                  placeholder="Masukkan nama / keterangan..."
                  className="w-full h-[43px] rounded-[7px] bg-[#FFFFFF] border border-[#E4EAE6] px-[13px] text-[12px] text-[#1D2B25] placeholder-[#A0AAA4] focus:outline-none focus:border-[#145B46]"
                />
              </div>

              <div>
                <label
                  htmlFor="exp-category"
                  className="block text-[11px] font-[650] text-[#1D2B25] mb-[7px]"
                >
                  Kategori
                </label>
                <select
                  id="exp-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-[43px] rounded-[7px] bg-[#FFFFFF] border border-[#E4EAE6] px-[13px] text-[12px] text-[#1D2B25] focus:outline-none focus:border-[#145B46]"
                >
                  <option value="Operasional">Operasional</option>
                  <option value="Bahan baku">Bahan baku</option>
                  <option value="Sayuran">Sayuran</option>
                  <option value="Bumbu">Bumbu</option>
                  <option value="Kemasan">Kemasan</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="exp-amount"
                  className="block text-[11px] font-[650] text-[#1D2B25] mb-[7px]"
                >
                  Jumlah (Rp)
                </label>
                <input
                  id="exp-amount"
                  type="number"
                  min="0"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setError('');
                  }}
                  placeholder="Masukkan jumlah..."
                  className="w-full h-[43px] rounded-[7px] bg-[#FFFFFF] border border-[#E4EAE6] px-[13px] text-[12px] text-[#1D2B25] placeholder-[#A0AAA4] focus:outline-none focus:border-[#145B46]"
                />
              </div>

              <div>
                <label
                  htmlFor="exp-date"
                  className="block text-[11px] font-[650] text-[#1D2B25] mb-[7px]"
                >
                  Tanggal
                </label>
                <input
                  id="exp-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-[43px] rounded-[7px] bg-[#FFFFFF] border border-[#E4EAE6] px-[13px] text-[12px] text-[#1D2B25] focus:outline-none focus:border-[#145B46]"
                />
              </div>

              <div>
                <label
                  htmlFor="exp-notes"
                  className="block text-[11px] font-[650] text-[#1D2B25] mb-[7px]"
                >
                  Catatan
                </label>
                <input
                  id="exp-notes"
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Masukkan catatan..."
                  className="w-full h-[43px] rounded-[7px] bg-[#FFFFFF] border border-[#E4EAE6] px-[13px] text-[12px] text-[#1D2B25] placeholder-[#A0AAA4] focus:outline-none focus:border-[#145B46]"
                />
              </div>

              <div className="pt-[24px]">
                <button
                  type="submit"
                  className="w-full h-[38px] rounded-[8px] bg-[#145B46] hover:bg-[#0F4736] text-[#FFFFFF] text-[12px] font-semibold flex items-center justify-start px-[14px] transition-colors cursor-pointer"
                >
                  Simpan data
                </button>
              </div>
            </form>
          </div>

          {/* Right: Recent Expenses List */}
          <div className="xl:col-span-5 rounded-[13px] bg-[#FFFFFF] border border-[#E4EAE6] p-[18px] md:p-[20px]">
            <h3 className="text-[14px] font-[650] text-[#1D2B25] mb-3">
              Pengeluaran Operasional Terbaru
            </h3>
            <div className="divide-y divide-[#E4EAE6]">
              {recentExpenses.map((exp) => (
                <div key={exp.id} className="py-3 flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="text-[12px] font-[600] text-[#1D2B25] truncate">
                      {exp.title}
                    </div>
                    <div className="text-[10px] text-[#738078] mt-0.5">
                      {exp.category} · {exp.updatedAt}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[12px] font-bold text-[#1D2B25]">
                      {formatRupiah(exp.amount)}
                    </span>
                    <StatusBadge label={exp.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

