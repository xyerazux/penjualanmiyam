import React from 'react';

interface StatusBadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'danger' | 'neutral';
  onClick?: () => void;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  variant,
  onClick,
  className = '',
}) => {
  // Auto-detect variant from label if not explicitly provided
  const resolvedVariant =
    variant ||
    (label === 'Menipis' ||
    label === 'Perlu dicek' ||
    label === 'Menunggu' ||
    label === 'Diproses' ||
    label === 'Cuti'
      ? 'warning'
      : label === 'Nonaktif' || label === 'Habis' || label === 'Ditolak'
      ? 'danger'
      : 'success');

  const colorClasses =
    resolvedVariant === 'warning'
      ? 'bg-[#FFF2E5] text-[#A96B22]'
      : resolvedVariant === 'danger'
      ? 'bg-[#FDECEC] text-[#B42318]'
      : resolvedVariant === 'neutral'
      ? 'bg-[#F5F7F5] text-[#738078]'
      : 'bg-[#EAF4EF] text-[#145B46]';

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center justify-center h-[25px] px-3 rounded-[13px] text-[11px] font-semibold transition-opacity hover:opacity-85 cursor-pointer select-none ${colorClasses} ${className}`}
      >
        {label}
      </button>
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center h-[25px] px-3 rounded-[13px] text-[11px] font-semibold select-none ${colorClasses} ${className}`}
    >
      {label}
    </span>
  );
};

