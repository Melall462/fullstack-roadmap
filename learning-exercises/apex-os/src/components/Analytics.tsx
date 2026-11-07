import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { useData } from "../data/useData"
import type { Job } from "../types/job"
import { addDays, daysSince, formatDate, formatMoney, toISODate, todayISO } from "../utils/date"
import { reminderText } from "../utils/jobs"
import RevenueChart, { type Bucket } from "./RevenueChart"
import { EmptyState, PageHeader } from "./ui"

type Range = "month" | "3m" | "6m" | "year"

const RANGES: { id: Range, label: string, previous: string }[] = [
    { id: "month", label: "This month", previous: "same time last month" },
    { id: "3m", label: "3 months", previous: "previous 3 months" },
    { id: "6m", label: "6 months", previous: "previous 6 months" },
    { id: "year", label: "This year", previous: "same time last year" },
]

const DUE_AFTER_DAYS = 60
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const isFinished = (job: Job) => job.status === "done" || job.status === "paid"

const parse = (iso: string) => new Date(`${iso}T00:00:00`)

function monday(iso: string): string {
    const date = parse(iso)
    return addDays(iso, -((date.getDay() + 6) % 7))
}

function monthStart(iso: string, monthsBack = 0): string {
    const date = parse(iso)
    return toISODate(new Date(date.getFullYear(), date.getMonth() - monthsBack, 1))
}

function shortDay(iso: string): string {
    const date = parse(iso)
    return `${date.getDate()} ${MONTHS[date.getMonth()] ?? ""}`
}

// Works out the period, the one before it, and the chart buckets for a range.
function periodFor(range: Range, today: string) {
    const unit: "day" | "week" | "month" = range === "month" ? "day" : range === "3m" ? "week" : "month"
    const start =
        range === "month" ? monthStart(today) :
        range === "3m" ? monday(addDays(today, -7 * 12)) :
        range === "6m" ? monthStart(today, 5) :
        `${today.slice(0, 4)}-01-01`

    let previousStart: string
    let previousEnd: string
    if (range === "month") {
        // Month to date compared with the same days last month.
        previousStart = monthStart(today, 1)
        const lastMonthEnd = addDays(start, -1)
        const sameDay = `${previousStart.slice(0, 8)}${today.slice(8)}`
        previousEnd = sameDay < lastMonthEnd ? sameDay : lastMonthEnd
    } else if (range === "year") {
        // Year to date compared with the same days last year.
        previousStart = `${Number(today.slice(0, 4)) - 1}-01-01`
        previousEnd = `${Number(today.slice(0, 4)) - 1}${today.slice(4)}`
    } else {
        const length = Math.round((parse(today).getTime() - parse(start).getTime()) / 86400000) + 1
        previousEnd = addDays(start, -1)
        previousStart = addDays(start, -length)
    }

    const starts: string[] = []
    if (unit === "day") {
        for (let d = start; d <= today; d = addDays(d, 1)) starts.push(d)
    } else if (unit === "week") {
        for (let d = monday(start); d <= today; d = addDays(d, 7)) starts.push(d)
    } else {
        for (let back = range === "6m" ? 5 : parse(today).getMonth(); back >= 0; back--) starts.push(monthStart(today, back))
    }

    return { start, previousStart, previousEnd, starts, unit }
}

function Delta({ current, previous, label }: { current: number, previous: number, label: string }) {
    if (previous === 0 && current === 0) return <span className="delta">No change from {label}</span>
    if (previous === 0) return <span className="delta">Up from nothing {label}</span>
    const change = ((current - previous) / previous) * 100
    const up = change >= 0
    const amount = `${Math.abs(Math.round(change))}%`
    return (
        <span className={`delta ${change === 0 ? "" : up ? "up" : "down"}`}>
            {change === 0 ? "No change" : `${up ? "▲" : "▼"} ${amount}`} <span className="secondary">vs {label}</span>
        </span>
    )
}

