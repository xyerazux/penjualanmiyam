import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useApp } from '../../services/AppContext';

export const ProfilKaryawanPage: React.FC = () => {
  const { user, settings, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <AppLayout
      title="Profil Pengguna"
      subtitle="Informasi akun dan sesi operasional Monitoring Penjualan"
    >
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-[24px] items-start">
        <div className="xl:col-span-7 rounded-[13px] bg-[#FFFFFF] border border-[#E4EAE6] p-[20px] md:p-[25px]">
          <div className="flex items-center gap-4 pb-5 border-b border-[#E4EAE6]">
            <div className="w-[54px] h-[54px] rounded-full bg-[#EAF4EF] flex items-center justify-center text-[20px] font-extrabold text-[#145B46]">
              {user?.avatarInitial || 'R'}
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-[#1D2B25]">
                {user?.name || 'Karyawan Operasional'}
              </h2>
              <p className="text-[12px] text-[#738078]">
                {user?.position || 'Kasir'} · {settings.storeName}
              </p>
              <div className="mt-1.5">
                <StatusBadge label="Aktif" />
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-[12px]">
            <div className="p-3.5 rounded-[9px] bg-[#F5F7F5]">
              <div className="text-[10px] font-bold text-[#738078] uppercase">Username</div>
              <div className="mt-1 font-semibold text-[#1D2B25]">
                {user?.username || 'karyawan'}
              </div>
            </div>
            <div className="p-3.5 rounded-[9px] bg-[#F5F7F5]">
              <div className="text-[10px] font-bold text-[#738078] uppercase">Email</div>
              <div className="mt-1 font-semibold text-[#1D2B25]">
                {user?.email || 'rina@monitoringpenjualan.id'}
              </div>
            </div>
            <div className="p-3.5 rounded-[9px] bg-[#F5F7F5]">
              <div className="text-[10px] font-bold text-[#738078] uppercase">Nomor Telepon</div>
              <div className="mt-1 font-semibold text-[#1D2B25]">
                {user?.phone || '0813-9876-5432'}
              </div>
            </div>
            <div className="p-3.5 rounded-[9px] bg-[#F5F7F5]">
              <div className="text-[10px] font-bold text-[#738078] uppercase">Jadwal Shift</div>
              <div className="mt-1 font-semibold text-[#1D2B25]">
                {user?.shift || 'Pagi (08.00 – 16.00)'}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-[#E4EAE6] flex items-center justify-between">
            <div className="text-[11px] text-[#738078]">
              Hak Akses: <strong className="text-[#1D2B25]">{user?.roleLabel}</strong>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="h-[38px] px-4 rounded-[8px] border border-[#B42318] text-[#B42318] text-[12px] font-semibold hover:bg-[#FDECEC] transition-colors cursor-pointer"
            >
              Keluar dari Akun
            </button>
          </div>
        </div>

        <div className="xl:col-span-5 rounded-[13px] bg-[#FFFFFF] border border-[#E4EAE6] p-[20px]">
          <h3 className="text-[14px] font-[650] text-[#1D2B25]">Informasi Kedai</h3>
          <div className="mt-3 space-y-2.5 text-[12px] text-[#738078]">
            <div>
              <span className="font-semibold text-[#1D2B25]">Nama Usaha:</span> {settings.storeName}
            </div>
            <div>
              <span className="font-semibold text-[#1D2B25]">Alamat:</span> {settings.address}
            </div>
            <div>
              <span className="font-semibold text-[#1D2B25]">Jam Operasional:</span>{' '}
              {settings.operationalHours}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
