import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TypingSessionRecord } from '../../utils/secureStorage';
import { useTheme } from '../../hooks/useTheme';

export type ChartFilter = 'all' | 'lesson' | 'timed' | 'code' | 'custom';

interface WpmProgressChartProps {
  sessions: TypingSessionRecord[];
  activeFilter?: ChartFilter;
  onFilterChange?: (filter: ChartFilter) => void;
}

interface TooltipData {
  x: number;
  y: number;
  session: TypingSessionRecord;
  index: number;
}

// ─── Helpers ────────────────────────────────────────────────────────
function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function niceStep(range: number, targetTicks: number): number {
  const rough = range / targetTicks;
  const mag = Math.pow(10, Math.floor(Math.log10(rough)));
  const residual = rough / mag;
  let nice: number;
  if (residual <= 1.5) nice = 1;
  else if (residual <= 3) nice = 2;
  else if (residual <= 7) nice = 5;
  else nice = 10;
  return nice * mag;
}

function generateTicks(min: number, max: number, targetTicks: number): number[] {
  if (max <= min) return [min];
  const step = niceStep(max - min, targetTicks);
  const start = Math.floor(min / step) * step;
  const ticks: number[] = [];
  for (let t = start; t <= max + step * 0.01; t += step) {
    ticks.push(Math.round(t));
  }
  return ticks;
}

