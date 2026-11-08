import type { Job, JobItem, Repeat } from "../types/job"
import { addDays, addMonths, todayISO } from "./date"

export const isFinished = (job: Job) => job.status === "done" || job.status === "paid"
export const isOpen = (job: Job) => job.status === "booked" || job.status === "in-progress"

export function itemsLabel(items: JobItem[]): string {
    if (items.length === 0) return "No services"
    return items.map((i) => i.name).join(", ")
}

export function durationOf(items: JobItem[]): number {
    return items.reduce((total, i) => total + i.durationMins, 0) || 60
}

function minutes(time: string): number {
    const [h, m] = time.split(":")
    return Number(h) * 60 + Number(m)
}

export function endTime(job: Pick<Job, "time" | "items">): string {
    const end = minutes(job.time) + durationOf(job.items)
    return `${String(Math.floor(end / 60) % 24).padStart(2, "0")}:${String(end % 60).padStart(2, "0")}`
}

// Other open jobs on the same day whose time overlaps this one.
export function clashesWith(job: Pick<Job, "date" | "time" | "items"> & { id?: number }, jobs: Job[]): Job[] {
    const start = minutes(job.time)
    const end = start + durationOf(job.items)
    return jobs.filter((other) => {
        if (other.id === job.id || other.date !== job.date || !isOpen(other)) return false
        const otherStart = minutes(other.time)
        const otherEnd = otherStart + durationOf(other.items)
        return start < otherEnd && otherStart < end
    })
}

export function formatDuration(mins: number): string {
    if (mins < 60) return `${mins} min`
    const hours = mins / 60
    return `${Number.isInteger(hours) ? hours : hours.toFixed(1)} h`
}

// Fills in the reminder template from Settings for one vehicle.
export function reminderText(template: string, values: { name: string, vehicle: string, rego: string, daysSince: number | null, business: string }): string {
    const months = values.daysSince === null ? "a while"
        : values.daysSince < 45 ? "a few weeks"
        : `${Math.round(values.daysSince / 30)} months`
    return template
        .replaceAll("{first name}", values.name.split(" ")[0] ?? values.name)
        .replaceAll("{name}", values.name)
        .replaceAll("{vehicle}", values.vehicle)
        .replaceAll("{rego}", values.rego)
        .replaceAll("{months}", months)
        .replaceAll("{business}", values.business)
}

export function repeatLabel(repeat: Repeat): string {
    const unit = repeat.unit === "week" ? "week" : "month"
    return repeat.every === 1 ? `Every ${unit}` : `Every ${repeat.every} ${unit}s`
}

function step(date: string, repeat: Repeat, times: number): string {
    return repeat.unit === "week" ? addDays(date, 7 * repeat.every * times) : addMonths(date, repeat.every * times)
}

// The date of the next booking after a repeating job: one interval after the job's
// own date, skipping ahead if that's already in the past (e.g. the job was marked
// done late), so the next booking is never in the past.
export function nextRepeatDate(date: string, repeat: Repeat): string {
    const today = todayISO()
    let times = 1
    let next = step(date, repeat, times)
    while (next < today) next = step(date, repeat, ++times)
    return next
}
