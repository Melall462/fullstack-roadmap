// All dates are stored as "YYYY-MM-DD" strings in local time.

export function toISODate(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
}

export function todayISO(): string {
    return toISODate(new Date())
}

export function addDays(isoDate: string, days: number): string {
    const date = new Date(`${isoDate}T00:00:00`)
    date.setDate(date.getDate() + days)
    return toISODate(date)
}

export function daysSince(isoDate: string): number {
    const then = new Date(`${isoDate}T00:00:00`).getTime()
    const now = new Date(`${todayISO()}T00:00:00`).getTime()
    return Math.round((now - then) / (1000 * 60 * 60 * 24))
}

export function formatDate(isoDate: string): string {
    if (!isoDate) return ""
    return new Date(`${isoDate}T00:00:00`).toLocaleDateString(undefined, {
        weekday: "short", day: "numeric", month: "short", year: "numeric"
    })
}

export function formatMoney(amount: number): string {
    return `$${amount.toLocaleString("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
