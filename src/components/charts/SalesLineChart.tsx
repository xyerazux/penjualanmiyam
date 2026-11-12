import React, { useState } from 'react';
import { DailyReportRow } from '../../types';
import { formatRupiah } from '../../utils/formatters';

interface SalesLineChartProps {
  reports: DailyReportRow[];
  compact?: boolean;
}

export const SalesLineChart: React.FC<SalesLineChartProps> = ({ reports, compact = false }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Use exact 8-point polyline geometry from 02_Dashboard_Pemilik.svg for desktop,
  // and map day labels & sales figures cleanly
  const chartData = [
    { label: 'Kam', date: '5 Nov', value: 890000, x: 40, y: 185 },
    { label: 'Jum', date: '6 Nov', value: reports[6]?.sales || 1490000, x: 130, y: 155 },
    { label: 'Sab', date: '7 Nov', value: reports[5]?.sales || 1560000, x: 220, y: 167 },
    { label: 'Min', date: '8 Nov', value: reports[4]?.sales || 910000, x: 310, y: 110 },
    { label: 'Sen', date: '9 Nov', value: reports[3]?.sales || 995000, x: 400, y: 130 },
    { label: 'Sel', date: '10 Nov', value: reports[2]?.sales || 1080000, x: 490, y: 75 },
    { label: 'Rab', date: '11 Nov', value: reports[1]?.sales || 1165000, x: 580, y: 97 },
    { label: 'Hari ini', date: '12 Nov', value: reports[0]?.sales || 1250000, x: 670, y: 40 },
  ];

  const pointsString = chartData.map((pt) => `${pt.x},${pt.y}`).join(' ');

  return (
    <div className="relative w-full">
      {hoveredIdx !== null && chartData[hoveredIdx] && (
        <div
          className="flex items-center justify-between mb-1 px-3 py-1 rounded-[8px] bg-[#EAF4EF] text-[#145B46] text-[11px] font-semibold"
          role="status"
        >
          <span>
            {chartData[hoveredIdx].label} ({chartData[hoveredIdx].date} 2026)
          </span>
          <span>{formatRupiah(chartData[hoveredIdx].value)}</span>
        </div>
      )}

      <svg
        viewBox="0 0 710 220"
        className={`w-full ${compact ? 'h-[135px]' : 'h-[195px] md:h-[215px]'} overflow-visible`}
        role="img"
        aria-label="Grafik penjualan 7 hari terakhir"
      >
        {/* Horizontal reference lines matching SVG (#E4EAE6) */}
        <line x1="35" y1="45" x2="685" y2="45" stroke="#E4EAE6" strokeWidth="1" />
        <line x1="35" y1="107" x2="685" y2="107" stroke="#E4EAE6" strokeWidth="1" />
        <line x1="35" y1="169" x2="685" y2="169" stroke="#E4EAE6" strokeWidth="1" />

        {/* Subtle area fill under line */}
        <polygon
          points={`40,195 ${pointsString} 670,195`}
          fill="#EAF4EF"
          fillOpacity="0.45"
        />

        {/* Main polyline matching SVG reference */}
        <polyline
          points={pointsString}
          fill="none"
          stroke="#145B46"
          strokeWidth={compact ? '3.5' : '4'}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {chartData.map((pt, idx) => (
          <g
            key={pt.label}
            className="cursor-pointer"
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            onClick={() => setHoveredIdx(idx === hoveredIdx ? null : idx)}
          >
            <circle cx={pt.x} cy={pt.y} r="14" fill="transparent" />
            <circle
              cx={pt.x}
              cy={pt.y}
              r={hoveredIdx === idx ? '7' : '5'}
              fill="#145B46"
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
            <text
              x={pt.x}
              y="208"
              textAnchor="middle"
              fontSize="10"
              fontWeight="500"
              fill={hoveredIdx === idx ? '#145B46' : '#738078'}
            >
              {pt.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

