import React, { Suspense, lazy, useEffect, useRef } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../services/AppContext';
import { UserRole } from '../types';

// Lazy-loaded pages for optimal bundle splitting
const LoginPage = lazy(() =>
  import('../pages/auth/LoginPage').then((m) => ({ default: m.LoginPage }))
);
const OwnerDashboardPage = lazy(() =>
  import('../pages/owner/OwnerDashboardPage').then((m) => ({ default: m.OwnerDashboardPage }))
);
const KeuanganPage = lazy(() =>
  import('../pages/owner/KeuanganPage').then((m) => ({ default: m.KeuanganPage }))
);
const FormKeuanganPage = lazy(() =>
  import('../pages/owner/FormKeuanganPage').then((m) => ({ default: m.FormKeuanganPage }))
);
const PersediaanPage = lazy(() =>
  import('../pages/owner/PersediaanPage').then((m) => ({ default: m.PersediaanPage }))
);
const FormPersediaanPage = lazy(() =>
  import('../pages/owner/FormPersediaanPage').then((m) => ({ default: m.FormPersediaanPage }))
);
const PembelianPage = lazy(() =>
  import('../pages/owner/PembelianPage').then((m) => ({ default: m.PembelianPage }))
);
const FormPembelianPage = lazy(() =>
  import('../pages/owner/FormPembelianPage').then((m) => ({ default: m.FormPembelianPage }))
);
const LaporanPage = lazy(() =>
  import('../pages/owner/LaporanPage').then((m) => ({ default: m.LaporanPage }))
);
const KaryawanPage = lazy(() =>
  import('../pages/owner/KaryawanPage').then((m) => ({ default: m.KaryawanPage }))
);
const FormKaryawanPage = lazy(() =>
  import('../pages/owner/FormKaryawanPage').then((m) => ({ default: m.FormKaryawanPage }))
);
const PengaturanPage = lazy(() =>
  import('../pages/owner/PengaturanPage').then((m) => ({ default: m.PengaturanPage }))
);
const RiwayatAktivitasPage = lazy(() =>
  import('../pages/owner/RiwayatAktivitasPage').then((m) => ({ default: m.RiwayatAktivitasPage }))
);
const EmployeeDashboardPage = lazy(() =>
  import('../pages/employee/EmployeeDashboardPage').then((m) => ({
    default: m.EmployeeDashboardPage,
  }))
);
const PenjualanPage = lazy(() =>
  import('../pages/employee/PenjualanPage').then((m) => ({ default: m.PenjualanPage }))
);
const PengeluaranKaryawanPage = lazy(() =>
  import('../pages/employee/PengeluaranKaryawanPage').then((m) => ({
    default: m.PengeluaranKaryawanPage,
  }))
);
const PenggunaanBahanPage = lazy(() =>
  import('../pages/employee/PenggunaanBahanPage').then((m) => ({ default: m.PenggunaanBahanPage }))
);
const PengajuanStokPage = lazy(() =>
  import('../pages/employee/PengajuanStokPage').then((m) => ({ default: m.PengajuanStokPage }))
);
const ProfilKaryawanPage = lazy(() =>
  import('../pages/employee/ProfilKaryawanPage').then((m) => ({ default: m.ProfilKaryawanPage }))
);

