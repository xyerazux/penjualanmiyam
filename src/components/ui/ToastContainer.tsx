import React from 'react';
import { useApp } from '../../services/AppContext';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-20 md:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-[calc(100vw-2rem)] sm:max-w-sm"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-2.5 px-4 py-3 rounded-[11px] border shadow-md text-[12px] font-semibold transition-all ${
            toast.type === 'warning'
              ? 'bg-[#FFF2E5] border-[#E89A45]/40 text-[#A96B22]'
              : toast.type === 'error'
              ? 'bg-[#FDECEC] border-[#B42318]/30 text-[#B42318]'
              : 'bg-[#FFFFFF] border-[#145B46]/30 text-[#1D2B25]'
          }`}
        >
          {toast.type === 'warning' || toast.type === 'error' ? (
            <AlertTriangle className="w-4 h-4 shrink-0 text-[#A96B22]" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#145B46]" />
          )}
          <span className="flex-1 leading-snug">{toast.message}</span>
          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            aria-label="Tutup notifikasi"
            className="p-0.5 rounded hover:bg-black/5 text-[#738078] cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

