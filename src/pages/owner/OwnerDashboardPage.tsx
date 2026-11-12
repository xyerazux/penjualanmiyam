import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { SalesLineChart } from '../../components/charts/SalesLineChart';
import { useApp } from '../../services/AppContext';
import { formatRupiah, formatNumber } from '../../utils/formatters';

export const OwnerDashboardPage: React.FC = () => {
  const { metrics, activities, inventory, reports, globalSearch } = useApp();
  const navigate = useNavigate();

  const ayamFillet = inventory.find((i) => i.name.toLowerCase().includes('ayam'));
  const mieBasah = inventory.find((i) => i.name.toLowerCase().includes('mie'));

  const summaryRows = [
    {
      id: 'sum-1',
      category: 'Mie ayam',
      amount: `${metrics.todayPortions} porsi`,
      status: 'Normal' as const,
      updatedAt: '10:42',
      onClick: () => navigate('/laporan'),
    },
    {
      id: 'sum-2',
      category: ayamFillet?.name || 'Ayam fillet',
      amount: ayamFillet ? `${formatNumber(ayamFillet.quantity)} ${ayamFillet.unit}` : '2,5 kg',
      status: ayamFillet?.status || ('Menipis' as const),
      updatedAt: '10:15',
      onClick: () => navigate('/persediaan'),
    },
    {
      id: 'sum-3',
      category: mieBasah?.name || 'Mie basah',
      amount: mieBasah ? `${formatNumber(mieBasah.quantity)} ${mieBasah.unit}` : '8 kg',
      status: mieBasah?.status || ('Normal' as const),
      updatedAt: '09:50',
      onClick: () => navigate('/persediaan'),
    },
  ].filter((row) =>
    globalSearch
      ? row.category.toLowerCase().includes(globalSearch.toLowerCase()) ||
        row.status.toLowerCase().includes(globalSearch.toLowerCase())
      : true
  );

  const recentActivities = activities
    .filter((act) =>
      globalSearch
        ? act.title.toLowerCase().includes(globalSearch.toLowerCase()) ||
          act.actorRole.toLowerCase().includes(globalSearch.toLowerCase())
        : true
    )
    .slice(0, 4);

  return (
    <AppLayout
      title="Dashboard Pemilik"
      subtitle="Pantau ringkasan operasional hari ini"
    >
      {/* 4 Stat Cards — 2x2 on Mobile (M01), 4 columns on Desktop (02) */}
      <section
        aria-label="Statistik Utama"
        className="grid grid-cols-2 xl:grid-cols-4 gap-[15px] md:gap-[20px]"
      >
        {/* Card 1: Penjualan hari ini */}
        <div
          onClick={() => navigate('/laporan')}
          className="rounded-[13px] bg-[#FFFFFF] border border-[#E4EAE6] p-[16px] md:px-[18px] md:py-[18px] h-[98px] md:h-[118px] flex flex-col justify-between cursor-pointer hover:border-[#145B46]/40 transition-colors"
        >
          <div className="text-[13px] md:text-[14px] font-[650] text-[#1D2B25] truncate">
            Penjualan hari ini
          </div>
          <div className="text-[17px] md:text-[23px] font-[750] text-[#1D2B25] leading-tight truncate">
            {formatRupiah(metrics.todaySales)}
          </div>
          <div>
            <span className="md:hidden text-[10px] font-[650] text-[#145B46]">+12,8%</span>
            <span className="hidden md:inline-flex items-center justify-center h-[25px] px-[10px] rounded-[13px] bg-[#EAF4EF] text-[11px] font-semibold text-[#145B46]">
              +12,8%
            </span>
          </div>
        </div>

        {/* Card 2: Pengeluaran */}
        <div
          onClick={() => navigate('/keuangan')}
          className="rounded-[13px] bg-[#FFFFFF] border border-[#E4EAE6] p-[16px] md:px-[18px] md:py-[18px] h-[98px] md:h-[118px] flex flex-col justify-between cursor-pointer hover:border-[#145B46]/40 transition-colors"
        >
          <div className="text-[13px] md:text-[14px] font-[650] text-[#1D2B25] truncate">
            Pengeluaran
          </div>
          <div className="text-[17px] md:text-[23px] font-[750] text-[#1D2B25] leading-tight truncate">
            {formatRupiah(metrics.todayExpenses)}
          </div>
          <div>
            <span className="md:hidden text-[10px] font-[650] text-[#145B46]">Hari ini</span>
            <span className="hidden md:inline-flex items-center justify-center h-[25px] px-[12px] rounded-[13px] bg-[#EAF4EF] text-[11px] font-semibold text-[#145B46]">
              Hari ini
            </span>
          </div>
        </div>

        {/* Card 3: Laba bersih */}
        <div
          onClick={() => navigate('/laporan')}
          className="rounded-[13px] bg-[#FFFFFF] border border-[#E4EAE6] p-[16px] md:px-[18px] md:py-[18px] h-[98px] md:h-[118px] flex flex-col justify-between cursor-pointer hover:border-[#145B46]/40 transition-colors"
        >
          <div className="text-[13px] md:text-[14px] font-[650] text-[#1D2B25] truncate">
            Laba bersih
          </div>
          <div className="text-[17px] md:text-[23px] font-[750] text-[#1D2B25] leading-tight truncate">
            {formatRupiah(metrics.todayProfit)}
          </div>
          <div>
            <span className="md:hidden text-[10px] font-[650] text-[#145B46]">Hari ini</span>
            <span className="hidden md:inline-flex items-center justify-center h-[25px] px-[10px] rounded-[13px] bg-[#EAF4EF] text-[11px] font-semibold text-[#145B46]">
              +8,4%
            </span>
          </div>
        </div>

        {/* Card 4: Stok menipis */}
        <div
          onClick={() => navigate('/persediaan')}
          className="rounded-[13px] bg-[#FFFFFF] border border-[#E4EAE6] p-[16px] md:px-[18px] md:py-[18px] h-[98px] md:h-[118px] flex flex-col justify-between cursor-pointer hover:border-[#A96B22]/40 transition-colors"
        >
          <div className="text-[13px] md:text-[14px] font-[650] text-[#1D2B25] truncate">
            Stok menipis
          </div>
          <div className="text-[17px] md:text-[23px] font-[750] text-[#1D2B25] leading-tight truncate">
            {metrics.lowStockCount} bahan
          </div>
          <div>
            <span className="md:hidden text-[10px] font-[650] text-[#E89A45]">Perlu dicek</span>
            <span className="hidden md:inline-flex items-center justify-center h-[25px] px-[12px] rounded-[13px] bg-[#FFF2E5] text-[11px] font-semibold text-[#A96B22]">
              Perlu dicek
            </span>
          </div>
        </div>
      </section>

      {/* Middle Row: Grafik Penjualan + Aktivitas Terbaru */}
      <section className="mt-[22px] grid grid-cols-1 xl:grid-cols-12 gap-[20px]">
        {/* Grafik penjualan (720px on 1100px grid => 8 cols) */}
        <div className="xl:col-span-8 rounded-[13px] bg-[#FFFFFF] border border-[#E4EAE6] p-[18px] md:min-h-[310px] flex flex-col justify-between">
          <div>
            <h2 className="text-[14px] font-[650] text-[#1D2B25]">Grafik penjualan</h2>
            <p className="mt-0.5 text-[10px] md:text-[11px] font-normal text-[#738078]">
              <span className="hidden md:inline">Ringkasan penjualan 7 hari terakhir</span>
              <span className="md:hidden">7 hari terakhir</span>
            </p>
          </div>
          <div className="mt-3">
            <SalesLineChart reports={reports} />
          </div>
        </div>

        {/* Aktivitas terbaru (360px on 1100px grid => 4 cols) */}
        <div className="xl:col-span-4 rounded-[13px] bg-[#FFFFFF] border border-[#E4EAE6] p-[18px] md:min-h-[310px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-[14px] font-[650] text-[#1D2B25]">Aktivitas terbaru</h2>
              <button
                type="button"
                onClick={() => navigate('/riwayat')}
                className="text-[11px] font-semibold text-[#145B46] hover:underline cursor-pointer"
              >
                Lihat semua
              </button>
            </div>

            {/* Desktop Activity List (with 32x32 green circle bullet) */}
            <div className="hidden md:flex flex-col mt-3">
              {recentActivities.map((act) => (
                <div
                  key={act.id}
                  onClick={() => navigate('/riwayat')}
                  className="flex items-center gap-[13px] py-[11px] border-b border-[#E4EAE6] cursor-pointer hover:bg-[#F5F7F5]/60 rounded px-1 transition-colors"
                >
                  <div className="w-[32px] h-[32px] rounded-full bg-[#EAF4EF] flex items-center justify-center text-[17px] font-bold text-[#145B46] shrink-0">
                    •
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[12px] font-[650] text-[#1D2B25] truncate">
                      {act.title}
                    </div>
                    <div className="mt-0.5 text-[10px] font-normal text-[#738078] truncate">
                      {act.time} · {act.actorRole}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Activity List (Matches M01_Dashboard_Pemilik_Mobile.svg) */}
            <div className="md:hidden flex flex-col mt-2">
              {recentActivities.slice(0, 3).map((act) => (
                <div
                  key={act.id}
                  onClick={() => navigate('/riwayat')}
                  className="py-[10px] border-b border-[#E4EAE6] text-[11px] font-[550] text-[#1D2B25] cursor-pointer"
                >
                  {act.title} · {act.time}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Row: Ringkasan Operasional (Matches 02_Dashboard_Pemilik.svg) */}
      <section className="mt-[22px] rounded-[13px] bg-[#FFFFFF] border border-[#E4EAE6] p-[18px]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[14px] font-[650] text-[#1D2B25]">Ringkasan operasional</h2>
          <button
            type="button"
            onClick={() => navigate('/persediaan')}
            className="text-[11px] font-semibold text-[#145B46] hover:underline cursor-pointer"
          >
            Kelola stok →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[460px]">
            <thead>
              <tr className="border-b border-[#E4EAE6]">
                <th className="py-2.5 text-[11px] font-bold text-[#738078] w-1/4">Kategori</th>
                <th className="py-2.5 text-[11px] font-bold text-[#738078] w-1/4">Jumlah</th>
                <th className="py-2.5 text-[11px] font-bold text-[#738078] w-1/4">Status</th>
                <th className="py-2.5 text-[11px] font-bold text-[#738078] w-1/4">Pembaruan</th>
              </tr>
            </thead>
            <tbody>
              {summaryRows.map((row) => (
                <tr
                  key={row.id}
                  onClick={row.onClick}
                  className="border-b border-[#E4EAE6] last:border-0 hover:bg-[#F5F7F5]/60 cursor-pointer transition-colors"
                >
                  <td className="py-[12px] text-[12px] font-[550] text-[#1D2B25]">
                    {row.category}
                  </td>
                  <td className="py-[12px] text-[12px] font-[550] text-[#1D2B25]">
                    {row.amount}
                  </td>
                  <td className="py-[12px]">
                    <StatusBadge label={row.status} />
                  </td>
                  <td className="py-[12px] text-[12px] font-[550] text-[#1D2B25]">
                    {row.updatedAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppLayout>
  );
};