// Create smooth SVG path (cardinal spline)
function buildSmoothPath(
  points: { x: number; y: number }[],
  tension = 0.3
): string {
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

// ─── Chart Colors ───────────────────────────────────────────────────
const COLORS = {
  light: {
    wpmStroke: '#059669',
    wpmGradientTop: 'rgba(16, 185, 129, 0.35)',
    wpmGradientBot: 'rgba(16, 185, 129, 0.02)',
    accStroke: '#7c3aed',
    accGradientTop: 'rgba(124, 58, 237, 0.22)',
    accGradientBot: 'rgba(124, 58, 237, 0.01)',
    gridLine: '#e5e5e5',
    axisText: '#737373',
    dotFill: '#ffffff',
    dotStroke: '#059669',
    accDotFill: '#ffffff',
    accDotStroke: '#7c3aed',
    tooltipBg: '#ffffff',
    tooltipBorder: '#cbd5e1',
    tooltipText: '#059669',
    tooltipSubtext: '#64748b',
    avgLine: '#2563eb',
  },
  dark: {
    wpmStroke: '#10b981',
    wpmGradientTop: 'rgba(16, 185, 129, 0.38)',
    wpmGradientBot: 'rgba(16, 185, 129, 0.01)',
    accStroke: '#a855f7',
    accGradientTop: 'rgba(168, 85, 247, 0.28)',
    accGradientBot: 'rgba(168, 85, 247, 0.01)',
    gridLine: '#262626',
    axisText: '#737373',
    dotFill: '#0a0a0a',
    dotStroke: '#34d399',
    accDotFill: '#0a0a0a',
    accDotStroke: '#c084fc',
    tooltipBg: '#171717',
    tooltipBorder: '#334155',
    tooltipText: '#34d399',
    tooltipSubtext: '#94a3b8',
    avgLine: '#38bdf8',
  },
};

// ─── Constants ──────────────────────────────────────────────────────
const CHART_HEIGHT = 240;
const CHART_PADDING = { top: 20, right: 24, bottom: 36, left: 48 };

const FILTER_LABELS: Record<ChartFilter, string> = {
  all: 'All',
  lesson: 'Lessons',
  timed: 'Timed',
  code: 'Code',
  custom: 'Custom',
};

// ─── Main Component ─────────────────────────────────────────────────
export default function WpmProgressChart({ sessions, activeFilter, onFilterChange }: WpmProgressChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const colors = isDark ? COLORS.dark : COLORS.light;

  const [filter, setFilter] = useState<ChartFilter>(activeFilter || 'all');

  useEffect(() => {
    if (activeFilter) {
      setFilter(activeFilter);
    }
  }, [activeFilter]);
  const [showAccuracy, setShowAccuracy] = useState(true);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(600);

  useEffect(() => {
    const el = chartContainerRef.current;
    if (!el) return;
    const update = () => {
      if (chartContainerRef.current) {
        setChartWidth(Math.max(280, Math.floor(chartContainerRef.current.clientWidth)));
      }
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ── Filtered sessions ───────────────────────────────────────────
  const filteredSessions = useMemo(() => {
    if (filter === 'all') return sessions;
    return sessions.filter((s) => s.mode === filter);
  }, [sessions, filter]);

  // ── Chart geometry ──────────────────────────────────────────────
  const chartData = useMemo(() => {
    const data = filteredSessions;
    if (data.length === 0) return null;

    const wpmValues = data.map((s) => s.wpm);
    const accValues = data.map((s) => s.accuracy);

    const wpmMin = Math.max(0, Math.min(...wpmValues) - 5);
    const wpmMax = Math.max(...wpmValues) + 5;
    const accMin = Math.max(0, Math.min(...accValues) - 5);
    const accMax = Math.min(100, Math.max(...accValues) + 5);

    const avgWpm = Math.round(
      wpmValues.reduce((a, b) => a + b, 0) / wpmValues.length
    );

    return {
      data,
      wpmMin,
      wpmMax,
      accMin,
      accMax,
      avgWpm,
      wpmTicks: generateTicks(wpmMin, wpmMax, 5),
      accTicks: generateTicks(accMin, accMax, 4),
    };
  }, [filteredSessions]);

  // ── Mouse interaction ───────────────────────────────────────────
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!chartData || !svgRef.current) return;
      const svg = svgRef.current;
      const rect = svg.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;

      const plotLeft = CHART_PADDING.left;
      const plotRight = chartWidth - CHART_PADDING.right;
      const plotWidth = plotRight - plotLeft;

      const n = chartData.data.length;
      if (n === 0 || plotWidth <= 0) return;

      const stepX = n > 1 ? plotWidth / (n - 1) : 0;
      const idx = n > 1
        ? clamp(Math.round((mouseX - plotLeft) / stepX), 0, n - 1)
        : 0;

      const session = chartData.data[idx];
      const x = plotLeft + idx * stepX;
      const plotHeight = CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom;
      const yNorm = 1 - (session.wpm - chartData.wpmMin) / (chartData.wpmMax - chartData.wpmMin || 1);
      const y = CHART_PADDING.top + yNorm * plotHeight;

      setTooltip({ x, y, session, index: idx });
    },
    [chartData, chartWidth]
  );

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  // ── Stats mini-badges ───────────────────────────────────────────
  const trendInfo = useMemo(() => {
    if (filteredSessions.length < 2) return null;
    const recent5 = filteredSessions.slice(-5);
    const older5 = filteredSessions.slice(-10, -5);
    if (older5.length === 0) return null;

    const recentAvg = Math.round(
      recent5.reduce((a, s) => a + s.wpm, 0) / recent5.length
    );
    const olderAvg = Math.round(
      older5.reduce((a, s) => a + s.wpm, 0) / older5.length
    );
    const diff = recentAvg - olderAvg;
    return { diff, recentAvg, olderAvg };
  }, [filteredSessions]);

  // ── Render empty state ──────────────────────────────────────────
  if (sessions.length === 0) {
    return (
      <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden bg-neutral-50 dark:bg-neutral-950">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
          <h3 className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">
            WPM Progress
          </h3>
        </div>
        <div className="py-16 text-center space-y-1.5">
          <p className="text-neutral-700 dark:text-neutral-300 text-sm font-medium">
            No data to visualize yet.
          </p>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            Complete a few sessions to see your progress chart.
          </p>
        </div>
      </div>
    );
  }

  // ── Build SVG paths ─────────────────────────────────────────────
  const renderChart = (containerWidth: number) => {
    if (!chartData) return null;

    const { data, wpmMin, wpmMax, accMin, accMax, avgWpm, wpmTicks, accTicks } = chartData;
    const n = data.length;

    const plotLeft = CHART_PADDING.left;
    const plotRight = containerWidth - CHART_PADDING.right;
    const plotTop = CHART_PADDING.top;
    const plotBottom = CHART_HEIGHT - CHART_PADDING.bottom;
    const plotWidth = plotRight - plotLeft;
    const plotHeight = plotBottom - plotTop;

    const stepX = n > 1 ? plotWidth / (n - 1) : 0;

    const wpmRange = wpmMax - wpmMin || 1;
    const accRange = accMax - accMin || 1;

    // Map data → SVG coords
    const wpmPoints = data.map((s, i) => ({
      x: plotLeft + i * stepX,
      y: plotTop + (1 - (s.wpm - wpmMin) / wpmRange) * plotHeight,
    }));

    const accPoints = data.map((s, i) => ({
      x: plotLeft + i * stepX,
      y: plotTop + (1 - (s.accuracy - accMin) / accRange) * plotHeight,
    }));

    const wpmLinePath = buildSmoothPath(wpmPoints, 0.25);
    const wpmAreaPath = wpmLinePath + `L${wpmPoints[n - 1].x},${plotBottom}L${wpmPoints[0].x},${plotBottom}Z`;

    const accLinePath = buildSmoothPath(accPoints, 0.25);
    const accAreaPath = accLinePath + `L${accPoints[n - 1].x},${plotBottom}L${accPoints[0].x},${plotBottom}Z`;

    // Avg WPM y position
    const avgY = plotTop + (1 - (avgWpm - wpmMin) / wpmRange) * plotHeight;

    // Unique gradient IDs scoped to dark/light
    const gWpm = `wpmGrad-${isDark ? 'd' : 'l'}`;
    const gAcc = `accGrad-${isDark ? 'd' : 'l'}`;

    return (
      <svg
        ref={svgRef}
        width="100%"
        height={CHART_HEIGHT}
        viewBox={`0 0 ${containerWidth} ${CHART_HEIGHT}`}
        className="select-none w-full"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >

        <defs>
          {/* WPM area gradient */}
          <linearGradient id={gWpm} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.wpmGradientTop} />
            <stop offset="100%" stopColor={colors.wpmGradientBot} />
          </linearGradient>
          {/* Accuracy area gradient */}
          <linearGradient id={gAcc} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.accGradientTop} />
            <stop offset="100%" stopColor={colors.accGradientBot} />
          </linearGradient>
        </defs>

        {/* Grid lines (WPM axis) */}
        {wpmTicks.map((tick) => {
          const y = plotTop + (1 - (tick - wpmMin) / wpmRange) * plotHeight;
          if (y < plotTop - 1 || y > plotBottom + 1) return null;
          return (
            <g key={`wt-${tick}`}>
              <line
                x1={plotLeft}
                y1={y}
                x2={plotRight}
                y2={y}
                stroke={colors.gridLine}
                strokeWidth={1}
                strokeDasharray="4,4"
              />
              <text
                x={plotLeft - 8}
                y={y + 3.5}
                textAnchor="end"
                fill={colors.axisText}
                fontSize={10}
                fontFamily="JetBrains Mono, Fira Code, monospace"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* Accuracy axis ticks (right side) */}
        {showAccuracy &&
          accTicks.map((tick) => {
            const y = plotTop + (1 - (tick - accMin) / accRange) * plotHeight;
            if (y < plotTop - 1 || y > plotBottom + 1) return null;
            return (
              <text
                key={`at-${tick}`}
                x={plotRight + 8}
                y={y + 3.5}
                textAnchor="start"
                fill={colors.accStroke}
                fontSize={10}
                fontFamily="JetBrains Mono, Fira Code, monospace"
                opacity={0.6}
              >
                {tick}%
              </text>
            );
          })}

        {/* X-axis session labels */}
        {data.map((_, i) => {
          const stepDivisor = chartWidth < 420 ? 4 : chartWidth < 640 ? 6 : 8;
          const showLabel =
            n <= 8 || i === 0 || i === n - 1 || i % Math.ceil(n / stepDivisor) === 0;
          if (!showLabel) return null;
          const x = plotLeft + i * stepX;
          return (
            <text
              key={`xl-${i}`}
              x={x}
              y={plotBottom + 16}
              textAnchor="middle"
              fill={colors.axisText}
              fontSize={9}
              fontFamily="JetBrains Mono, Fira Code, monospace"
            >
              #{i + 1}
            </text>
          );
        })}

        {/* Average WPM dashed line */}
        <line
          x1={plotLeft}
          y1={avgY}
          x2={plotRight}
          y2={avgY}
          stroke={colors.avgLine}
          strokeWidth={1.5}
          strokeDasharray="6,4"
          opacity={0.8}
        />
        <text
          x={plotRight}
          y={avgY - 6}
          textAnchor="end"
          fill={colors.avgLine}
          fontSize={10}
          fontWeight="bold"
          fontFamily="JetBrains Mono, Fira Code, monospace"
          opacity={0.9}
        >
          avg {avgWpm} wpm
        </text>

        {/* Accuracy area + line (behind WPM) */}
        {showAccuracy && n > 1 && (
          <g opacity={0.85}>
            <path d={accAreaPath} fill={`url(#${gAcc})`} />
            <path
              d={accLinePath}
              fill="none"
              stroke={colors.accStroke}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        )}

        {/* WPM area fill */}
        {n > 1 && <path d={wpmAreaPath} fill={`url(#${gWpm})`} />}

        {/* WPM line */}
        <path
          d={wpmLinePath}
          fill="none"
          stroke={colors.wpmStroke}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Accuracy dots */}
        {showAccuracy &&
          accPoints.map((p, i) => (
            <circle
              key={`ad-${i}`}
              cx={p.x}
              cy={p.y}
              r={n > 20 ? 2 : 3}
              fill={colors.accDotFill}
              stroke={colors.accDotStroke}
              strokeWidth={1.5}
              opacity={tooltip?.index === i ? 1 : 0.5}
            />
          ))}

        {/* WPM dots */}
        {wpmPoints.map((p, i) => (
          <circle
            key={`wd-${i}`}
            cx={p.x}
            cy={p.y}
            r={tooltip?.index === i ? (n > 20 ? 4.5 : 5.5) : n > 20 ? 2.5 : 3.5}
            fill={tooltip?.index === i ? colors.wpmStroke : colors.dotFill}
            stroke={colors.dotStroke}
            strokeWidth={tooltip?.index === i ? 2.5 : 1.5}
            style={{
              transition: 'r 0.15s ease, fill 0.15s ease, stroke-width 0.15s ease',
            }}
          />
        ))}

        {/* Hover crosshair */}
        {tooltip && (
          <g>
            <line
              x1={tooltip.x}
              y1={plotTop}
              x2={tooltip.x}
              y2={plotBottom}
              stroke={colors.wpmStroke}
              strokeWidth={1}
              strokeDasharray="2,3"
              opacity={0.25}
            />
          </g>
        )}
      </svg>
    );
  };

  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden bg-neutral-50 dark:bg-neutral-950">
      {/* Header */}
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h3 className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">
            WPM Progress
          </h3>

          {/* Trend badge */}
          {trendInfo && (
            <span
              className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold font-mono border ${
                trendInfo.diff > 0
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                  : trendInfo.diff < 0
                  ? 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30'
                  : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-300 dark:border-neutral-700'
              }`}
            >
              {trendInfo.diff > 0 ? '↑' : trendInfo.diff < 0 ? '↓' : '→'}
              {Math.abs(trendInfo.diff)} wpm
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Accuracy toggle */}
          <button
            type="button"
            role="switch"
            aria-checked={showAccuracy}
            aria-label={showAccuracy ? 'Hide accuracy line on chart' : 'Show accuracy line on chart'}
            onClick={() => setShowAccuracy(!showAccuracy)}
            className={`px-2.5 py-1 text-[10px] font-medium rounded-md border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500 ${
              showAccuracy
                ? 'border-purple-400 dark:border-purple-600 bg-purple-500/15 text-purple-700 dark:text-purple-300 font-semibold shadow-xs'
                : 'border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            Accuracy
          </button>

          {/* Filter tabs */}
          <div role="tablist" aria-label="Chart time range filters" className="flex items-center border border-neutral-200 dark:border-neutral-700 rounded-md overflow-hidden">
            {(Object.keys(FILTER_LABELS) as ChartFilter[]).map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={filter === key}
                aria-label={`Show ${FILTER_LABELS[key]} progress chart`}
                onClick={() => {
                  setFilter(key);
                  onFilterChange?.(key);
                }}
                className={`px-2.5 py-1 text-[10px] font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white ${
                  filter === key
                    ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                }`}
              >
                {FILTER_LABELS[key]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart body */}
      <div className="relative p-4 pt-2">
        {/* Axis labels */}
        <div className="flex items-center justify-between px-1 mb-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold">
            wpm
          </span>
          {showAccuracy && (
            <span className="text-[10px] font-mono uppercase tracking-widest text-purple-600 dark:text-purple-400 font-bold">
              accuracy %
            </span>
          )}
        </div>

        {filteredSessions.length === 0 ? (
          <div className="py-12 text-center text-neutral-600 dark:text-neutral-400 text-xs">
            No sessions for this filter.
          </div>
        ) : (
          <div ref={chartContainerRef} className="relative">
            {renderChart(chartWidth)}

            {/* Tooltip */}
            <AnimatePresence>
              {tooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }}
                  transition={{ duration: 0.12 }}
                  className="absolute z-20 pointer-events-none"
                  style={{
                    left: `${tooltip.x}px`,
                    top: `${tooltip.y - 8}px`,
                    transform: `translate(${tooltip.x > chartWidth * 0.7 ? '-100%' : tooltip.x < chartWidth * 0.3 ? '0%' : '-50%'}, -100%)`,
                  }}
                >
                  <div
                    className="rounded-lg shadow-lg px-3 py-2 min-w-[140px]"
                    style={{
                      background: colors.tooltipBg,
                      border: `1px solid ${colors.tooltipBorder}`,
                    }}
                  >
                    <div
                      className="text-xs font-bold mb-1"
                      style={{ color: colors.wpmStroke }}
                    >
                      {tooltip.session.wpm}{' '}
                      <span className="font-normal text-[11px] opacity-80" style={{ color: colors.tooltipSubtext }}>
                        wpm
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className="text-[10px] font-semibold"
                        style={{ color: colors.accStroke }}
                      >
                        {tooltip.session.accuracy}% acc
                      </span>
                      <span
                        className="text-[10px] font-medium text-amber-600 dark:text-amber-400"
                      >
                        {tooltip.session.maxCombo}x combo
                      </span>
                    </div>
                    <div
                      className="text-[9px] mt-1 font-medium"
                      style={{ color: colors.tooltipSubtext }}
                    >
                      {tooltip.session.modeLabel ||
                        (tooltip.session.level > 0
                          ? `Level ${tooltip.session.level}`
                          : 'Practice')}{' '}
                      · {tooltip.session.date}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center justify-center gap-5 mt-3">
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block w-3.5 h-[3px] rounded-full shadow-xs"
              style={{ background: colors.wpmStroke }}
            />
            <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
              WPM (Speed)
            </span>
          </div>
          {showAccuracy && (
            <div className="flex items-center gap-1.5">
              <span
                className="inline-block w-3.5 h-[3px] rounded-full shadow-xs"
                style={{ background: colors.accStroke }}
              />
              <span className="text-[10px] font-semibold text-purple-700 dark:text-purple-400">
                Accuracy (%)
              </span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block w-4 h-[2px] rounded-full"
              style={{
                background: colors.avgLine,
                borderTop: `2px dashed ${colors.avgLine}`,
              }}
            />
            <span className="text-[10px] font-semibold text-blue-700 dark:text-sky-400">
              Average
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
