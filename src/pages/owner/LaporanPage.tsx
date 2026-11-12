import React, { useState, useMemo } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { useApp } from '../../services/AppContext';
import { formatRupiah } from '../../utils/formatters';

export const LaporanPage: React.FC = () => {
  const { reports, showToast, globalSearch } = useApp();

  const [selectedPeriod, setSelectedPeriod] = useState('12 Nov 2026');
  const [appliedPeriod, setAppliedPeriod] = useState('12 Nov 2026');

  const filteredReports = useMemo(() => {
    let rows = reports;
    if (appliedPeriod === 'Hari Ini (12 Nov 2026)') {
      rows = reports.slice(0, 1);
    } else if (appliedPeriod === '3 Hari Terakhir') {
      rows = reports.slice(0, 3);
    } else if (appliedPeriod === '5 Hari Terakhir') {
      rows = reports.slice(0, 5);
    }
    if (globalSearch) {
      rows = rows.filter((r) => r.date.toLowerCase().includes(globalSearch.toLowerCase()));
    }
    return rows;
  }, [reports, appliedPeriod, globalSearch]);

  const totals = useMemo(() => {
    const totalSales = filteredReports.reduce((acc, r) => acc + r.sales, 0);
    const totalExpenses = filteredReports.reduce((acc, r) => acc + r.expenses, 0);
    const netProfit = totalSales - totalExpenses;
    return { totalSales, totalExpenses, netProfit };
  }, [filteredReports]);

  const handleApplyFilter = () => {
    setAppliedPeriod(selectedPeriod);
    showToast(`Laporan periode "${selectedPeriod}" ditampilkan.`, 'success');
  };

  const mobileSubNav = [
    { label: 'Keuangan', path: '/keuangan', active: false },
    { label: 'Persediaan', path: '/persediaan', active: false },
    { label: 'Pembelian', path: '/pembelian', active: false },
    { label: 'Laporan', path: '/laporan', active: true },
    { label: 'Karyawan', path: '/karyawan', active: false },
  ];

  return (
    <AppLayout
      title="Laporan Usaha"
      subtitle="Lihat performa penjualan dan keuangan"
      mobileSubNav={mobileSubNav}
    >
      {/* Top Filter Card (Matches 09_Laporan.svg: height 105, rx 13) */}
      <section className="rounded-[13px] bg-[#FFFFFF] border border-[#E4EAE6] p-[18px] md:min-h-[105px] flex flex-col justify-between">
        <h2 className="text-[14px] font-[650] text-[#1D2B25]">Filter laporan</h2>
        <div className="mt-2 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <label
              htmlFor="laporan-periode"
              className="block text-[11px] font-[650] text-[#738078] mb-1.5"
            >
              Periode
            </label>
            <select
              id="laporan-periode"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full sm:w-[220px] h-[34px] rounded-[7px] bg-[#FFFFFF] border border-[#E4EAE6] px-3 text-[11px] text-[#1D2B25] focus:outline-none focus:border-[#145B46] cursor-pointer"
            >
              <option value="12 Nov 2026">12 Nov 2026 (7 Hari Terakhir)</option>
              <option value="5 Hari Terakhir">5 Hari Terakhir</option>
              <option value="3 Hari Terakhir">3 Hari Terakhir</option>
              <option value="Hari Ini (12 Nov 2026)">Hari Ini (12 Nov 2026)</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleApplyFilter}
            className="w-full sm:w-[150px] h-[38px] rounded-[8px] bg-[#145B46] hover:bg-[#0F4736] text-[#FFFFFF] text-[12px] font-semibold flex items-center justify-start px-[14px] transition-colors cursor-pointer"
          >
            Tampilkan
          </button>
        </div>
      </section>

      {/* 3 Summary Cards (Matches 09_Laporan.svg: 345x115 each on desktop) */}
      <section
        aria-label="Ringkasan Laporan"
        className="mt-[22px] grid grid-cols-1 md:grid-cols-3 gap-[16px] md:gap-[25px]"
      >
        <div className="rounded-[13px] bg-[#FFFFFF] border border-[#E4EAE6] p-[18px] h-[100px] md:h-[115px] flex flex-col justify-between">
          <div className="text-[14px] font-[650] text-[#1D2B25]">Total penjualan</div>
          <div className="text-[20px] md:text-[22px] font-[750] text-[#1D2B25]">
            {formatRupiah(totals.totalSales)}
          </div>
        </div>

        <div className="rounded-[13px] bg-[#FFFFFF] border border-[#E4EAE6] p-[18px] h-[100px] md:h-[115px] flex flex-col justify-between">
          <div className="text-[14px] font-[650] text-[#1D2B25]">Total pengeluaran</div>
          <div className="text-[20px] md:text-[22px] font-[750] text-[#1D2B25]">
            {formatRupiah(totals.totalExpenses)}
          </div>
        </div>

        <div className="rounded-[13px] bg-[#FFFFFF] border border-[#E4EAE6] p-[18px] h-[100px] md:h-[115px] flex flex-col justify-between">
          <div className="text-[14px] font-[650] text-[#1D2B25]">Laba bersih</div>
          <div className="text-[20px] md:text-[22px] font-[750] text-[#1D2B25]">
            {formatRupiah(totals.netProfit)}
          </div>
        </div>
      </section>

      {/* Rincian Laporan Table (Matches 09_Laporan.svg) */}
      <section className="mt-[22px] rounded-[13px] bg-[#FFFFFF] border border-[#E4EAE6] p-[18px] md:min-h-[390px]">
        <h2 className="text-[14px] font-[650] text-[#1D2B25] mb-3">Rincian laporan</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[480px]">
            <thead>
              <tr className="border-b border-[#E4EAE6]">
                <th className="py-3 px-1 text-[11px] font-bold text-[#738078] w-1/4">Tanggal</th>
                <th className="py-3 px-1 text-[11px] font-bold text-[#738078] w-1/4">Penjualan</th>
                <th className="py-3 px-1 text-[11px] font-bold text-[#738078] w-1/4">
                  Pengeluaran
                </th>
                <th className="py-3 px-1 text-[11px] font-bold text-[#738078] w-1/4">Laba</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-[#E4EAE6] hover:bg-[#F5F7F5]/50 transition-colors"
                >
                  <td className="py-[14px] px-1 text-[12px] font-[550] text-[#1D2B25]">
                    {row.date}
                  </td>
                  <td className="py-[14px] px-1 text-[12px] font-[550] text-[#1D2B25]">
                    {formatRupiah(row.sales)}
                  </td>
                  <td className="py-[14px] px-1 text-[12px] font-[550] text-[#1D2B25]">
                    {formatRupiah(row.expenses)}
                  </td>
                  <td className="py-[14px] px-1 text-[12px] font-[550] text-[#1D2B25]">
                    {formatRupiah(row.profit)}
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

