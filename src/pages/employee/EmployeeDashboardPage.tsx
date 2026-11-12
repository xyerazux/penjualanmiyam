import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { SalesLineChart } from '../../components/charts/SalesLineChart';
import { useApp } from '../../services/AppContext';
import { formatRupiah, formatNumber } from '../../utils/formatters';

export const EmployeeDashboardPage: React.FC = () => {
  const { metrics, activities, inventory, reports, settings, globalSearch } = useApp();
  const navigate = useNavigate();

  const ayamFillet = inventory.find((i) => i.name.toLowerCase().includes('ayam'));
  const mieBasah = inventory.find((i) => i.name.toLowerCase().includes('mie'));

  const summaryRows = [
    {
      id: 'sum-emp-1',
      category: 'Mie ayam',
      amount: `${metrics.todayPortions} porsi`,
      status: 'Normal' as const,
      updatedAt: '10:42',
    },
    {
      id: 'sum-emp-2',
      category: ayamFillet?.name || 'Ayam fillet',
      amount: ayamFillet ? `${formatNumber(ayamFillet.quantity)} ${ayamFillet.unit}` : '2,5 kg',
      status: ayamFillet?.status || ('Menipis' as const),
      updatedAt: '10:15',
    },
    {
      id: 'sum-emp-3',
      category: mieBasah?.name || 'Mie basah',
      amount: mieBasah ? `${formatNumber(mieBasah.quantity)} ${mieBasah.unit}` : '8 kg',
      status: mieBasah?.status || ('Normal' as const),
      updatedAt: '09:50',
    },
  ].filter((row) =>
    globalSearch ? row.category.toLowerCase().includes(globalSearch.toLowerCase()) : true
  );

  const recentActivities = activities.slice(0, 4);

  return (
    <AppLayout
      title="Dashboard Karyawan"
      subtitle="Ringkasan aktivitas operasional"
    >
      {/* 4 Stat Cards matching 13_Dashboard_Karyawan.svg & M04_Dashboard_Karyawan_Mobile.svg */}
      <section
        aria-label="Ringkasan Operasional Karyawan"
        className="grid grid-cols-2 xl:grid-cols-4 gap-[15px] md:gap-[20px]"
      >
        <div
          onClick={() => navigate('/penjualan')}
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

        <div
          onClick={() =>
            navigate(settings.allowEmployeeExpense ? '/pengeluaran-karyawan' : '/riwayat')
          }
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

        <div className="rounded-[13px] bg-[#FFFFFF] border border-[#E4EAE6] p-[16px] md:px-[18px] md:py-[18px] h-[98px] md:h-[118px] flex flex-col justify-between">
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

        <div
          onClick={() => navigate('/pengajuan-stok')}
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

      {/* Quick Employee Action Buttons */}
      <section className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => navigate('/penjualan')}
          className="h-[36px] px-3.5 rounded-[8px] bg-[#145B46] text-white text-[12px] font-semibold hover:bg-[#0F4736] transition-colors cursor-pointer"
        >
          + Catat Penjualan Baru
        </button>
        {settings.allowEmployeeExpense && (
          <button
            type="button"
            onClick={() => navigate('/pengeluaran-karyawan')}
            className="h-[36px] px-3.5 rounded-[8px] bg-white border border-[#145B46] text-[#145B46] text-[12px] font-semibold hover:bg-[#EAF4EF] transition-colors cursor-pointer"
          >
            + Catat Pengeluaran
          </button>
        )}
        <button
          type="button"
          onClick={() => navigate('/penggunaan-bahan')}
          className="h-[36px] px-3.5 rounded-[8px] bg-white border border-[#E4EAE6] text-[#1D2B25] text-[12px] font-semibold hover:bg-[#F5F7F5] transition-colors cursor-pointer"
        >
          Gunakan Bahan
        </button>
        <button
          type="button"
          onClick={() => navigate('/pengajuan-stok')}
          className="h-[36px] px-3.5 rounded-[8px] bg-white border border-[#E4EAE6] text-[#1D2B25] text-[12px] font-semibold hover:bg-[#F5F7F5] transition-colors cursor-pointer"
        >
          Ajukan Stok Menipis
        </button>
      </section>

      {/* Middle Row: Grafik Penjualan + Aktivitas Terbaru */}
      <section className="mt-[18px] grid grid-cols-1 xl:grid-cols-12 gap-[20px]">
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

        <div className="xl:col-span-4 rounded-[13px] bg-[#FFFFFF] border border-[#E4EAE6] p-[18px] md:min-h-[310px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-[14px] font-[650] text-[#1D2B25]">Aktivitas terbaru</h2>
              <button
                type="button"
                onClick={() => navigate('/riwayat')}
                className="text-[11px] font-semibold text-[#145B46] hover:underline cursor-pointer"
              >
                Semua
              </button>
            </div>

            <div className="hidden md:flex flex-col mt-3">
              {recentActivities.map((act) => (
                <div
                  key={act.id}
                  onClick={() => navigate('/riwayat')}
                  className="flex items-center gap-[13px] py-[11px] border-b border-[#E4EAE6] cursor-pointer hover:bg-[#F5F7F5]/60 rounded px-1"
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

      {/* Bottom Row: Ringkasan Operasional */}
      <section className="mt-[22px] rounded-[13px] bg-[#FFFFFF] border border-[#E4EAE6] p-[18px]">
        <h2 className="text-[14px] font-[650] text-[#1D2B25] mb-3">Ringkasan operasional</h2>
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
                <tr key={row.id} className="border-b border-[#E4EAE6] last:border-0">
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