function Analytics() {
    const { jobs, vehicles, customers, settings } = useData()
    const navigate = useNavigate()
    const [range, setRange] = useState<Range>("month")

    const today = todayISO()
    const option = RANGES.find((r) => r.id === range) ?? RANGES[0]!
    const period = periodFor(range, today)

    const finished = jobs.filter(isFinished)
    const inPeriod = finished.filter((j) => j.date >= period.start && j.date <= today)
    const inPrevious = finished.filter((j) => j.date >= period.previousStart && j.date <= period.previousEnd)
    const sum = (list: Job[]) => list.reduce((total, j) => total + j.price, 0)

    const revenue = sum(inPeriod)
    const unpaid = jobs.filter((j) => j.status === "done")

    const buckets: Bucket[] = period.starts.map((bucketStart, i) => {
        const next = period.starts[i + 1]
        const value = sum(inPeriod.filter((j) => j.date >= bucketStart && (next === undefined || j.date < next)))
        const date = parse(bucketStart)
        if (period.unit === "day") return { label: shortDay(bucketStart), fullLabel: formatDate(bucketStart), value }
        return period.unit === "week" ?
            { label: shortDay(bucketStart), fullLabel: `Week of ${shortDay(bucketStart)}`, value } :
            { label: MONTHS[date.getMonth()] ?? "", fullLabel: `${MONTHS[date.getMonth()] ?? ""} ${date.getFullYear()}`, value }
    })

    const due = vehicles
        .map((v) => ({ vehicle: v, age: v.lastDetail ? daysSince(v.lastDetail) : null }))
        .filter(({ age }) => age === null || age > DUE_AFTER_DAYS)
        .sort((a, b) => (b.age ?? Infinity) - (a.age ?? Infinity))

    const ownerName = (customerId: number | null) => customers.find((c) => c.id === customerId)?.name

    // A link that opens an email (or a text, if there's no email) with the reminder written for you.
    function reminderLink(vehicleId: number): string | null {
        const vehicle = vehicles.find((v) => v.id === vehicleId)
        const owner = customers.find((c) => c.id === vehicle?.customerId)
        if (!vehicle || !owner || (!owner.email && !owner.phone)) return null
        const body = reminderText(settings.reminderMessage, {
            name: owner.name,
            vehicle: `${vehicle.make} ${vehicle.model}`,
            rego: vehicle.rego,
            daysSince: vehicle.lastDetail ? daysSince(vehicle.lastDetail) : null,
            business: settings.businessName,
        })
        if (owner.email) {
            const subject = `Time for a detail on your ${vehicle.make} ${vehicle.model}?`
            return `mailto:${owner.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
        }
        return `sms:${owner.phone.replace(/\s/g, "")}?body=${encodeURIComponent(body)}`
    }

    return (
        <div>
            <PageHeader title="Analytics" subtitle="How the business is going." />

            <div className="tabs" role="tablist" aria-label="Time range" style={{ marginBottom: 24 }}>
                {RANGES.map((r) => (
                    <button key={r.id} role="tab" aria-selected={range === r.id} onClick={() => setRange(r.id)}>{r.label}</button>
                ))}
            </div>

            <div className="stats">
                <div className="card stat">
                    <span className="stat-label">Revenue</span>
                    <span className="stat-value">{formatMoney(revenue)}</span>
                    <Delta current={revenue} previous={sum(inPrevious)} label={option.previous} />
                </div>
                <div className="card stat">
                    <span className="stat-label">Jobs completed</span>
                    <span className="stat-value">{inPeriod.length}</span>
                    <Delta current={inPeriod.length} previous={inPrevious.length} label={option.previous} />
                </div>
                <Link className="card stat stat-link" to="/jobs">
                    <span className="stat-label">Unpaid jobs</span>
                    <span className="stat-value">{unpaid.length}</span>
                    <span className="delta">{unpaid.length === 0 ? "All paid up" : <><strong>{formatMoney(sum(unpaid))}</strong> <span className="secondary">owed, all time</span></>}</span>
                </Link>
            </div>

            <section className="section">
                <div>
                    <h2>Revenue over time</h2>
                    <p className="secondary small">Done and paid jobs, by {period.unit}.</p>
                </div>
                <div className="card card-body">
                    {revenue === 0 ?
                        <EmptyState title="No finished jobs in this period yet." /> :
                        <>
                            <RevenueChart buckets={buckets} />
                            <details className="table-toggle">
                                <summary>Show as table</summary>
                                <table className="table">
                                    <thead><tr><th>{period.unit === "day" ? "Day" : period.unit === "week" ? "Week" : "Month"}</th><th className="num">Revenue</th></tr></thead>
                                    <tbody>
                                        {buckets.map((b) => (
                                            <tr key={b.fullLabel}><td className="lead">{b.fullLabel}</td><td data-label="Revenue" className="num">{formatMoney(b.value)}</td></tr>
                                        ))}
                                    </tbody>
                                </table>
                            </details>
                        </>
                    }
                </div>
            </section>

            <section className="section">
                <div>
                    <h2>Vehicles due for a detail</h2>
                    <p className="secondary small">Not detailed in the last {DUE_AFTER_DAYS} days. "Send reminder" opens an email or text with your message from Settings.</p>
                </div>
                <div className="card">
                    {due.length === 0 ?
                        <EmptyState title="Every vehicle has been detailed recently." /> :
                        <table className="table">
                            <thead><tr><th>Rego</th><th>Vehicle</th><th>Owner</th><th>Last detail</th><th className="num">Days since</th><th></th></tr></thead>
                            <tbody>
                                {due.map(({ vehicle, age }) => (
                                    <tr key={vehicle.id} className="clickable" onClick={() => navigate(`/vehicles/${vehicle.id}`)}>
                                        <td className="lead"><Link to={`/vehicles/${vehicle.id}`} onClick={(e) => e.stopPropagation()}><span className="plate">{vehicle.rego}</span></Link></td>
                                        <td data-label="Vehicle">{vehicle.make} {vehicle.model}</td>
                                        <td data-label="Owner">{ownerName(vehicle.customerId) ?? <span className="cell-sub">No owner</span>}</td>
                                        <td data-label="Last detail" className="cell-sub tnum">{vehicle.lastDetail ? formatDate(vehicle.lastDetail) : "Never"}</td>
                                        <td data-label="Days since" className="num">{age ?? "Never"}</td>
                                        <td className="num row-links" onClick={(e) => e.stopPropagation()}>
                                            {reminderLink(vehicle.id) && <a className="small" href={reminderLink(vehicle.id) ?? undefined}>Send reminder</a>}
                                            {vehicle.customerId !== null && <Link className="small" to={`/jobs/new?vehicle=${vehicle.id}`}>Book job</Link>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    }
                </div>
            </section>
        </div>
    )
}

export default Analytics
