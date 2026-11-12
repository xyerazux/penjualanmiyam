import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../services/AppContext';
import { LogOut, X } from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface MenuItem {
  label: string;
  path: string;
  matchPrefixes?: string[];
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const { user, settings, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const isOwner = user?.role === 'owner';

  const ownerMenus: MenuItem[] = [
    { label: 'Dashboard', path: '/dashboard', matchPrefixes: ['/dashboard'] },
    { label: 'Keuangan', path: '/keuangan', matchPrefixes: ['/keuangan'] },
    { label: 'Persediaan', path: '/persediaan', matchPrefixes: ['/persediaan'] },
    { label: 'Pembelian', path: '/pembelian', matchPrefixes: ['/pembelian'] },
    { label: 'Laporan', path: '/laporan', matchPrefixes: ['/laporan'] },
    { label: 'Karyawan', path: '/karyawan', matchPrefixes: ['/karyawan'] },
    { label: 'Pengaturan', path: '/pengaturan', matchPrefixes: ['/pengaturan'] },
    { label: 'Riwayat Aktivitas', path: '/riwayat', matchPrefixes: ['/riwayat'] },
  ];

  const employeeMenus: MenuItem[] = [
    { label: 'Dashboard', path: '/karyawan-dashboard', matchPrefixes: ['/karyawan-dashboard'] },
    { label: 'Pencatatan Penjualan', path: '/penjualan', matchPrefixes: ['/penjualan'] },
    ...(settings.allowEmployeeExpense && (user?.canRecordExpense ?? true)
      ? [{ label: 'Catat Pengeluaran', path: '/pengeluaran-karyawan', matchPrefixes: ['/pengeluaran-karyawan'] }]
      : []),
    { label: 'Penggunaan Bahan', path: '/penggunaan-bahan', matchPrefixes: ['/penggunaan-bahan'] },
    { label: 'Pengajuan Stok', path: '/pengajuan-stok', matchPrefixes: ['/pengajuan-stok'] },
    { label: 'Riwayat Aktivitas', path: '/riwayat', matchPrefixes: ['/riwayat'] },
    { label: 'Profil', path: '/profil', matchPrefixes: ['/profil'] },
  ];

  const activeMenus = isOwner ? ownerMenus : employeeMenus;

  const isMenuActive = (item: MenuItem) => {
    if (location.pathname === item.path) return true;
    if (item.matchPrefixes) {
      return item.matchPrefixes.some(
        (prefix) => location.pathname === prefix || location.pathname.startsWith(`${prefix}/`)
      );
    }
    return false;
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
    onClose?.();
  };

  const sidebarContent = (
    <aside
      aria-label="Navigasi Utama"
      className="w-[250px] shrink-0 min-h-screen bg-[#FFFFFF] border-r border-[#E4EAE6] flex flex-col justify-between select-none"
    >
      <div>
        {/* Brand Header */}
        <div className="px-[28px] pt-[24px] pb-[20px] flex items-start justify-between">
          <div>
            <div className="text-[20px] font-extrabold tracking-tight text-[#145B46] leading-[1.15]">
              Monitoring Penjualan
            </div>
            <div className="mt-1.5 text-[9px] font-bold tracking-[0.06em] text-[#738078] uppercase">
              SISTEM OPERASIONAL
            </div>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup menu"
              className="lg:hidden p-1 rounded-[7px] text-[#738078] hover:bg-[#F5F7F5]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Main Navigation */}
        <div className="mt-2">
          <div className="px-[28px] mb-2 text-[10px] font-bold tracking-[0.04em] text-[#738078] uppercase">
            MENU UTAMA
          </div>
          <nav className="px-[16px] flex flex-col gap-[9px]">
            {activeMenus.map((item) => {
              const active = isMenuActive(item);
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => onClose?.()}
                  className={`relative flex items-center h-[40px] px-[18px] rounded-[9px] text-[13px] transition-colors ${
                    active
                      ? 'bg-[#EAF4EF] text-[#145B46] font-[650]'
                      : 'text-[#738078] font-medium hover:bg-[#F5F7F5] hover:text-[#1D2B25]'
                  }`}
                >
                  {active && (
                    <span
                      className="absolute left-0 top-0 w-[4px] h-[40px] rounded-[2px] bg-[#145B46]"
                      aria-hidden="true"
                    />
                  )}
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Account Footer matching SVG */}
      <div className="px-[20px] pb-[28px] pt-[16px]">
        <div className="border-t border-[#E4EAE6] pt-[20px]">
          <div className="px-[8px] text-[10px] font-bold tracking-[0.04em] text-[#738078] uppercase">
            AKUN
          </div>

          <div className="mt-3.5 px-[5px] flex items-center gap-3">
            <div className="w-[36px] h-[36px] rounded-full bg-[#EAF4EF] flex items-center justify-center text-[14px] font-bold text-[#145B46] shrink-0">
              {user?.avatarInitial || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[12px] font-[650] text-[#1D2B25] truncate">
                {user?.name || 'Pengguna'}
              </div>
              <div className="text-[10px] font-normal text-[#738078] truncate">
                {user?.roleLabel || 'Pengguna aktif'}
              </div>
            </div>
          </div>

          <div className="mt-4 px-[5px]">
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center justify-center gap-1.5 h-[34px] w-full rounded-[8px] border border-[#E4EAE6] bg-white text-[11px] font-semibold text-[#738078] hover:text-[#B42318] hover:border-[#B42318]/40 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop persistent sidebar */}
      <div className="hidden lg:block shrink-0">{sidebarContent}</div>

      {/* Tablet / Mobile slide-over drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/35"
            onClick={onClose}
            aria-hidden="true"
          />
          <div className="relative z-10 flex">{sidebarContent}</div>
        </div>
      )}
    </>
  );
};
