import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { useApp } from '../../services/AppContext';

export const FormPersediaanPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { inventory, addInventory, updateInventory } = useApp();
  const navigate = useNavigate();

  const existingItem = id ? inventory.find((i) => i.id === id) : undefined;

  const [name, setName] = useState(existingItem?.name || '');
  const [category, setCategory] = useState(existingItem?.category || 'Bahan baku');
  const [quantity, setQuantity] = useState(existingItem ? String(existingItem.quantity) : '');
  const [unit, setUnit] = useState(existingItem?.unit || 'kg');
  const [minStock, setMinStock] = useState(existingItem ? String(existingItem.minStock) : '3');
  const [date, setDate] = useState(existingItem?.date || '2026-11-12');
  const [notes, setNotes] = useState(existingItem?.notes || '');
  const [error, setError] = useState('');

  useEffect(() => {
    if (existingItem) {
      setName(existingItem.name);
      setCategory(existingItem.category);
      setQuantity(String(existingItem.quantity));
      setUnit(existingItem.unit);
      setMinStock(String(existingItem.minStock));
      setDate(existingItem.date);
      setNotes(existingItem.notes);
    }
  }, [existingItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Nama bahan wajib diisi.');
      return;
    }
    const parsedQty = Number(quantity.toString().replace(',', '.'));
    if (isNaN(parsedQty) || parsedQty < 0) {
      setError('Jumlah stok bahan harus berupa angka valid.');
      return;
    }
    const parsedMin = Number(minStock.toString().replace(',', '.')) || 1;

    if (existingItem) {
      updateInventory(existingItem.id, {
        name: name.trim(),
        category,
        quantity: parsedQty,
        unit,
        minStock: parsedMin,
        date,
        notes: notes.trim(),
      });
    } else {
      addInventory({
        name: name.trim(),
        category,
        quantity: parsedQty,
        unit,
        minStock: parsedMin,
        date,
        notes: notes.trim(),
      });
    }
    navigate('/persediaan');
  };

  return (
    <AppLayout
      title={existingItem ? 'Edit Bahan' : 'Tambah Bahan'}
      subtitle="Tambahkan bahan ke daftar persediaan"
    >
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-[24px] items-start">
        {/* Left Form Card (Matches 06_Form_Persediaan.svg) */}
        <div className="xl:col-span-8 rounded-[13px] bg-[#FFFFFF] border border-[#E4EAE6] p-[20px] md:p-[25px]">
          <h2 className="text-[14px] font-[650] text-[#1D2B25]">
            {existingItem ? 'Informasi edit bahan' : 'Informasi tambah bahan'}
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
                htmlFor="inv-name"
                className="block text-[12px] font-[650] text-[#1D2B25] mb-[8px]"
              >
                Nama / Judul
              </label>
              <input
                id="inv-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                placeholder="Masukkan nama / judul..."
                className="w-full h-[43px] rounded-[8px] bg-[#FFFFFF] border border-[#E4EAE6] px-[16px] text-[12px] text-[#1D2B25] placeholder-[#A0AAA4] focus:outline-none focus:border-[#145B46]"
              />
            </div>

            <div>
              <label
                htmlFor="inv-category"
                className="block text-[12px] font-[650] text-[#1D2B25] mb-[8px]"
              >
                Kategori
              </label>
              <select
                id="inv-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-[43px] rounded-[8px] bg-[#FFFFFF] border border-[#E4EAE6] px-[16px] text-[12px] text-[#1D2B25] focus:outline-none focus:border-[#145B46]"
              >
                <option value="Bahan baku">Bahan baku</option>
                <option value="Sayuran">Sayuran</option>
                <option value="Bumbu">Bumbu</option>
                <option value="Operasional">Operasional</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="inv-qty"
                  className="block text-[12px] font-[650] text-[#1D2B25] mb-[8px]"
                >
                  Jumlah
                </label>
                <input
                  id="inv-qty"
                  type="number"
                  step="0.1"
                  min="0"
                  value={quantity}
                  onChange={(e) => {
                    setQuantity(e.target.value);
                    setError('');
                  }}
                  placeholder="Masukkan jumlah..."
                  className="w-full h-[43px] rounded-[8px] bg-[#FFFFFF] border border-[#E4EAE6] px-[16px] text-[12px] text-[#1D2B25] placeholder-[#A0AAA4] focus:outline-none focus:border-[#145B46]"
                />
              </div>

              <div>
                <label
                  htmlFor="inv-unit"
                  className="block text-[12px] font-[650] text-[#1D2B25] mb-[8px]"
                >
                  Satuan
                </label>
                <select
                  id="inv-unit"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full h-[43px] rounded-[8px] bg-[#FFFFFF] border border-[#E4EAE6] px-[16px] text-[12px] text-[#1D2B25] focus:outline-none focus:border-[#145B46]"
                >
                  <option value="kg">kg</option>
                  <option value="liter">liter</option>
                  <option value="pak">pak</option>
                  <option value="pcs">pcs</option>
                  <option value="tabung">tabung</option>
                  <option value="botol">botol</option>
                  <option value="butir">butir</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="inv-min"
                  className="block text-[12px] font-[650] text-[#1D2B25] mb-[8px]"
                >
                  Batas Minimum Stok
                </label>
                <input
                  id="inv-min"
                  type="number"
                  step="0.1"
                  min="0"
                  value={minStock}
                  onChange={(e) => setMinStock(e.target.value)}
                  placeholder="Min. stok"
                  className="w-full h-[43px] rounded-[8px] bg-[#FFFFFF] border border-[#E4EAE6] px-[16px] text-[12px] text-[#1D2B25] placeholder-[#A0AAA4] focus:outline-none focus:border-[#145B46]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="inv-date"
                className="block text-[12px] font-[650] text-[#1D2B25] mb-[8px]"
              >
                Tanggal
              </label>
              <input
                id="inv-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-[43px] rounded-[8px] bg-[#FFFFFF] border border-[#E4EAE6] px-[16px] text-[12px] text-[#1D2B25] focus:outline-none focus:border-[#145B46]"
              />
            </div>

            <div>
              <label
                htmlFor="inv-notes"
                className="block text-[12px] font-[650] text-[#1D2B25] mb-[8px]"
              >
                Catatan
              </label>
              <input
                id="inv-notes"
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
                onClick={() => navigate('/persediaan')}
                className="w-[100px] h-[38px] rounded-[8px] bg-[#FFFFFF] border border-[#145B46] text-[#145B46] hover:bg-[#EAF4EF] text-[12px] font-semibold transition-colors cursor-pointer"
              >
                Batal
              </button>
            </div>
          </form>
        </div>

        {/* Right Petunjuk Card (Matches 06_Form_Persediaan.svg) */}
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

