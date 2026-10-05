import { useState, useRef, useMemo, memo } from 'react';
import type { SessionHistoryPoint } from '../../hooks/useTypingGame';

interface SessionPerformanceGraphProps {
  history: SessionHistoryPoint[];
  durationSeconds?: number;
}

function buildSmoothPath(points: { x: number; y: number }[], tension = 0.25): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M${points[0].x},${points[0].y}`;
  if (points.length === 2) {
    return `M${points[0].x},${points[0].y}L${points[1].x},${points[1].y}`;
  }

  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    const cp1x = p1.x + ((p2.x - p0.x) * tension) / 3;
    const cp1y = p1.y + ((p2.y - p0.y) * tension) / 3;
    const cp2x = p2.x - ((p3.x - p1.x) * tension) / 3;
    const cp2y = p2.y - ((p3.y - p1.y) * tension) / 3;

    d += `C${cp1x},${cp1y},${cp2x},${cp2y},${p2.x},${p2.y}`;
  }
  return d;
}

function SessionPerformanceGraphComponent({ history }: SessionPerformanceGraphProps) {
  const [hoveredPoint, setHoveredPoint] = useState<{
    x: number;
    y: number;
    point: SessionHistoryPoint;
  } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const pointsData = useMemo(() => {
    if (!history || history.length === 0) return null;

    // Ensure points start at second 1 if only 1 point
    const pts = history.length === 1 && history[0].second === 0
      ? [{ ...history[0], second: 1 }]
      : history;

    const maxWpm = Math.max(...pts.map((p) => Math.max(p.wpm, p.rawWpm || 0)), 10);
    const maxSec = Math.max(...pts.map((p) => p.second), 1);

    const yMax = Math.ceil(maxWpm / 10) * 10 + 10;
    const yTicks = [0, Math.round(yMax / 2), yMax];
    const xTicks = pts.filter((_, idx) => idx === 0 || idx === pts.length - 1 || idx % Math.ceil(pts.length / 5) === 0);

    return {
      pts,
      yMax,
      maxSec,
      yTicks,
      xTicks,
    };
  }, [history]);

  if (!pointsData || pointsData.pts.length < 2) {
    return (
      <div className="py-4 text-center text-xs text-neutral-500 font-mono">
        Speed telemetry graph records on sessions longer than 2 seconds.
      </div>
    );
  }

  const { pts, yMax, maxSec, yTicks, xTicks } = pointsData;

  const width = 420;
  const height = 130;
  const pad = { top: 12, right: 24, bottom: 24, left: 32 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  const netPoints = pts.map((p) => ({
    x: pad.left + (p.second / maxSec) * plotW,
    y: pad.top + (1 - p.wpm / yMax) * plotH,
  }));

  const rawPoints = pts.map((p) => ({
    x: pad.left + (p.second / maxSec) * plotW,
    y: pad.top + (1 - (p.rawWpm || p.wpm) / yMax) * plotH,
  }));

  const netLine = buildSmoothPath(netPoints);
  const rawLine = buildSmoothPath(rawPoints);
  const areaPath = netLine + `L${netPoints[netPoints.length - 1].x},${pad.top + plotH}L${netPoints[0].x},${pad.top + plotH}Z`;

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const clampedX = Math.max(pad.left, Math.min(pad.left + plotW, mouseX));

    // Find nearest point
    let nearest = pts[0];
    let nearestDist = Infinity;
    let nearestIdx = 0;

    pts.forEach((p, idx) => {
      const px = pad.left + (p.second / maxSec) * plotW;
      const dist = Math.abs(px - clampedX);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = p;
        nearestIdx = idx;
      }
    });

    setHoveredPoint({
      x: netPoints[nearestIdx].x,
      y: netPoints[nearestIdx].y,
      point: nearest,
    });
  };

  return (
    <div className="w-full relative my-2 bg-neutral-100/50 dark:bg-neutral-850/50 rounded-xl p-3 border border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center justify-between text-[11px] mb-1.5 font-mono">
        <span className="text-neutral-500 font-semibold uppercase tracking-wider">Test Velocity Timeline</span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-[2.5px] bg-emerald-500 rounded-full" />
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Net WPM</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-[1.5px] bg-neutral-400 rounded-full" />
            <span className="text-neutral-500">Raw WPM</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-red-500 font-semibold">Errors</span>
          </span>
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto select-none overflow-visible"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredPoint(null)}
      >
        <defs>
          <linearGradient id="sessionWpmGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal gridlines */}
        {yTicks.map((val) => {
          const y = pad.top + (1 - val / yMax) * plotH;
          return (
            <g key={val}>
              <line
                x1={pad.left}
                y1={y}
                x2={pad.left + plotW}
                y2={y}
                stroke="currentColor"
                className="text-neutral-300 dark:text-neutral-700/60"
                strokeWidth={0.8}
                strokeDasharray="3,3"
              />
              <text
                x={pad.left - 6}
                y={y + 3}
                textAnchor="end"
                className="text-[9px] font-mono fill-neutral-500 dark:fill-neutral-400"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Time X-axis ticks */}
        {xTicks.map((p) => {
          const x = pad.left + (p.second / maxSec) * plotW;
          return (
            <text
              key={p.second}
              x={x}
              y={height - 6}
              textAnchor="middle"
              className="text-[9px] font-mono fill-neutral-500 dark:fill-neutral-400"
            >
              {p.second}s
            </text>
          );
        })}

        {/* Net WPM Area Fill */}
        <path d={areaPath} fill="url(#sessionWpmGrad)" />

        {/* Raw WPM Line */}
        <path
          d={rawLine}
          fill="none"
          stroke="#94a3b8"
          strokeWidth={1.5}
          strokeDasharray="4,4"
          strokeLinecap="round"
        />

        {/* Net WPM Line */}
        <path
          d={netLine}
          fill="none"
          stroke="#10b981"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Error points */}
        {pts.map((p, idx) => {
          if (!p.errors || p.errors <= 0) return null;
          const x = netPoints[idx].x;
          const y = netPoints[idx].y;
          return (
            <g key={`err-${idx}`}>
              <circle cx={x} cy={y} r={3.5} fill="#ef4444" stroke="#ffffff" strokeWidth={1} />
              <text
                x={x}
                y={y - 5}
                textAnchor="middle"
                className="text-[8px] font-bold fill-red-500 dark:fill-red-400 font-mono"
              >
                ✕{p.errors}
              </text>
            </g>
          );
        })}

        {/* Interactive Hover Point */}
        {hoveredPoint && (
          <g>
            <line
              x1={hoveredPoint.x}
              y1={pad.top}
              x2={hoveredPoint.x}
              y2={pad.top + plotH}
              stroke="#10b981"
              strokeWidth={1}
              strokeDasharray="2,2"
              opacity={0.6}
            />
            <circle cx={hoveredPoint.x} cy={hoveredPoint.y} r={4.5} fill="#10b981" stroke="#fff" strokeWidth={1.5} />
          </g>
        )}
      </svg>

      {/* Hover Tooltip Box */}
      {hoveredPoint && (
        <div
          className="absolute z-30 pointer-events-none px-2 py-1 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-md text-[10px] font-mono shadow-md flex items-center gap-2 transform -translate-x-1/2"
          style={{
            left: `${(hoveredPoint.x / width) * 100}%`,
            top: `${Math.max(10, (hoveredPoint.y / height) * 100 - 30)}%`,
          }}
        >
          <span>{hoveredPoint.point.second}s</span>
          <span className="text-emerald-400 dark:text-emerald-600 font-bold">{hoveredPoint.point.wpm} net</span>
          <span className="opacity-75">{hoveredPoint.point.rawWpm || hoveredPoint.point.wpm} raw</span>
          {hoveredPoint.point.errors > 0 && (
            <span className="text-red-400 dark:text-red-600 font-bold">✕{hoveredPoint.point.errors}</span>
          )}
        </div>
      )}
    </div>
  );
}

export default memo(SessionPerformanceGraphComponent);
