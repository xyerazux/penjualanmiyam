import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { useApp } from '../../services/AppContext';
import { TransactionType } from '../../types';

export const FormKeuanganPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { finance, addFinance, updateFinance } = useApp();
  const navigate = useNavigate();

  const existingItem = id ? finance.find((f) => f.id === id) : undefined;

  const [title, setTitle] = useState(existingItem?.title || '');
  const [category, setCategory] = useState(existingItem?.category || 'Penjualan');
  const [type, setType] = useState<TransactionType>(existingItem?.type || 'Pemasukan');
  const [amount, setAmount] = useState(existingItem ? String(existingItem.amount) : '');
  const [date, setDate] = useState(existingItem?.date || '2026-11-12');
  const [notes, setNotes] = useState(existingItem?.notes || '');
  const [error, setError] = useState('');

  useEffect(() => {
    if (existingItem) {
      setTitle(existingItem.title);
      setCategory(existingItem.category);
      setType(existingItem.type);
      setAmount(String(existingItem.amount));
      setDate(existingItem.date);
      setNotes(existingItem.notes);
    }
  }, [existingItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Nama / judul transaksi wajib diisi.');
      return;
    }
    const numericAmount = Number(amount.toString().replace(/[^0-9]/g, ''));
    if (!numericAmount || numericAmount <= 0) {
      setError('Jumlah nominal transaksi harus lebih dari 0.');
      return;
    }

    if (existingItem) {
      updateFinance(existingItem.id, {
        title: title.trim(),
        category,
        type,
        amount: numericAmount,
        date,
        notes: notes.trim(),
      });
    } else {
      addFinance({
        title: title.trim(),
        category,
        type,
        amount: numericAmount,
        status: 'Normal',
        date,
        notes: notes.trim(),
      });
    }
    navigate('/keuangan');
  };

  return (
    <AppLayout
      title={existingItem ? 'Edit Transaksi' : 'Tambah Transaksi'}
      subtitle="Masukkan transaksi keuangan"
    >
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-[24px] items-start">
        {/* Left Form Card (Matches 04_Form_Keuangan.svg: 720px on desktop, rx 13) */}
        <div className="xl:col-span-8 rounded-[13px] bg-[#FFFFFF] border border-[#E4EAE6] p-[20px] md:p-[25px]">
          <h2 className="text-[14px] font-[650] text-[#1D2B25]">
            {existingItem ? 'Informasi edit transaksi' : 'Informasi tambah transaksi'}
          </h2>
          <p className="mt-2 text-[12px] font-normal text-[#738078]">
            Lengkapi data berikut dengan benar.
          </p>

          {error && (
            <div
              role="alert"
              className="mt-4 px-3.5 py-2.5 rounded-[8px] bg-[#FDECEC] text-[#B42318] text-[12px] font-semibold"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-[22px] space-y-[18px]">
            <div>
              <label
                htmlFor="fin-title"
                className="block text-[12px] font-[650] text-[#1D2B25] mb-[8px]"
              >
                Nama / Judul
              </label>
              <input
                id="fin-title"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setError('');
                }}
                placeholder="Masukkan nama / judul..."
                className="w-full h-[43px] rounded-[8px] bg-[#FFFFFF] border border-[#E4EAE6] px-[16px] text-[12px] text-[#1D2B25] placeholder-[#A0AAA4] focus:outline-none focus:border-[#145B46]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="fin-category"
                  className="block text-[12px] font-[650] text-[#1D2B25] mb-[8px]"
                >
                  Kategori
                </label>
                <select
                  id="fin-category"
                  value={category}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCategory(val);
                    if (val === 'Penjualan') setType('Pemasukan');
                    else if (val === 'Bahan baku' || val === 'Bumbu' || val === 'Operasional') {
                      setType('Pengeluaran');
                    }
                  }}
                  className="w-full h-[43px] rounded-[8px] bg-[#FFFFFF] border border-[#E4EAE6] px-[16px] text-[12px] text-[#1D2B25] focus:outline-none focus:border-[#145B46]"
                >
                  <option value="Penjualan">Penjualan</option>
                  <option value="Bahan baku">Bahan baku</option>
                  <option value="Sayuran">Sayuran</option>
                  <option value="Bumbu">Bumbu</option>
                  <option value="Operasional">Operasional</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="fin-type"
                  className="block text-[12px] font-[650] text-[#1D2B25] mb-[8px]"
                >
                  Jenis Transaksi
                </label>
                <select
                  id="fin-type"
                  value={type}
                  onChange={(e) => setType(e.target.value as TransactionType)}
                  className="w-full h-[43px] rounded-[8px] bg-[#FFFFFF] border border-[#E4EAE6] px-[16px] text-[12px] text-[#1D2B25] focus:outline-none focus:border-[#145B46]"
                >
                  <option value="Pemasukan">Pemasukan</option>
                  <option value="Pengeluaran">Pengeluaran</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="fin-amount"
                className="block text-[12px] font-[650] text-[#1D2B25] mb-[8px]"
              >
                Jumlah (Rp)
              </label>
              <input
                id="fin-amount"
                type="number"
                min="0"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError('');
                }}
                placeholder="Masukkan jumlah..."
                className="w-full h-[43px] rounded-[8px] bg-[#FFFFFF] border border-[#E4EAE6] px-[16px] text-[12px] text-[#1D2B25] placeholder-[#A0AAA4] focus:outline-none focus:border-[#145B46]"
              />
            </div>

            <div>
              <label
                htmlFor="fin-date"
                className="block text-[12px] font-[650] text-[#1D2B25] mb-[8px]"
              >
                Tanggal
              </label>
              <input
                id="fin-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-[43px] rounded-[8px] bg-[#FFFFFF] border border-[#E4EAE6] px-[16px] text-[12px] text-[#1D2B25] focus:outline-none focus:border-[#145B46]"
              />
            </div>

            <div>
              <label
                htmlFor="fin-notes"
                className="block text-[12px] font-[650] text-[#1D2B25] mb-[8px]"
              >
                Catatan
              </label>
              <input
                id="fin-notes"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Masukkan catatan..."
                className="w-full h-[43px] rounded-[8px] bg-[#FFFFFF] border border-[#E4EAE6] px-[16px] text-[12px] text-[#1D2B25] placeholder-[#A0AAA4] focus:outline-none focus:border-[#145B46]"
              />
            </div>

            <div className="pt-[24px] flex items-center gap-[15px]">
              <button
                type="submit"
                className="w-[140px] h-[38px] rounded-[8px] bg-[#145B46] hover:bg-[#0F4736] text-[#FFFFFF] text-[12px] font-semibold transition-colors cursor-pointer"
              >
                Simpan data
              </button>
              <button
                type="button"
                onClick={() => navigate('/keuangan')}
                className="w-[100px] h-[38px] rounded-[8px] bg-[#FFFFFF] border border-[#145B46] text-[#145B46] hover:bg-[#EAF4EF] text-[12px] font-semibold transition-colors cursor-pointer"
              >
                Batal
              </button>
            </div>
          </form>
        </div>

        {/* Right Petunjuk Card (Matches 04_Form_Keuangan.svg: 350px on desktop, rx 13) */}
        <div className="xl:col-span-4 rounded-[13px] bg-[#FFFFFF] border border-[#E4EAE6] p-[20px] md:min-h-[260px]">
          <h3 className="text-[14px] font-[650] text-[#1D2B25]">Petunjuk</h3>
          <ul className="mt-4 space-y-[14px] text-[11px] font-normal text-[#738078]">
            <li>• Periksa kembali data sebelum disimpan.</li>
            <li>• Gunakan satuan yang sesuai.</li>
            <li>• Perubahan tercatat di riwayat aktivitas.</li>
          </ul>
        </div>
      </div>
    </AppLayout>
  );
};

