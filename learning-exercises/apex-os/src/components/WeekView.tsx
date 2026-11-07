import { useState } from "react"
import { Link } from "react-router"
import { useData } from "../data/useData"
import type { Job } from "../types/job"
import { addDays, todayISO } from "../utils/date"
import { clashesWith, endTime, isOpen, itemsLabel } from "../utils/jobs"
import Icon from "./Icon"
import { StatusBadge } from "./ui"

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function mondayOf(iso: string): string {
    const day = new Date(`${iso}T00:00:00`).getDay()
    return addDays(iso, -((day + 6) % 7))
}

function dayNumber(iso: string): string {
    return String(Number(iso.slice(8)))
}

function rangeLabel(start: string): string {
    const end = addDays(start, 6)
    const startMonth = MONTHS[Number(start.slice(5, 7)) - 1] ?? ""
    const endMonth = MONTHS[Number(end.slice(5, 7)) - 1] ?? ""
    return startMonth === endMonth
        ? `${dayNumber(start)}–${dayNumber(end)} ${endMonth} ${end.slice(0, 4)}`
        : `${dayNumber(start)} ${startMonth} – ${dayNumber(end)} ${endMonth} ${end.slice(0, 4)}`
}

// A week of bookings, one column per day. Open jobs that overlap are flagged.
function WeekView() {
    const { jobs, customers, vehicles } = useData()
    const today = todayISO()
    const [weekStart, setWeekStart] = useState(() => mondayOf(today))

    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
    const weekJobs = jobs.filter((j) => j.date >= weekStart && j.date <= addDays(weekStart, 6))
    const customerName = (job: Job) => customers.find((c) => c.id === job.customerId)?.name ?? "Unknown customer"
    const rego = (job: Job) => vehicles.find((v) => v.id === job.vehicleId)?.rego ?? "?"
    const clashCount = weekJobs.filter((j) => isOpen(j) && clashesWith(j, jobs).length > 0).length

    return (
        <div className="section">
            <div className="week-nav">
                <div className="toolbar">
                    <button className="btn" aria-label="Previous week" onClick={() => setWeekStart(addDays(weekStart, -7))}><Icon name="back" size={16} /></button>
                    <button className="btn" aria-label="Next week" onClick={() => setWeekStart(addDays(weekStart, 7))}><Icon name="forward" size={16} /></button>
                    {weekStart !== mondayOf(today) && <button className="btn btn-ghost" onClick={() => setWeekStart(mondayOf(today))}>This week</button>}
                </div>
                <h2 className="tnum">{rangeLabel(weekStart)}</h2>
                <span className="secondary small">
                    {weekJobs.length} job{weekJobs.length === 1 ? "" : "s"}
                    {clashCount > 0 && <> · <span className="clash-text">{clashCount} overlapping</span></>}
                </span>
            </div>

            <div className="week">
                {days.map((day, i) => {
                    const dayJobs = weekJobs.filter((j) => j.date === day).sort((a, b) => a.time.localeCompare(b.time))
                    return (
                        <div key={day} className={day === today ? "day today" : "day"}>
                            <div className="day-head">
                                <span className="secondary">{DAYS[i]}</span>
                                <strong className="tnum">{dayNumber(day)}</strong>
                            </div>
                            <div className="day-jobs">
                                {dayJobs.length === 0 && <span className="day-empty">No jobs</span>}
                                {dayJobs.map((job) => {
                                    const clash = isOpen(job) && clashesWith(job, jobs).length > 0
                                    return (
                                        <Link key={job.id} to={`/jobs/${job.id}`} className={`slot${clash ? " clash" : ""}${isOpen(job) ? "" : " finished"}`}>
                                            <span className="slot-time tnum">{job.time}–{endTime(job)}</span>
                                            <strong>{customerName(job)}</strong>
                                            <span className="secondary small"><span className="plate small-plate">{rego(job)}</span> {itemsLabel(job.items)}</span>
                                            {clash ?
                                                <span className="clash-text small"><Icon name="alert" size={14} /> Overlaps another job</span> :
                                                job.status !== "booked" && <StatusBadge status={job.status} />}
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default WeekView
