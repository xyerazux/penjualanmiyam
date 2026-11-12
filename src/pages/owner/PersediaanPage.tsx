import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { useApp } from '../../services/AppContext';
import { formatNumber } from '../../utils/formatters';
import { Pencil, Trash2, AlertTriangle, Plus, Minus } from 'lucide-react';

export const PersediaanPage: React.FC = () => {
  const { inventory, adjustStock, deleteInventory, metrics, globalSearch } = useApp();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const itemsPerPage = 7;
  const combinedSearch = (searchQuery || globalSearch).trim().toLowerCase();

  const filteredItems = useMemo(() => {
    return inventory.filter((item) => {
      const matchesSearch =
        !combinedSearch ||
        item.name.toLowerCase().includes(combinedSearch) ||
        item.category.toLowerCase().includes(combinedSearch) ||
        item.notes.toLowerCase().includes(combinedSearch);

      const matchesFilter =
        filterCategory === 'Semua' ||
        item.status === filterCategory ||
        item.category === filterCategory;

      return matchesSearch && matchesFilter;
    });
  }, [inventory, combinedSearch, filterCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedItems = filteredItems.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  );

  const targetToDelete = inventory.find((i) => i.id === deleteTargetId);

  const mobileSubNav = [
    { label: 'Keuangan', path: '/keuangan', active: false },
    { label: 'Persediaan', path: '/persediaan', active: true },
    { label: 'Pembelian', path: '/pembelian', active: false },
    { label: 'Laporan', path: '/laporan', active: false },
    { label: 'Karyawan', path: '/karyawan', active: false },
  ];

  return (
    <AppLayout
      title="Persediaan Bahan"
      subtitle="Pantau stok bahan baku dan perlengkapan"
      mobileSubNav={mobileSubNav}
      actionButton={{
        label: '+ Tambah data',
        onClick: () => navigate('/persediaan/tambah'),
      }}
    >
      {/* Low Stock Warning Banner when items are below minimum threshold */}
      {metrics.lowStockCount > 0 && (
        <div
          role="alert"
          className="mb-3 px-4 py-2.5 rounded-[11px] bg-[#FFF2E5] border border-[#E89A45]/40 text-[#A96B22] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[12px]"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              <strong>Peringatan Stok Menipis:</strong> Terdapat {metrics.lowStockCount} bahan (
              {metrics.lowStockItems.map((i) => i.name).join(', ')}) yang berada di bawah batas
              minimum.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setFilterCategory(filterCategory === 'Menipis' ? 'Semua' : 'Menipis')}
            className="text-[11px] font-bold underline shrink-0 self-start sm:self-auto cursor-pointer"
          >
            {filterCategory === 'Menipis' ? 'Tampilkan Semua' : 'Filter Stok Menipis'}
          </button>
        </div>
      )}

      {/* Main Card (Matches 05_Persediaan.svg) */}
      <div className="rounded-[13px] bg-[#FFFFFF] border border-[#E4EAE6] p-[16px] md:p-[20px]">
        <h2 className="text-[14px] font-[650] text-[#1D2B25] mb-3">Daftar persediaan bahan</h2>

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
              aria-label="Cari bahan persediaan"
              className="w-full bg-transparent text-[12px] text-[#1D2B25] placeholder-[#738078] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <label htmlFor="filter-persediaan" className="text-[12px] text-[#738078]">
              Filter:
            </label>
            <select
              id="filter-persediaan"
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-[12px] font-medium text-[#1D2B25] focus:outline-none cursor-pointer"
            >
              <option value="Semua">Semua</option>
              <option value="Normal">Status: Normal</option>
              <option value="Menipis">Status: Menipis</option>
              <option value="Bahan baku">Bahan baku</option>
              <option value="Sayuran">Sayuran</option>
              <option value="Bumbu">Bumbu</option>
              <option value="Operasional">Operasional</option>
            </select>
          </div>
        </div>

        {/* Desktop Table View (Matches 05_Persediaan.svg) */}
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
                <th className="py-3 px-1 text-right text-[11px] font-bold text-[#738078]">
                  Stok & Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-[12px] text-[#738078]">
                    Tidak ada bahan persediaan yang sesuai filter.
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-[#E4EAE6] hover:bg-[#F5F7F5]/50 transition-colors"
                  >
                    <td className="py-[14px] px-1">
                      <div className="text-[12px] font-[550] text-[#1D2B25]">{item.name}</div>
                      <div className="text-[10px] text-[#738078] mt-0.5">
                        Min. stok: {formatNumber(item.minStock)} {item.unit}
                      </div>
                    </td>
                    <td className="py-[14px] px-1 text-[12px] font-[550] text-[#1D2B25]">
                      {item.category}
                    </td>
                    <td className="py-[14px] px-1 text-[12px] font-[550] text-[#1D2B25]">
                      {formatNumber(item.quantity)} {item.unit}
                    </td>
                    <td className="py-[14px] px-1">
                      <StatusBadge label={item.status} />
                    </td>
                    <td className="py-[14px] px-1 text-[12px] font-[550] text-[#1D2B25]">
                      {item.updatedAt}
                    </td>
                    <td className="py-[14px] px-1 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => adjustStock(item.id, -0.5)}
                          aria-label={`Kurangi stok ${item.name}`}
                          title="Kurangi stok (-0.5)"
                          className="w-6 h-6 rounded-[6px] border border-[#E4EAE6] flex items-center justify-center text-[#738078] hover:bg-[#F5F7F5] hover:text-[#1D2B25] cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => adjustStock(item.id, 1)}
                          aria-label={`Tambah stok ${item.name}`}
                          title="Tambah stok (+1)"
                          className="w-6 h-6 rounded-[6px] border border-[#E4EAE6] flex items-center justify-center text-[#145B46] hover:bg-[#EAF4EF] cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate(`/persediaan/edit/${item.id}`)}
                          aria-label={`Edit ${item.name}`}
                          className="p-1.5 rounded-[7px] text-[#145B46] hover:bg-[#EAF4EF] cursor-pointer ml-1"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTargetId(item.id)}
                          aria-label={`Hapus ${item.name}`}
                          className="p-1.5 rounded-[7px] text-[#B42318] hover:bg-[#FDECEC] cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View (Matches M03_Persediaan_Mobile.svg) */}
        <div className="md:hidden mt-4 flex flex-col gap-[12px]">
          {paginatedItems.length === 0 ? (
            <div className="py-8 text-center text-[12px] text-[#738078]">
              Tidak ada bahan persediaan ditemukan.
            </div>
          ) : (
            paginatedItems.map((item) => (
              <div
                key={item.id}
                className="min-h-[88px] rounded-[13px] bg-[#FFFFFF] border border-[#E4EAE6] p-[14px] flex items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-[650] text-[#1D2B25] truncate">{item.name}</div>
                  <div className="mt-0.5 text-[10px] font-normal text-[#738078]">
                    {item.category}
                  </div>
                  <div className="mt-1 text-[13px] font-bold text-[#1D2B25]">
                    {formatNumber(item.quantity)} {item.unit}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <StatusBadge label={item.status} />
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => adjustStock(item.id, -0.5)}
                      aria-label={`Kurangi ${item.name}`}
                      className="w-6 h-6 rounded-[6px] border border-[#E4EAE6] flex items-center justify-center text-[12px] font-bold text-[#738078] cursor-pointer"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() => adjustStock(item.id, 1)}
                      aria-label={`Tambah ${item.name}`}
                      className="w-6 h-6 rounded-[6px] border border-[#E4EAE6] flex items-center justify-center text-[12px] font-bold text-[#145B46] cursor-pointer"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(`/persediaan/edit/${item.id}`)}
                      className="px-2 py-1 rounded-[6px] bg-[#EAF4EF] text-[#145B46] text-[10px] font-semibold cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTargetId(item.id)}
                      className="px-2 py-1 rounded-[6px] bg-[#FDECEC] text-[#B42318] text-[10px] font-semibold cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Footer */}
        <div className="mt-5 pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="text-[10px] font-normal text-[#738078]">
            Menampilkan {filteredItems.length === 0 ? 0 : (safePage - 1) * itemsPerPage + 1}–
            {Math.min(safePage * itemsPerPage, filteredItems.length)} dari {filteredItems.length}{' '}
            data
          </div>

          <div className="flex items-center gap-2 text-[11px] font-[650] text-[#145B46]">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="px-2 py-1 rounded hover:bg-[#EAF4EF] disabled:opacity-40 cursor-pointer"
              aria-label="Halaman sebelumnya"
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
              aria-label="Halaman berikutnya"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!deleteTargetId}
        title="Hapus Bahan Persediaan?"
        description={`Apakah Anda yakin ingin menghapus bahan "${
          targetToDelete?.name || ''
        }" dari daftar persediaan?`}
        onConfirm={() => {
          if (deleteTargetId) {
            deleteInventory(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
        onCancel={() => setDeleteTargetId(null)}
      />
    </AppLayout>
  );
};

