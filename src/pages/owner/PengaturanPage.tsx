import React, { useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useApp } from '../../services/AppContext';

export const PengaturanPage: React.FC = () => {
  const { settings, updateSettings } = useApp();

  const [storeName, setStoreName] = useState(settings.storeName);
  const [address, setAddress] = useState(settings.address);
  const [phone, setPhone] = useState(settings.phone);
  const [operationalHours, setOperationalHours] = useState(settings.operationalHours);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      storeName: storeName.trim() || 'Mie Ayam Monitoring Penjualan',
      address: address.trim(),
      phone: phone.trim(),
      operationalHours: operationalHours.trim(),
    });
  };

  return (
    <AppLayout
      title="Pengaturan"
      subtitle="Atur informasi dan preferensi usaha"
    >
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-[24px] items-start">
        {/* Left Card: Profil Usaha (Matches 12_Pengaturan.svg: 700x650 on desktop, rx 13) */}
        <div className="xl:col-span-8 rounded-[13px] bg-[#FFFFFF] border border-[#E4EAE6] p-[20px] md:p-[25px] md:min-h-[580px]">
          <h2 className="text-[14px] font-[650] text-[#1D2B25]">Profil usaha</h2>

          <form onSubmit={handleSaveProfile} className="mt-[28px] space-y-[26px]">
            <div>
              <label
                htmlFor="set-store-name"
                className="block text-[12px] font-[650] text-[#1D2B25] mb-[10px]"
              >
                Nama usaha
              </label>
              <input
                id="set-store-name"
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full h-[42px] rounded-[8px] bg-[#FFFFFF] border border-[#E4EAE6] px-[18px] text-[12px] text-[#738078] focus:text-[#1D2B25] focus:outline-none focus:border-[#145B46]"
              />
            </div>

            <div>
              <label
                htmlFor="set-address"
                className="block text-[12px] font-[650] text-[#1D2B25] mb-[10px]"
              >
                Alamat
              </label>
              <input
                id="set-address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full h-[42px] rounded-[8px] bg-[#FFFFFF] border border-[#E4EAE6] px-[18px] text-[12px] text-[#738078] focus:text-[#1D2B25] focus:outline-none focus:border-[#145B46]"
              />
            </div>

            <div>
              <label
                htmlFor="set-phone"
                className="block text-[12px] font-[650] text-[#1D2B25] mb-[10px]"
              >
                Nomor telepon
              </label>
              <input
                id="set-phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-[42px] rounded-[8px] bg-[#FFFFFF] border border-[#E4EAE6] px-[18px] text-[12px] text-[#738078] focus:text-[#1D2B25] focus:outline-none focus:border-[#145B46]"
              />
            </div>

            <div>
              <label
                htmlFor="set-hours"
                className="block text-[12px] font-[650] text-[#1D2B25] mb-[10px]"
              >
                Jam operasional
              </label>
              <input
                id="set-hours"
                type="text"
                value={operationalHours}
                onChange={(e) => setOperationalHours(e.target.value)}
                className="w-full h-[42px] rounded-[8px] bg-[#FFFFFF] border border-[#E4EAE6] px-[18px] text-[12px] text-[#738078] focus:text-[#1D2B25] focus:outline-none focus:border-[#145B46]"
              />
            </div>

            <div className="pt-[24px]">
              <button
                type="submit"
                className="w-[170px] h-[38px] rounded-[8px] bg-[#145B46] hover:bg-[#0F4736] text-[#FFFFFF] text-[12px] font-semibold flex items-center justify-start px-[14px] transition-colors cursor-pointer"
              >
                Simpan perubahan
              </button>
            </div>
          </form>
        </div>

        {/* Right Card: Preferensi (Matches 12_Pengaturan.svg: 370x245 on desktop, rx 13) */}
        <div className="xl:col-span-4 rounded-[13px] bg-[#FFFFFF] border border-[#E4EAE6] p-[20px] md:min-h-[245px]">
          <h3 className="text-[14px] font-[650] text-[#1D2B25]">Preferensi</h3>

          <div className="mt-4 divide-y divide-[#E4EAE6]">
            <div className="py-[14px] flex items-center justify-between gap-2">
              <span className="text-[12px] font-semibold text-[#1D2B25]">
                Notifikasi stok menipis
              </span>
              <StatusBadge
                label={settings.lowStockNotification ? 'Aktif' : 'Nonaktif'}
                variant={settings.lowStockNotification ? 'success' : 'neutral'}
                onClick={() =>
                  updateSettings({ lowStockNotification: !settings.lowStockNotification })
                }
              />
            </div>

            <div className="py-[14px] flex items-center justify-between gap-2">
              <span className="text-[12px] font-semibold text-[#1D2B25]">
                Pengingat laporan harian
              </span>
              <StatusBadge
                label={settings.dailyReportReminder ? 'Aktif' : 'Nonaktif'}
                variant={settings.dailyReportReminder ? 'success' : 'neutral'}
                onClick={() =>
                  updateSettings({ dailyReportReminder: !settings.dailyReportReminder })
                }
              />
            </div>

            <div className="py-[14px] flex items-center justify-between gap-2">
              <span className="text-[12px] font-semibold text-[#1D2B25]">
                Izin pengeluaran karyawan
              </span>
              <StatusBadge
                label={settings.allowEmployeeExpense ? 'Aktif' : 'Nonaktif'}
                variant={settings.allowEmployeeExpense ? 'success' : 'neutral'}
                onClick={() =>
                  updateSettings({ allowEmployeeExpense: !settings.allowEmployeeExpense })
                }
              />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
