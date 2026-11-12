import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { useApp } from '../../services/AppContext';
import { formatRupiah } from '../../utils/formatters';

export const FormPembelianPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { purchases, inventory, addPurchase, updatePurchase } = useApp();
  const navigate = useNavigate();

  const existingItem = id ? purchases.find((p) => p.id === id) : undefined;

  const [itemName, setItemName] = useState(existingItem?.itemName || '');
  const [category, setCategory] = useState(existingItem?.category || 'Bahan baku');
  const [supplier, setSupplier] = useState(existingItem?.supplier || 'UD Sumber Mie Segar');
  const [quantity, setQuantity] = useState(existingItem ? String(existingItem.quantity) : '');
  const [unit, setUnit] = useState(existingItem?.unit || 'kg');
  const [unitPrice, setUnitPrice] = useState(
    existingItem ? String(existingItem.unitPrice) : '18000'
  );
  const [date, setDate] = useState(existingItem?.date || '2026-11-12');
  const [notes, setNotes] = useState(existingItem?.notes || '');
  const [error, setError] = useState('');

  useEffect(() => {
    if (existingItem) {
      setItemName(existingItem.itemName);
      setCategory(existingItem.category);
      setSupplier(existingItem.supplier);
      setQuantity(String(existingItem.quantity));
      setUnit(existingItem.unit);
      setUnitPrice(String(existingItem.unitPrice));
      setDate(existingItem.date);
      setNotes(existingItem.notes);
    }
  }, [existingItem]);

  const parsedQty = Number(quantity.toString().replace(',', '.')) || 0;
  const parsedUnitPrice = Number(unitPrice.toString().replace(/[^0-9]/g, '')) || 0;
  const totalCalculated = Math.round(parsedQty * parsedUnitPrice);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) {
      setError('Nama bahan yang dibeli wajib diisi.');
      return;
    }
    if (!supplier.trim()) {
      setError('Nama pemasok wajib diisi.');
      return;
    }
    if (parsedQty <= 0) {
      setError('Jumlah pembelian harus lebih dari 0.');
      return;
    }

    const matchedInv = inventory.find(
      (i) => i.name.toLowerCase() === itemName.trim().toLowerCase()
    );

    if (existingItem) {
      updatePurchase(existingItem.id, {
        itemName: itemName.trim(),
        category,
        supplier: supplier.trim(),
        quantity: parsedQty,
        unit,
        unitPrice: parsedUnitPrice,
        totalPrice: totalCalculated || existingItem.totalPrice,
        date,
        notes: notes.trim(),
      });
    } else {
      addPurchase({
        itemName: itemName.trim(),
        category,
        supplier: supplier.trim(),
        quantity: parsedQty,
        unit,
        unitPrice: parsedUnitPrice,
        totalPrice: totalCalculated || 50000,
        status: 'Normal',
        date,
        notes: notes.trim(),
        inventoryItemId: matchedInv?.id,
      });
    }
    navigate('/pembelian');
  };

  return (
    <AppLayout
      title={existingItem ? 'Edit Pembelian' : 'Tambah Pembelian'}
      subtitle="Catat pembelian bahan dari pemasok"
    >
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-[24px] items-start">
        {/* Left Form Card (Matches 08_Form_Pembelian.svg) */}
        <div className="xl:col-span-8 rounded-[13px] bg-[#FFFFFF] border border-[#E4EAE6] p-[20px] md:p-[25px]">
          <h2 className="text-[14px] font-[650] text-[#1D2B25]">
            {existingItem ? 'Informasi edit pembelian' : 'Informasi tambah pembelian'}
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
                htmlFor="pur-name"
                className="block text-[12px] font-[650] text-[#1D2B25] mb-[8px]"
              >
                Nama / Judul
              </label>
              <input
                id="pur-name"
                list="inventory-suggestions"
                type="text"
                value={itemName}
                onChange={(e) => {
                  const val = e.target.value;
                  setItemName(val);
                  setError('');
                  const found = inventory.find(
                    (i) => i.name.toLowerCase() === val.toLowerCase()
                  );
                  if (found) {
                    setCategory(found.category);
                    setUnit(found.unit);
                  }
                }}
                placeholder="Masukkan nama / judul..."
                className="w-full h-[43px] rounded-[8px] bg-[#FFFFFF] border border-[#E4EAE6] px-[16px] text-[12px] text-[#1D2B25] placeholder-[#A0AAA4] focus:outline-none focus:border-[#145B46]"
              />
              <datalist id="inventory-suggestions">
                {inventory.map((inv) => (
                  <option key={inv.id} value={inv.name} />
                ))}
              </datalist>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="pur-category"
                  className="block text-[12px] font-[650] text-[#1D2B25] mb-[8px]"
                >
                  Kategori
                </label>
                <select
                  id="pur-category"
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

              <div>
                <label
                  htmlFor="pur-supplier"
                  className="block text-[12px] font-[650] text-[#1D2B25] mb-[8px]"
                >
                  Pemasok
                </label>
                <input
                  id="pur-supplier"
                  type="text"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  placeholder="Masukkan nama pemasok..."
                  className="w-full h-[43px] rounded-[8px] bg-[#FFFFFF] border border-[#E4EAE6] px-[16px] text-[12px] text-[#1D2B25] placeholder-[#A0AAA4] focus:outline-none focus:border-[#145B46]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="pur-qty"
                  className="block text-[12px] font-[650] text-[#1D2B25] mb-[8px]"
                >
                  Jumlah ({unit})
                </label>
                <input
                  id="pur-qty"
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
                  htmlFor="pur-price"
                  className="block text-[12px] font-[650] text-[#1D2B25] mb-[8px]"
                >
                  Harga Satuan (Rp)
                </label>
                <input
                  id="pur-price"
                  type="number"
                  min="0"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  placeholder="Harga per satuan..."
                  className="w-full h-[43px] rounded-[8px] bg-[#FFFFFF] border border-[#E4EAE6] px-[16px] text-[12px] text-[#1D2B25] placeholder-[#A0AAA4] focus:outline-none focus:border-[#145B46]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-[650] text-[#1D2B25] mb-[8px]">
                  Total Harga
                </label>
                <div className="w-full h-[43px] rounded-[8px] bg-[#F5F7F5] border border-[#E4EAE6] px-[16px] flex items-center text-[12px] font-bold text-[#145B46]">
                  {formatRupiah(totalCalculated)}
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="pur-date"
                className="block text-[12px] font-[650] text-[#1D2B25] mb-[8px]"
              >
                Tanggal
              </label>
              <input
                id="pur-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-[43px] rounded-[8px] bg-[#FFFFFF] border border-[#E4EAE6] px-[16px] text-[12px] text-[#1D2B25] focus:outline-none focus:border-[#145B46]"
              />
            </div>

            <div>
              <label
                htmlFor="pur-notes"
                className="block text-[12px] font-[650] text-[#1D2B25] mb-[8px]"
              >
                Catatan
              </label>
              <input
                id="pur-notes"
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
                onClick={() => navigate('/pembelian')}
                className="w-[100px] h-[38px] rounded-[8px] bg-[#FFFFFF] border border-[#145B46] text-[#145B46] hover:bg-[#EAF4EF] text-[12px] font-semibold transition-colors cursor-pointer"
              >
                Batal
              </button>
            </div>
          </form>
        </div>

        {/* Right Petunjuk Card (Matches 08_Form_Pembelian.svg) */}
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

