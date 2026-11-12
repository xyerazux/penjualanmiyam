import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useApp } from '../../services/AppContext';
import { ToastContainer } from '../../components/ui/ToastContainer';

export const LoginPage: React.FC = () => {
  const { user, isAuthenticated, login } = useApp();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // If already logged in, redirect to the user's role-specific dashboard
  if (isAuthenticated && user) {
    return (
      <Navigate
        to={user.role === 'owner' ? '/dashboard' : '/karyawan-dashboard'}
        replace
      />
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim()) {
      setError('Mohon masukkan email atau username terlebih dahulu.');
      return;
    }
    if (!password.trim()) {
      setError('Mohon masukkan kata sandi terlebih dahulu.');
      return;
    }

    const result = login(identifier, password);
    if (!result.success) {
      setError(result.message || 'Email/username atau kata sandi salah.');
      return;
    }

    navigate(result.role === 'owner' ? '/dashboard' : '/karyawan-dashboard', {
      replace: true,
    });
  };

  return (
    <div className="min-h-screen w-full bg-[#F1F5F2] flex flex-col lg:flex-row overflow-x-hidden">
      {/* Left Hero Panel (Matches 01_Login_Pemilik.svg: width 650 on 1440, fill #145B46) */}
      <div className="w-full lg:w-[45.14%] lg:min-h-screen bg-[#145B46] px-6 sm:px-12 lg:px-[80px] py-10 lg:py-[92px] flex flex-col justify-between text-white">
        <div>
          <h1 className="text-[32px] sm:text-[42px] xl:text-[46px] font-extrabold tracking-tight text-[#FFFFFF] leading-[1.1]">
            Monitoring Penjualan
          </h1>
          <p className="mt-2.5 text-[12px] sm:text-[13px] font-bold tracking-[0.04em] text-[#D8E9E1] uppercase">
            SISTEM MONITORING OPERASIONAL
          </p>
        </div>

        <div className="my-10 lg:my-0">
          <h2 className="text-[26px] sm:text-[34px] font-[750] text-[#FFFFFF] leading-[1.28]">
            Operasional rapi,
            <br />
            kedai lebih terkendali.
          </h2>
          <p className="mt-5 text-[14px] sm:text-[15px] font-normal text-[#D8E9E1] leading-[1.65]">
            Kelola penjualan, stok, dan keuangan
            <br />
            dalam satu tempat.
          </p>
        </div>

        <div className="hidden lg:block text-[11px] text-[#D8E9E1]/80">
          Monitoring Penjualan — Sistem Operasional Kedai Mie Ayam
        </div>
      </div>

      {/* Right Login Card Container (Matches 01_Login_Pemilik.svg: width 500, height 520, rx 18) */}
      <div className="flex-1 flex items-center justify-center p-5 sm:p-10 lg:p-12">
        <div className="w-full max-w-[500px] min-h-[520px] rounded-[18px] bg-[#FFFFFF] border border-[#E4EAE6] px-6 sm:px-[55px] py-8 sm:py-[56px] flex flex-col justify-between">
          <div>
            <h2 className="text-[24px] sm:text-[26px] font-[750] text-[#1D2B25] leading-tight">
              Selamat datang
            </h2>
            <p className="mt-2 text-[13px] font-normal text-[#738078]">
              Masuk untuk melanjutkan ke Monitoring Penjualan.
            </p>

            {error && (
              <div
                role="alert"
                className="mt-5 px-3.5 py-2.5 rounded-[8px] bg-[#FDECEC] border border-[#B42318]/25 text-[#B42318] text-[11px] font-semibold"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-[34px]">
              <div>
                <label
                  htmlFor="login-identifier"
                  className="block text-[12px] font-[650] text-[#1D2B25]"
                >
                  Email / Username
                </label>
                <input
                  id="login-identifier"
                  type="text"
                  autoComplete="username"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    setError('');
                  }}
                  placeholder="Masukkan email atau username"
                  className="mt-[12px] w-full h-[46px] rounded-[8px] bg-[#FFFFFF] border border-[#E4EAE6] px-[17px] text-[12px] text-[#1D2B25] placeholder-[#A0AAA4] focus:outline-none focus:border-[#145B46]"
                />
              </div>

              <div className="mt-[26px]">
                <label
                  htmlFor="login-password"
                  className="block text-[12px] font-[650] text-[#1D2B25]"
                >
                  Kata sandi
                </label>
                <input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Masukkan kata sandi"
                  className="mt-[12px] w-full h-[46px] rounded-[8px] bg-[#FFFFFF] border border-[#E4EAE6] px-[17px] text-[12px] text-[#1D2B25] placeholder-[#A0AAA4] focus:outline-none focus:border-[#145B46]"
                />
              </div>

              <button
                type="submit"
                className="mt-[48px] w-full h-[38px] rounded-[8px] bg-[#145B46] hover:bg-[#0F4736] text-[#FFFFFF] text-[12px] font-semibold flex items-center justify-start px-[14px] transition-colors cursor-pointer"
              >
                Masuk ke dashboard
              </button>
            </form>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};
