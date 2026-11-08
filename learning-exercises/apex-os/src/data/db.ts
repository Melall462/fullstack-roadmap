// Moves data between the app's types (camelCase) and the database tables (snake_case).
import { supabase } from "../lib/supabase"
import type { Customer } from "../types/customer"
import type { Vehicle } from "../types/vehicle"
import type { Service } from "../types/service"
import type { Job, JobItem, JobStatus, Repeat } from "../types/job"
import { defaultSettings, type Settings } from "../types/settings"

type Row = Record<string, unknown>

export type AllData = {
    customers: Customer[],
    vehicles: Vehicle[],
    services: Service[],
    jobs: Job[],
    settings: Settings,
}

// What the database held after the last successful save (settings is null until the row exists).
export type ServerState = Omit<AllData, "settings"> & { settings: Settings | null }

// ---- Row <-> type ----

const toCustomer = (r: Row): Customer => ({
    id: Number(r["id"]), name: String(r["name"]), email: String(r["email"] ?? ""), phone: String(r["phone"] ?? ""),
})
const fromCustomer = (c: Customer, userId: string): Row => ({ user_id: userId, id: c.id, name: c.name, email: c.email, phone: c.phone })

const toVehicle = (r: Row): Vehicle => ({
    id: Number(r["id"]),
    customerId: r["customer_id"] === null ? null : Number(r["customer_id"]),
    make: String(r["make"]), model: String(r["model"]), year: String(r["year"] ?? ""),
    rego: String(r["rego"]), color: String(r["color"] ?? ""),
    lastDetail: r["last_detail"] ? String(r["last_detail"]) : "",
    notes: String(r["notes"] ?? ""),
})
const fromVehicle = (v: Vehicle, userId: string): Row => ({
    user_id: userId, id: v.id, customer_id: v.customerId, make: v.make, model: v.model, year: v.year,
    rego: v.rego, color: v.color, last_detail: v.lastDetail || null, notes: v.notes,
})

// Postgres "numeric" columns arrive as strings, so prices are turned back into numbers.
const toService = (r: Row): Service => ({
    id: Number(r["id"]), name: String(r["name"]), price: Number(r["price"]), durationMins: Number(r["duration_mins"]),
})
const fromService = (s: Service, userId: string): Row => ({
    user_id: userId, id: s.id, name: s.name, price: s.price, duration_mins: s.durationMins,
})

const toJob = (r: Row): Job => ({
    id: Number(r["id"]),
    customerId: Number(r["customer_id"]),
    vehicleId: Number(r["vehicle_id"]),
    items: ((r["items"] as JobItem[] | null) ?? []).map((i) => ({ ...i, price: Number(i.price) })),
    date: String(r["date"]),
    time: String(r["time"]),
    price: Number(r["price"]),
    status: r["status"] as JobStatus,
    notes: String(r["notes"] ?? ""),
    invoiceNumber: r["invoice_number"] === null ? null : Number(r["invoice_number"]),
    invoiceDate: r["invoice_date"] ? String(r["invoice_date"]) : "",
    repeat: (r["repeat"] as Repeat | null) ?? null,
    nextJobId: r["next_job_id"] === null ? null : Number(r["next_job_id"]),
})
const fromJob = (j: Job, userId: string): Row => ({
    user_id: userId, id: j.id, customer_id: j.customerId, vehicle_id: j.vehicleId, items: j.items,
    date: j.date, time: j.time, price: j.price, status: j.status, notes: j.notes,
    invoice_number: j.invoiceNumber, invoice_date: j.invoiceDate || null, repeat: j.repeat, next_job_id: j.nextJobId,
})

