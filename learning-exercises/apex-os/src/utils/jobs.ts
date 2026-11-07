import type { Job, JobItem } from "../types/job"

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