const PageLoader: React.FC = () => (
  <div className="min-h-screen w-full bg-[#F5F7F5] flex items-center justify-center">
    <div className="px-4 py-2.5 rounded-[9px] bg-white border border-[#E4EAE6] text-[12px] font-semibold text-[#145B46]">
      Memuat halaman Monitoring Penjualan...
    </div>
  </div>
);

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, showToast } = useApp();
  const location = useLocation();
  const lastDeniedPathRef = useRef<string | null>(null);

  const isAuthorized = !!user && isAuthenticated && allowedRoles.includes(user.role);

  useEffect(() => {
    if (isAuthenticated && user && !allowedRoles.includes(user.role)) {
      if (lastDeniedPathRef.current !== location.pathname) {
        lastDeniedPathRef.current = location.pathname;
        showToast(
          'Akses ditolak: Anda tidak memiliki izin untuk membuka halaman tersebut.',
          'error'
        );
      }
    }
  }, [isAuthenticated, user, allowedRoles, location.pathname, showToast]);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAuthorized) {
    const redirectTarget = user.role === 'owner' ? '/dashboard' : '/karyawan-dashboard';
    return <Navigate to={redirectTarget} replace />;
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  const { user, isAuthenticated } = useApp();

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* 01. Login Pemilik & Karyawan */}
        <Route path="/login" element={<LoginPage />} />

        {/* 02. Dashboard Pemilik (Owner Only) */}
        <Route
          path="/dashboard"
          element={
            <RoleGuard allowedRoles={['owner']}>
              <OwnerDashboardPage />
            </RoleGuard>
          }
        />

        {/* 03 & 04. Keuangan & Form Tambah/Edit Transaksi (Owner Only) */}
        <Route
          path="/keuangan"
          element={
            <RoleGuard allowedRoles={['owner']}>
              <KeuanganPage />
            </RoleGuard>
          }
        />
        <Route
          path="/keuangan/tambah"
          element={
            <RoleGuard allowedRoles={['owner']}>
              <FormKeuanganPage />
            </RoleGuard>
          }
        />
        <Route
          path="/keuangan/edit/:id"
          element={
            <RoleGuard allowedRoles={['owner']}>
              <FormKeuanganPage />
            </RoleGuard>
          }
        />

        {/* 05 & 06. Persediaan Bahan & Form Tambah/Edit Bahan (Owner Only) */}
        <Route
          path="/persediaan"
          element={
            <RoleGuard allowedRoles={['owner']}>
              <PersediaanPage />
            </RoleGuard>
          }
        />
        <Route
          path="/persediaan/tambah"
          element={
            <RoleGuard allowedRoles={['owner']}>
              <FormPersediaanPage />
            </RoleGuard>
          }
        />
        <Route
          path="/persediaan/edit/:id"
          element={
            <RoleGuard allowedRoles={['owner']}>
              <FormPersediaanPage />
            </RoleGuard>
          }
        />

        {/* 07 & 08. Pembelian Bahan & Form Tambah/Edit Pembelian (Owner Only) */}
        <Route
          path="/pembelian"
          element={
            <RoleGuard allowedRoles={['owner']}>
              <PembelianPage />
            </RoleGuard>
          }
        />
        <Route
          path="/pembelian/tambah"
          element={
            <RoleGuard allowedRoles={['owner']}>
              <FormPembelianPage />
            </RoleGuard>
          }
        />
        <Route
          path="/pembelian/edit/:id"
          element={
            <RoleGuard allowedRoles={['owner']}>
              <FormPembelianPage />
            </RoleGuard>
          }
        />

        {/* 09. Laporan Usaha (Owner Only) */}
        <Route
          path="/laporan"
          element={
            <RoleGuard allowedRoles={['owner']}>
              <LaporanPage />
            </RoleGuard>
          }
        />

        {/* 10 & 11. Manajemen Karyawan & Form Tambah/Edit Karyawan (Owner Only) */}
        <Route
          path="/karyawan"
          element={
            <RoleGuard allowedRoles={['owner']}>
              <KaryawanPage />
            </RoleGuard>
          }
        />
        <Route
          path="/karyawan/tambah"
          element={
            <RoleGuard allowedRoles={['owner']}>
              <FormKaryawanPage />
            </RoleGuard>
          }
        />
        <Route
          path="/karyawan/edit/:id"
          element={
            <RoleGuard allowedRoles={['owner']}>
              <FormKaryawanPage />
            </RoleGuard>
          }
        />

        {/* 12. Pengaturan (Owner Only) */}
        <Route
          path="/pengaturan"
          element={
            <RoleGuard allowedRoles={['owner']}>
              <PengaturanPage />
            </RoleGuard>
          }
        />

        {/* 13. Dashboard Karyawan (Employee Only) */}
        <Route
          path="/karyawan-dashboard"
          element={
            <RoleGuard allowedRoles={['employee']}>
              <EmployeeDashboardPage />
            </RoleGuard>
          }
        />

        {/* 14. Pencatatan Penjualan (Employee Only) */}
        <Route
          path="/penjualan"
          element={
            <RoleGuard allowedRoles={['employee']}>
              <PenjualanPage />
            </RoleGuard>
          }
        />

        {/* M06. Pencatatan Pengeluaran Karyawan (Employee Only) */}
        <Route
          path="/pengeluaran-karyawan"
          element={
            <RoleGuard allowedRoles={['employee']}>
              <PengeluaranKaryawanPage />
            </RoleGuard>
          }
        />

        {/* Penggunaan Bahan, Pengajuan Stok, Profil (Employee Only) */}
        <Route
          path="/penggunaan-bahan"
          element={
            <RoleGuard allowedRoles={['employee']}>
              <PenggunaanBahanPage />
            </RoleGuard>
          }
        />
        <Route
          path="/pengajuan-stok"
          element={
            <RoleGuard allowedRoles={['employee']}>
              <PengajuanStokPage />
            </RoleGuard>
          }
        />
        <Route
          path="/profil"
          element={
            <RoleGuard allowedRoles={['employee']}>
              <ProfilKaryawanPage />
            </RoleGuard>
          }
        />

        {/* 15. Riwayat Aktivitas (Shared according to role permissions) */}
        <Route
          path="/riwayat"
          element={
            <RoleGuard allowedRoles={['owner', 'employee']}>
              <RiwayatAktivitasPage />
            </RoleGuard>
          }
        />

        {/* Default Fallback */}
        <Route
          path="*"
          element={
            <Navigate
              to={
                !isAuthenticated || !user
                  ? '/login'
                  : user.role === 'owner'
                  ? '/dashboard'
                  : '/karyawan-dashboard'
              }
              replace
            />
          }
        />
      </Routes>
    </Suspense>
  );
};
