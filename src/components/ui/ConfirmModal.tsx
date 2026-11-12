import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  description,
  confirmLabel = 'Ya, Hapus',
  cancelLabel = 'Batal',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div className="w-full max-w-[400px] rounded-[13px] bg-white border border-[#E4EAE6] p-5 shadow-lg">
        <h3 id="confirm-modal-title" className="text-[16px] font-bold text-[#1D2B25]">
          {title}
        </h3>
        <p className="mt-2 text-[13px] text-[#738078] leading-relaxed">{description}</p>
        <div className="mt-5 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="h-[38px] px-4 rounded-[8px] border border-[#145B46] bg-white text-[12px] font-semibold text-[#145B46] hover:bg-[#EAF4EF] transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-[38px] px-4 rounded-[8px] bg-[#B42318] text-[12px] font-semibold text-white hover:bg-[#911C13] transition-colors cursor-pointer"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

