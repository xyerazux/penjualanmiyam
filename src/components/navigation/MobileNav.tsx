import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../services/AppContext';

interface MobileHeaderProps {
  title: string;
  onOpenDrawer: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ title, onOpenDrawer }) => {
  return (
    <header className="md:hidden sticky top-0 z-30 w-full h-[82px] bg-[#FFFFFF] border-b border-[#E4EAE6] px-[20px] flex items-center justify-between">
      <div className="min-w-0">
        <div className="text-[20px] font-extrabold text-[#145B46] leading-tight truncate">
          Monitoring Penjualan
        </div>
        <div className="mt-0.5 text-[12px] font-[650] text-[#1D2B25] truncate">{title}</div>
      </div>

      <button
        type="button"
        onClick={onOpenDrawer}
        aria-label="Buka menu navigasi"
        className="w-[32px] h-[32px] rounded-full flex items-center justify-center text-[16px] font-bold text-[#145B46] hover:bg-[#EAF4EF] cursor-pointer shrink-0"
      >
        ●
      </button>
    </header>
  );
};

export const MobileBottomNav: React.FC = () => {
  const { user } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const isOwner = user?.role === 'owner';
  const path = location.pathname;

  const navItems = [
    {
      id: 'home',
      icon: '⌂',
      label: 'Home',
      target: isOwner ? '/dashboard' : '/karyawan-dashboard',
      active: path === '/dashboard' || path === '/karyawan-dashboard',
    },
    {
      id: 'data',
      icon: '▦',
      label: 'Data',
      target: isOwner ? '/keuangan' : '/penggunaan-bahan',
      active:
        path === '/keuangan' ||
        path === '/persediaan' ||
        path === '/pembelian' ||
        path === '/laporan' ||
        path === '/karyawan' ||
        path === '/penggunaan-bahan' ||
        path === '/pengajuan-stok',
    },
    {
      id: 'tambah',
      icon: '＋',
      label: 'Tambah',
      target: isOwner ? '/keuangan/tambah' : '/penjualan',
      active:
        path.includes('/tambah') ||
        path === '/penjualan' ||
        path === '/pengeluaran-karyawan',
    },
    {
      id: 'riwayat',
      icon: '◷',
      label: 'Riwayat',
      target: '/riwayat',
      active: path === '/riwayat',
    },
    {
      id: 'profil',
      icon: '○',
      label: 'Profil',
      target: isOwner ? '/pengaturan' : '/profil',
      active: path === '/pengaturan' || path === '/profil',
    },
  ];

  return (
    <nav
      aria-label="Navigasi Bawah Mobile"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-[64px] bg-[#FFFFFF] border-t border-[#E4EAE6] grid grid-cols-5 select-none"
    >
      {navItems.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => navigate(item.target)}
          className={`flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer ${
            item.active ? 'text-[#145B46]' : 'text-[#738078] hover:text-[#1D2B25]'
          }`}
        >
          <span className="text-[17px] font-bold leading-none">{item.icon}</span>
          <span className="text-[9px] font-semibold leading-none mt-1">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};
