import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { useApp } from '../../services/AppContext';
import { UserRole } from '../../types';

export const FormKaryawanPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { employees, addEmployee, updateEmployee } = useApp();
  const navigate = useNavigate();

  const existingEmp = id ? employees.find((e) => e.id === id) : undefined;

  const [name, setName] = useState(existingEmp?.name || '');
  const [position, setPosition] = useState(existingEmp?.position || 'Kasir');
  const [role, setRole] = useState<UserRole>(existingEmp?.role || 'employee');
  const [shift, setShift] = useState(existingEmp?.shift || 'Pagi (08.00 – 16.00)');
  const [phone, setPhone] = useState(existingEmp?.phone || '0812-3456-7890');
  const [joinDate, setJoinDate] = useState(existingEmp?.joinDate || '2026-11-12');
  const [notes, setNotes] = useState(existingEmp?.notes || '');
  const [canRecordExpense, setCanRecordExpense] = useState(existingEmp?.canRecordExpense ?? true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (existingEmp) {
      setName(existingEmp.name);
      setPosition(existingEmp.position);
      setRole(existingEmp.role);
      setShift(existingEmp.shift);
      setPhone(existingEmp.phone);
      setJoinDate(existingEmp.joinDate);
      setNotes(existingEmp.notes);
      setCanRecordExpense(existingEmp.canRecordExpense);
    }
  }, [existingEmp]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Nama karyawan wajib diisi.');
      return;
    }

    const emailSlug = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');

    if (existingEmp) {
      updateEmployee(existingEmp.id, {
        name: name.trim(),
        position,
        role,
        shift,
        phone,
        joinDate,
        canRecordExpense,
        notes: notes.trim(),
      });
    } else {
      addEmployee({
        name: name.trim(),
        role,
        position,
        phone,
        email: `${emailSlug || 'staf'}@monitoringpenjualan.id`,
        shift,
        status: 'Normal',
        joinDate,
        canRecordExpense,
        notes: notes.trim(),
      });
    }
    navigate('/karyawan');
  };

  return (
    <AppLayout
      title={existingEmp ? 'Edit Karyawan' : 'Tambah Karyawan'}
      subtitle="Tambahkan anggota tim Monitoring Penjualan"
    >
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-[24px] items-start">
        {/* Left Form Card (Matches 11_Form_Karyawan.svg) */}
        <div className="xl:col-span-8 rounded-[13px] bg-[#FFFFFF] border border-[#E4EAE6] p-[20px] md:p-[25px]">
          <h2 className="text-[14px] font-[650] text-[#1D2B25]">
            {existingEmp ? 'Informasi edit karyawan' : 'Informasi tambah karyawan'}
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
                htmlFor="emp-name"
                className="block text-[12px] font-[650] text-[#1D2B25] mb-[8px]"
              >
                Nama / Judul
              </label>
              <input
                id="emp-name"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="emp-position"
                  className="block text-[12px] font-[650] text-[#1D2B25] mb-[8px]"
                >
                  Kategori (Posisi / Jabatan)
                </label>
                <select
                  id="emp-position"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full h-[43px] rounded-[8px] bg-[#FFFFFF] border border-[#E4EAE6] px-[16px] text-[12px] text-[#1D2B25] focus:outline-none focus:border-[#145B46]"
                >
                  <option value="Kasir">Kasir</option>
                  <option value="Gudang & Persediaan">Gudang & Persediaan</option>
                  <option value="Juru Masak Utama">Juru Masak Utama</option>
                  <option value="Asisten Dapur">Asisten Dapur</option>
                  <option value="Operasional & Kemasan">Operasional & Kemasan</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="emp-role"
                  className="block text-[12px] font-[650] text-[#1D2B25] mb-[8px]"
                >
                  Hak Akses (Role)
                </label>
                <select
                  id="emp-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full h-[43px] rounded-[8px] bg-[#FFFFFF] border border-[#E4EAE6] px-[16px] text-[12px] text-[#1D2B25] focus:outline-none focus:border-[#145B46]"
                >
                  <option value="employee">Karyawan (Operasional)</option>
                  <option value="owner">Pemilik (Akses Penuh)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="emp-shift"
                  className="block text-[12px] font-[650] text-[#1D2B25] mb-[8px]"
                >
                  Jumlah / Jam Shift Kerja
                </label>
                <input
                  id="emp-shift"
                  type="text"
                  value={shift}
                  onChange={(e) => setShift(e.target.value)}
                  placeholder="Masukkan jadwal shift..."
                  className="w-full h-[43px] rounded-[8px] bg-[#FFFFFF] border border-[#E4EAE6] px-[16px] text-[12px] text-[#1D2B25] placeholder-[#A0AAA4] focus:outline-none focus:border-[#145B46]"
                />
              </div>

              <div>
                <label
                  htmlFor="emp-phone"
                  className="block text-[12px] font-[650] text-[#1D2B25] mb-[8px]"
                >
                  Nomor Telepon
                </label>
                <input
                  id="emp-phone"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08xx-xxxx-xxxx"
                  className="w-full h-[43px] rounded-[8px] bg-[#FFFFFF] border border-[#E4EAE6] px-[16px] text-[12px] text-[#1D2B25] placeholder-[#A0AAA4] focus:outline-none focus:border-[#145B46]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="emp-date"
                className="block text-[12px] font-[650] text-[#1D2B25] mb-[8px]"
              >
                Tanggal Bergabung
              </label>
              <input
                id="emp-date"
                type="date"
                value={joinDate}
                onChange={(e) => setJoinDate(e.target.value)}
                className="w-full h-[43px] rounded-[8px] bg-[#FFFFFF] border border-[#E4EAE6] px-[16px] text-[12px] text-[#1D2B25] focus:outline-none focus:border-[#145B46]"
              />
            </div>

            <div>
              <label
                htmlFor="emp-notes"
                className="block text-[12px] font-[650] text-[#1D2B25] mb-[8px]"
              >
                Catatan
              </label>
              <input
                id="emp-notes"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Masukkan catatan..."
                className="w-full h-[43px] rounded-[8px] bg-[#FFFFFF] border border-[#E4EAE6] px-[16px] text-[12px] text-[#1D2B25] placeholder-[#A0AAA4] focus:outline-none focus:border-[#145B46]"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                id="emp-can-expense"
                type="checkbox"
                checked={canRecordExpense}
                onChange={(e) => setCanRecordExpense(e.target.checked)}
                className="w-4 h-4 accent-[#145B46] rounded cursor-pointer"
              />
              <label
                htmlFor="emp-can-expense"
                className="text-[12px] font-medium text-[#1D2B25] cursor-pointer"
              >
                Izinkan karyawan ini mencatat pengeluaran operasional
              </label>
            </div>

            <div className="pt-[20px] flex items-center gap-[15px]">
              <button
                type="submit"
                className="w-[140px] h-[38px] rounded-[8px] bg-[#145B46] hover:bg-[#0F4736] text-[#FFFFFF] text-[12px] font-semibold transition-colors cursor-pointer"
              >
                Simpan data
              </button>
              <button
                type="button"
                onClick={() => navigate('/karyawan')}
                className="w-[100px] h-[38px] rounded-[8px] bg-[#FFFFFF] border border-[#145B46] text-[#145B46] hover:bg-[#EAF4EF] text-[12px] font-semibold transition-colors cursor-pointer"
              >
                Batal
              </button>
            </div>
          </form>
        </div>

        {/* Right Petunjuk Card (Matches 11_Form_Karyawan.svg) */}
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

