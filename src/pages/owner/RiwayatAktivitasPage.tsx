import React, { useState, useMemo } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useApp } from '../../services/AppContext';

export const RiwayatAktivitasPage: React.FC = () => {
  const { activities, addActivity, globalSearch } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('Semua');
  const [currentPage, setCurrentPage] = useState(1);

  // Quick Add Activity Note modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Operasional');
  const [newDetail, setNewDetail] = useState('');

  const itemsPerPage = 7;
  const combinedSearch = (searchQuery || globalSearch).trim().toLowerCase();

  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      const matchesSearch =
        !combinedSearch ||
        act.title.toLowerCase().includes(combinedSearch) ||
        act.category.toLowerCase().includes(combinedSearch) ||
        act.detail.toLowerCase().includes(combinedSearch) ||
        act.actor.toLowerCase().includes(combinedSearch) ||
        act.actorRole.toLowerCase().includes(combinedSearch);

      const matchesFilter =
        filterCategory === 'Semua' ||
        act.category.toLowerCase() === filterCategory.toLowerCase() ||
        act.actorRole.toLowerCase() === filterCategory.toLowerCase() ||
        act.status === filterCategory;

      return matchesSearch && matchesFilter;
    });
  }, [activities, combinedSearch, filterCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredActivities.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedItems = filteredActivities.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  );

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addActivity(newTitle.trim(), newCategory, newDetail.trim() || 'Catatan operasional', 'Normal');
    setNewTitle('');
    setNewDetail('');
    setShowAddModal(false);
  };

  return (
    <AppLayout
      title="Riwayat Aktivitas"
      subtitle="Lihat perubahan data dan aktivitas tim"
      actionButton={{
        label: '+ Tambah data',
        onClick: () => setShowAddModal((prev) => !prev),
      }}
    >
      {showAddModal && (
        <div className="mb-4 rounded-[13px] bg-[#FFFFFF] border border-[#E4EAE6] p-[18px]">
          <h3 className="text-[14px] font-[650] text-[#1D2B25]">Catat Log Aktivitas Manual</h3>
          <form onSubmit={handleCreateActivity} className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Jenis aktivitas (mis. Pengecekan kompor)"
              aria-label="Jenis aktivitas"
              className="h-[40px] rounded-[8px] border border-[#E4EAE6] px-3 text-[12px]"
              required
            />
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              aria-label="Kategori aktivitas"
              className="h-[40px] rounded-[8px] border border-[#E4EAE6] px-3 text-[12px]"
            >
              <option value="Operasional">Operasional</option>
              <option value="Penjualan">Penjualan</option>
              <option value="Bahan baku">Bahan baku</option>
              <option value="Persediaan">Persediaan</option>
              <option value="Keuangan">Keuangan</option>
            </select>
            <input
              type="text"
              value={newDetail}
              onChange={(e) => setNewDetail(e.target.value)}
              placeholder="Rincian / jumlah (mis. 2 unit normal)"
              aria-label="Rincian aktivitas"
              className="h-[40px] rounded-[8px] border border-[#E4EAE6] px-3 text-[12px]"
            />
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="flex-1 h-[40px] rounded-[8px] bg-[#145B46] text-white text-[12px] font-semibold cursor-pointer"
              >
                Simpan
              </button>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="h-[40px] px-3 rounded-[8px] border border-[#E4EAE6] text-[12px] text-[#738078] cursor-pointer"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Card (Matches 15_Riwayat_Aktivitas.svg) */}
      <div className="rounded-[13px] bg-[#FFFFFF] border border-[#E4EAE6] p-[16px] md:p-[20px]">
        <h2 className="text-[14px] font-[650] text-[#1D2B25] mb-3">Daftar riwayat aktivitas</h2>

        {/* Search & Filter Bar */}
        <div className="w-full min-h-[42px] rounded-[7px] bg-[#F5F7F5] px-3.5 py-1.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center flex-1">
            <span className="text-[12px] text-[#738078] mr-2 select-none" aria-hidden="true">
              ⌕
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari data..."
              aria-label="Cari riwayat aktivitas"
              className="w-full bg-transparent text-[12px] text-[#1D2B25] placeholder-[#738078] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <label htmlFor="filter-riwayat" className="text-[12px] text-[#738078]">
              Filter:
            </label>
            <select
              id="filter-riwayat"
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-[12px] font-medium text-[#1D2B25] focus:outline-none cursor-pointer"
            >
              <option value="Semua">Semua</option>
              <option value="Penjualan">Penjualan</option>
              <option value="Bahan baku">Bahan baku</option>
              <option value="Operasional">Operasional</option>
              <option value="Admin">Oleh: Admin</option>
              <option value="Kasir">Oleh: Kasir</option>
              <option value="Gudang">Oleh: Gudang</option>
            </select>
          </div>
        </div>

        {/* Desktop Table View (Matches 15_Riwayat_Aktivitas.svg) */}
        <div className="hidden md:block mt-4 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E4EAE6]">
                <th className="py-3 px-1 text-[11px] font-bold text-[#738078]">
                  Nama / Keterangan
                </th>
                <th className="py-3 px-1 text-[11px] font-bold text-[#738078]">Kategori</th>
                <th className="py-3 px-1 text-[11px] font-bold text-[#738078]">Jumlah</th>
                <th className="py-3 px-1 text-[11px] font-bold text-[#738078]">Status</th>
                <th className="py-3 px-1 text-[11px] font-bold text-[#738078]">
                  Terakhir diperbarui
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-[12px] text-[#738078]">
                    Tidak ada riwayat aktivitas yang sesuai filter.
                  </td>
                </tr>
              ) : (
                paginatedItems.map((act) => (
                  <tr
                    key={act.id}
                    className="border-b border-[#E4EAE6] hover:bg-[#F5F7F5]/50 transition-colors"
                  >
                    <td className="py-[14px] px-1">
                      <div className="text-[12px] font-[550] text-[#1D2B25]">{act.title}</div>
                      <div className="text-[10px] text-[#738078] mt-0.5">
                        Oleh: {act.actor} ({act.actorRole})
                      </div>
                    </td>
                    <td className="py-[14px] px-1 text-[12px] font-[550] text-[#1D2B25]">
                      {act.category}
                    </td>
                    <td className="py-[14px] px-1 text-[12px] font-[550] text-[#1D2B25]">
                      {act.detail}
                    </td>
                    <td className="py-[14px] px-1">
                      <StatusBadge label={act.status} />
                    </td>
                    <td className="py-[14px] px-1 text-[12px] font-[550] text-[#1D2B25]">
                      {act.updatedAt}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="md:hidden mt-4 flex flex-col gap-[12px]">
          {paginatedItems.map((act) => (
            <div
              key={act.id}
              className="min-h-[82px] rounded-[13px] bg-[#FFFFFF] border border-[#E4EAE6] p-[14px] flex items-center justify-between gap-3"
            >
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-[650] text-[#1D2B25] truncate">{act.title}</div>
                <div className="mt-0.5 text-[10px] text-[#738078]">
                  {act.category} · {act.actorRole} ({act.time})
                </div>
                <div className="mt-1 text-[12px] font-bold text-[#1D2B25]">{act.detail}</div>
              </div>
              <StatusBadge label={act.status} />
            </div>
          ))}
        </div>

        {/* Pagination Footer */}
        <div className="mt-5 pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="text-[10px] font-normal text-[#738078]">
            Menampilkan {filteredActivities.length === 0 ? 0 : (safePage - 1) * itemsPerPage + 1}–
            {Math.min(safePage * itemsPerPage, filteredActivities.length)} dari{' '}
            {filteredActivities.length} data
          </div>

          <div className="flex items-center gap-2 text-[11px] font-[650] text-[#145B46]">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="px-2 py-1 rounded hover:bg-[#EAF4EF] disabled:opacity-40 cursor-pointer"
            >
              ‹
            </button>
            {Array.from({ length: Math.max(3, totalPages) }, (_, idx) => idx + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(Math.min(pageNum, totalPages))}
                className={`w-6 h-6 rounded-[6px] flex items-center justify-center cursor-pointer ${
                  safePage === pageNum
                    ? 'bg-[#EAF4EF] text-[#145B46] font-bold'
                    : 'text-[#145B46] hover:bg-[#F5F7F5]'
                }`}
              >
                {pageNum}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className="px-2 py-1 rounded hover:bg-[#EAF4EF] disabled:opacity-40 cursor-pointer"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

