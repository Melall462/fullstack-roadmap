import { useEffect, useRef, useState } from "react"
import { formatMoney } from "../utils/date"

export type Bucket = { label: string, fullLabel: string, value: number }

const HEIGHT = 240
const MARGIN = { top: 24, right: 8, bottom: 28, left: 56 }
const MAX_BAR = 24

function niceStep(max: number): number {
    const rough = max / 4
    const power = 10 ** Math.floor(Math.log10(rough))
    const unit = rough / power
    return (unit <= 1 ? 1 : unit <= 2 ? 2 : unit <= 5 ? 5 : 10) * power
}

function tickLabel(value: number, top: number): string {
    if (top >= 10000) return `$${Math.round(value / 1000)}K`
    return `$${value.toLocaleString("en-NZ")}`
}

// Column with a 4px rounded top and a square base.
function barPath(x: number, y: number, width: number, height: number): string {
    const r = Math.min(4, width / 2, height)
    return `M${x},${y + height}V${y + r}Q${x},${y} ${x + r},${y}H${x + width - r}Q${x + width},${y} ${x + width},${y + r}V${y + height}Z`
}

function useWidth<T extends HTMLElement>() {
    const ref = useRef<T>(null)
    const [width, setWidth] = useState(0)
    useEffect(() => {
        const element = ref.current
        if (!element) return
        const observer = new ResizeObserver(([entry]) => entry && setWidth(entry.contentRect.width))
        observer.observe(element)
        return () => observer.disconnect()
    }, [])
    return [ref, width] as const
}

// Single-series column chart: one colour (the accent), so no legend box.
function RevenueChart({ buckets }: { buckets: Bucket[] }) {
    const [ref, width] = useWidth<HTMLDivElement>()
    const [active, setActive] = useState<number | null>(null)

    const plotWidth = Math.max(0, width - MARGIN.left - MARGIN.right)
    const plotHeight = HEIGHT - MARGIN.top - MARGIN.bottom
    const dataMax = Math.max(0, ...buckets.map((b) => b.value))
    const step = niceStep(dataMax || 100)
    const top = Math.max(step, Math.ceil(dataMax / step) * step)
    const ticks = Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step)

    const band = buckets.length ? plotWidth / buckets.length : 0
    const barWidth = Math.min(MAX_BAR, band * 0.6)
    const y = (value: number) => MARGIN.top + plotHeight - (value / top) * plotHeight
    const labelEvery = Math.ceil(buckets.length / Math.max(1, Math.floor(plotWidth / 56)))
    const peakIndex = dataMax > 0 ? buckets.findIndex((b) => b.value === dataMax) : -1

    const activeBucket = active !== null ? buckets[active] : undefined

    return (
        <div ref={ref} className="chart">
            {width > 0 &&
                <svg width={width} height={HEIGHT} role="img" aria-label="Revenue from finished jobs over time">
                    {ticks.map((tick) => (
                        <g key={tick}>
                            <line x1={MARGIN.left} x2={width - MARGIN.right} y1={y(tick)} y2={y(tick)} className="grid" />
                            <text x={MARGIN.left - 8} y={y(tick)} className="axis" textAnchor="end" dominantBaseline="middle">{tickLabel(tick, top)}</text>
                        </g>
                    ))}

                    {buckets.map((bucket, i) => {
                        const x = MARGIN.left + band * i + (band - barWidth) / 2
                        const barTop = y(bucket.value)
                        return (
                            <g key={bucket.fullLabel}>
                                {bucket.value > 0 &&
                                    <path d={barPath(x, barTop, barWidth, MARGIN.top + plotHeight - barTop)} className={active === i ? "bar active" : "bar"} />}
                                {i === peakIndex &&
                                    <text x={x + barWidth / 2} y={barTop - 8} className="value" textAnchor="middle">{tickLabel(bucket.value, top)}</text>}
                                {i % labelEvery === 0 &&
                                    <text x={MARGIN.left + band * i + band / 2} y={HEIGHT - 8} className="axis" textAnchor="middle">{bucket.label}</text>}
                                <rect
                                    x={MARGIN.left + band * i}
                                    y={MARGIN.top}
                                    width={band}
                                    height={plotHeight}
                                    className="hit"
                                    tabIndex={0}
                                    aria-label={`${bucket.fullLabel}: ${formatMoney(bucket.value)}`}
                                    onPointerEnter={() => setActive(i)}
                                    onPointerLeave={() => setActive(null)}
                                    onFocus={() => setActive(i)}
                                    onBlur={() => setActive(null)}
                                />
                            </g>
                        )
                    })}
                </svg>
            }
            {activeBucket && active !== null &&
                <div
                    className="tooltip"
                    style={{
                        left: Math.min(Math.max(MARGIN.left + band * active + band / 2, 70), width - 70),
                        top: Math.max(0, y(activeBucket.value) - 64),
                    }}
                >
                    <strong className="tnum">{formatMoney(activeBucket.value)}</strong>
                    <span>{activeBucket.fullLabel}</span>
                </div>
            }
        </div>
    )
}

export default RevenueChart
