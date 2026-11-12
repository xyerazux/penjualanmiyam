import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../navigation/Sidebar';
import { MobileHeader, MobileBottomNav } from '../navigation/MobileNav';
import { ToastContainer } from '../ui/ToastContainer';
import { useApp } from '../../services/AppContext';
import { Menu } from 'lucide-react';

interface AppLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
  mobileSubNav?: Array<{ label: string; path: string; active: boolean }>;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  title,
  subtitle,
  children,
  actionButton,
  mobileSubNav,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showNotifPopover, setShowNotifPopover] = useState(false);
  const { globalSearch, setGlobalSearch, metrics, activities } = useApp();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#F5F7F5] text-[#1D2B25] flex flex-col lg:flex-row overflow-x-hidden">
      {/* Desktop Sidebar & Tablet/Mobile Drawer */}
      <Sidebar isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Mobile Top Header (Matches M01–M06 SVGs) */}
      <MobileHeader title={title} onOpenDrawer={() => setDrawerOpen(true)} />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col pb-[80px] md:pb-8">
        {/* Desktop & Tablet Header (Matches 02–15 Desktop SVGs) */}
        <header className="hidden md:flex items-start justify-between px-6 lg:px-[40px] pt-[24px] pb-[14px]">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Buka sidebar"
              className="lg:hidden p-2 rounded-[9px] bg-white border border-[#E4EAE6] text-[#1D2B25] hover:bg-[#EAF4EF] cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-[24px] font-[750] text-[#1D2B25] leading-tight truncate">
                {title}
              </h1>
              <p className="mt-1 text-[12px] font-normal text-[#738078] truncate">{subtitle}</p>
            </div>
          </div>

          {/* Right Search Box & Status Dot matching SVG (x=1170, width=220, height=40) */}
          <div className="relative flex items-center gap-3 shrink-0">
            <div className="relative flex items-center w-[220px] h-[40px] rounded-[9px] bg-[#FFFFFF] border border-[#E4EAE6] px-3">
              <span className="text-[12px] text-[#738078] mr-2 select-none" aria-hidden="true">
                ⌕
              </span>
              <input
                type="search"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Cari sesuatu..."
                aria-label="Cari sesuatu"
                className="w-full bg-transparent text-[12px] text-[#1D2B25] placeholder-[#738078] focus:outline-none pr-5"
              />
              <button
                type="button"
                onClick={() => setShowNotifPopover((prev) => !prev)}
                aria-label="Status operasional dan notifikasi"
                className="absolute right-2.5 text-[13px] font-bold text-[#145B46] cursor-pointer"
                title="Notifikasi & Ringkasan Status"
              >
                ●
              </button>
            </div>
            <div className="w-[1px] h-[40px] bg-[#E4EAE6]" aria-hidden="true" />

            {/* Notification Popover when clicking ● */}
            {showNotifPopover && (
              <div className="absolute right-0 top-[48px] w-[300px] rounded-[13px] bg-white border border-[#E4EAE6] shadow-lg p-3.5 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-[#E4EAE6]">
                  <span className="text-[12px] font-bold text-[#1D2B25]">
                    Status Monitoring Penjualan
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EAF4EF] text-[#145B46]">
                    Aktif
                  </span>
                </div>
                {metrics.lowStockCount > 0 && (
                  <div className="mt-2.5 p-2.5 rounded-[9px] bg-[#FFF2E5] text-[#A96B22] text-[11px]">
                    <div className="font-semibold">
                      Peringatan: {metrics.lowStockCount} bahan stok menipis
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowNotifPopover(false);
                        navigate('/persediaan');
                      }}
                      className="mt-1 underline font-semibold cursor-pointer"
                    >
                      Lihat Persediaan Bahan →
                    </button>
                  </div>
                )}
                <div className="mt-2.5">
                  <div className="text-[10px] font-bold text-[#738078] uppercase mb-1.5">
                    Aktivitas Terakhir
                  </div>
                  {activities.slice(0, 3).map((act) => (
                    <div key={act.id} className="py-1 text-[11px] border-b border-[#E4EAE6]/60 last:border-0">
                      <div className="font-semibold text-[#1D2B25]">{act.title}</div>
                      <div className="text-[10px] text-[#738078]">
                        {act.time} · {act.actorRole}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Mobile Sub-Navigation Pills (for switching between Data/Form views on Mobile) */}
        {mobileSubNav && mobileSubNav.length > 0 && (
          <div className="md:hidden px-[20px] pt-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {mobileSubNav.map((tab) => (
              <button
                key={tab.path}
                type="button"
                onClick={() => navigate(tab.path)}
                className={`h-[30px] px-3 rounded-[13px] text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  tab.active
                    ? 'bg-[#145B46] text-white'
                    : 'bg-white border border-[#E4EAE6] text-[#738078]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Optional Top-Right Action Button on Desktop & Full-Width Button on Mobile (Matches 03, 05, 07, 10, 14, 15 & M02, M03 SVGs) */}
        {actionButton && (
          <div className="px-[20px] md:px-6 lg:px-[40px] pt-[14px] md:pt-[6px] flex md:justify-end">
            <button
              type="button"
              onClick={actionButton.onClick}
              className="w-full md:w-[160px] h-[38px] rounded-[8px] bg-[#145B46] hover:bg-[#0F4736] text-[#FFFFFF] text-[12px] font-semibold flex items-center justify-start md:justify-center px-[14px] transition-colors cursor-pointer"
            >
              {actionButton.label}
            </button>
          </div>
        )}

        {/* Page Body */}
        <main className="flex-1 px-[20px] md:px-6 lg:px-[40px] pt-[16px]">{children}</main>
      </div>

      {/* Mobile Bottom Navigation (Matches M01–M06 SVGs) */}
      <MobileBottomNav />

      {/* Toast Feedback */}
      <ToastContainer />
    </div>
  );
};