const toSettings = (r: Row): Settings => ({
    businessName: String(r["business_name"]),
    phone: String(r["phone"] ?? ""),
    email: String(r["email"] ?? ""),
    address: String(r["address"] ?? ""),
    gstNumber: String(r["gst_number"] ?? ""),
    paymentDetails: String(r["payment_details"] ?? ""),
    reminderMessage: String(r["reminder_message"] ?? "") || defaultSettings.reminderMessage,
    nextInvoiceNumber: Number(r["next_invoice_number"]),
})
const fromSettings = (s: Settings, userId: string): Row => ({
    user_id: userId, business_name: s.businessName, phone: s.phone, email: s.email, address: s.address,
    gst_number: s.gstNumber, payment_details: s.paymentDetails, reminder_message: s.reminderMessage,
    next_invoice_number: s.nextInvoiceNumber,
})

// ---- Loading ----

// Supabase returns at most 1000 rows per request, so read in pages.
async function selectAll(table: string): Promise<Row[]> {
    const rows: Row[] = []
    for (let from = 0; ; from += 1000) {
        const { data, error } = await supabase.from(table).select("*").order("id").range(from, from + 999)
        if (error) throw error
        rows.push(...(data as Row[]))
        if (data.length < 1000) return rows
    }
}

export async function loadAll(): Promise<ServerState> {
    const [customers, vehicles, services, jobs, settings] = await Promise.all([
        selectAll("customers"), selectAll("vehicles"), selectAll("services"), selectAll("jobs"),
        supabase.from("settings").select("*").maybeSingle(),
    ])
    if (settings.error) throw settings.error
    return {
        customers: customers.map(toCustomer),
        vehicles: vehicles.map(toVehicle),
        services: services.map(toService),
        jobs: jobs.map(toJob),
        settings: settings.data ? toSettings(settings.data as Row) : null,
    }
}

// ---- Saving ----
// The app keeps working with plain arrays in React state. After every change, the
// new arrays are compared with what the database last had, and only the rows that
// were added, changed or removed are sent. That way every action (add, edit,
// delete, Undo, sample data, import) is saved the same way.

type Diff<T> = { changed: T[], removedIds: number[] }

function diff<T extends { id: number }>(before: T[], after: T[]): Diff<T> {
    const old = new Map(before.map((item) => [item.id, JSON.stringify(item)]))
    const ids = new Set(after.map((item) => item.id))
    return {
        changed: after.filter((item) => old.get(item.id) !== JSON.stringify(item)),
        removedIds: before.filter((item) => !ids.has(item.id)).map((item) => item.id),
    }
}

async function check(request: PromiseLike<{ error: unknown }>) {
    const { error } = await request
    if (error) throw error
}

export async function saveChanges(userId: string, before: ServerState, after: AllData): Promise<void> {
    const customers = diff(before.customers, after.customers)
    const services = diff(before.services, after.services)
    const vehicles = diff(before.vehicles, after.vehicles)
    const jobs = diff(before.jobs, after.jobs)

    // Deletes first, children before parents, so nothing is left pointing at a missing row
    // and a re-used rego doesn't clash with the vehicle it replaces.
    const removals: [string, number[]][] = [["jobs", jobs.removedIds], ["vehicles", vehicles.removedIds], ["services", services.removedIds], ["customers", customers.removedIds]]
    for (const [table, ids] of removals) {
        if (ids.length > 0) await check(supabase.from(table).delete().eq("user_id", userId).in("id", ids))
    }

    // Then adds and changes, parents before children (a vehicle needs its customer first).
    const upserts: [string, Row[]][] = [
        ["customers", customers.changed.map((c) => fromCustomer(c, userId))],
        ["services", services.changed.map((s) => fromService(s, userId))],
        ["vehicles", vehicles.changed.map((v) => fromVehicle(v, userId))],
        ["jobs", jobs.changed.map((j) => fromJob(j, userId))],
    ]
    for (const [table, rows] of upserts) {
        if (rows.length > 0) await check(supabase.from(table).upsert(rows, { onConflict: "user_id,id" }))
    }

    if (before.settings === null || JSON.stringify(before.settings) !== JSON.stringify(after.settings)) {
        await check(supabase.from("settings").upsert(fromSettings(after.settings, userId), { onConflict: "user_id" }))
    }
}
