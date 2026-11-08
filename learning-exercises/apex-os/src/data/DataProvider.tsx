import { useEffect, useRef, useState, type ReactNode } from "react"
import { DataContext, type DataContextValue, type UndoNotice } from "./DataContext"
import { loadList, saveList } from "./storage"
import { createDemoData } from "./demo"
import { seedCustomers, seedJobs, seedServices, seedVehicles } from "./seed"
import type { Customer } from "../types/customer"
import type { Vehicle } from "../types/vehicle"
import type { Service } from "../types/service"
import type { Job, JobItem } from "../types/job"
import { defaultSettings, type Settings } from "../types/settings"
import { formatDate, todayISO } from "../utils/date"
import { isFinished, nextRepeatDate } from "../utils/jobs"

// Vehicles saved by older versions of the app had no id, a string customerId
// and sometimes a numeric year. This brings them up to the current shape.
function migrateVehicle(vehicle: Vehicle, index: number): Vehicle {
    const raw = vehicle as unknown as Record<string, unknown>
    const ownerId = Number(raw["customerId"])
    const hasOwner = raw["customerId"] !== "" && raw["customerId"] !== null && Number.isFinite(ownerId)
    const notes = typeof raw["notes"] === "string" && raw["notes"] !== "None" ? raw["notes"] : ""
    return {
        ...vehicle,
        id: typeof raw["id"] === "number" ? raw["id"] : index + 1,
        year: String(raw["year"] ?? ""),
        customerId: hasOwner ? ownerId : null,
        color: typeof raw["color"] === "string" ? raw["color"] : "",
        lastDetail: typeof raw["lastDetail"] === "string" ? raw["lastDetail"] : "",
        notes,
    }
}

// Customers saved before phone numbers were added.
function migrateCustomer(customer: Customer): Customer {
    return { ...customer, phone: typeof customer.phone === "string" ? customer.phone : "" }
}

// Jobs saved before a job could have several services had a single serviceId.
function migrateJob(services: Service[]) {
    return (job: Job): Job => {
        const raw = job as unknown as Record<string, unknown>
        let items = Array.isArray(raw["items"]) ? job.items : null
        if (!items) {
            const serviceId = Number(raw["serviceId"])
            const service = services.find((s) => s.id === serviceId)
            const item: JobItem = {
                serviceId,
                name: service?.name ?? "Service",
                price: Number(raw["price"]) || 0,
                durationMins: service?.durationMins ?? 60,
            }
            items = [item]
        }
        return {
            id: job.id,
            customerId: job.customerId,
            vehicleId: job.vehicleId,
            items,
            date: job.date,
            time: job.time,
            price: items.reduce((sum, i) => sum + i.price, 0),
            status: job.status,
            notes: typeof job.notes === "string" ? job.notes : "",
            invoiceNumber: typeof raw["invoiceNumber"] === "number" ? job.invoiceNumber : null,
            invoiceDate: typeof raw["invoiceDate"] === "string" ? job.invoiceDate : "",
            repeat: raw["repeat"] && typeof raw["repeat"] === "object" ? job.repeat : null,
            nextJobId: typeof raw["nextJobId"] === "number" ? job.nextJobId : null,
        }
    }
}

function loadSettings(): Settings {
    try {
        const saved = JSON.parse(localStorage.getItem("settings") ?? "null") as Partial<Settings> | null
        const legacyName = localStorage.getItem("businessName")
        return {
            ...defaultSettings,
            ...(legacyName ? { businessName: legacyName } : {}),
            ...(saved ?? {}),
        }
    } catch {
        return defaultSettings
    }
}

// Loads everything from localStorage and drops links that point at records
// which no longer exist (e.g. data saved by an older version of the app).
function loadInitialData() {
    const hasSavedVehicles = localStorage.getItem("vehicles") !== null
    const customers = loadList("customers", seedCustomers, migrateCustomer)
    const services = loadList("services", seedServices)
    // Sample jobs only make sense alongside the sample vehicles.
    const savedJobs = loadList("jobs", hasSavedVehicles ? [] : seedJobs, migrateJob(services))

    const customerIds = new Set(customers.map((c) => c.id))
    const vehicles = loadList("vehicles", seedVehicles, migrateVehicle).map((v) =>
        v.customerId !== null && !customerIds.has(v.customerId) ? { ...v, customerId: null } : v
    )
    const vehicleOwners = new Map(vehicles.map((v) => [v.id, v.customerId]))
    const jobs = savedJobs.filter((j) =>
        customerIds.has(j.customerId) && vehicleOwners.get(j.vehicleId) === j.customerId
    )

    return { customers, vehicles, services, jobs }
}

function newId(): number {
    return Date.now() + Math.floor(Math.random() * 1000)
}

type Snapshot = { customers: Customer[], vehicles: Vehicle[], services: Service[], jobs: Job[] }

function DataProvider({ children }: { children: ReactNode }) {
    const [initial] = useState(loadInitialData)
    const [customers, setCustomers] = useState<Customer[]>(initial.customers)
    const [vehicles, setVehicles] = useState<Vehicle[]>(initial.vehicles)
    const [services, setServices] = useState<Service[]>(initial.services)
    const [jobs, setJobs] = useState<Job[]>(initial.jobs)
    const [settings, setSettings] = useState<Settings>(loadSettings)
    const [undo, setUndo] = useState<UndoNotice | null>(null)
    const snapshot = useRef<Snapshot | null>(null)

    useEffect(() => saveList("customers", customers), [customers])
    useEffect(() => saveList("vehicles", vehicles), [vehicles])
    useEffect(() => saveList("services", services), [services])
    useEffect(() => saveList("jobs", jobs), [jobs])
    useEffect(() => localStorage.setItem("settings", JSON.stringify(settings)), [settings])

    // A finished job updates its vehicle's "last detailed" date.
    function recordDetail(job: Pick<Job, "status" | "vehicleId" | "date">) {
        if (job.status !== "done" && job.status !== "paid") return
        setVehicles((previous) => previous.map((v) =>
            v.id === job.vehicleId && job.date > v.lastDetail ? { ...v, lastDetail: job.date } : v
        ))
    }

    // Saves a changed job. If it's a repeating job that has just been finished,
    // the next one is booked too (once only, tracked by nextJobId).
    function saveJob(job: Job) {
        let saved = job
        let next: Job | null = null
        if (job.repeat && isFinished(job) && job.nextJobId === null) {
            next = {
                ...job,
                id: newId(),
                date: nextRepeatDate(job.date, job.repeat),
                status: "booked",
                invoiceNumber: null,
                invoiceDate: "",
                nextJobId: null,
            }
            saved = { ...job, nextJobId: next.id }
            // Undo takes back both the status change and the new booking.
            rememberForUndo(`Next job booked for ${formatDate(next.date)}.`)
        }
        setJobs((previous) => [...previous.map((j) => j.id === saved.id ? saved : j), ...(next ? [next] : [])])
        recordDetail(saved)
    }

    // Remember everything before a delete so Undo can put it back.
    function rememberForUndo(message: string) {
        snapshot.current = { customers, vehicles, services, jobs }
        setUndo({ id: Date.now(), message })
    }

    const value: DataContextValue = {
        customers,
        vehicles,
        services,
        jobs,
        settings,

        updateSettings(changes) {
            setSettings((previous) => ({ ...previous, ...changes }))
        },
        loadDemoData() {
            const demo = createDemoData()
            setCustomers(demo.customers)
            setVehicles(demo.vehicles)
            setServices(demo.services)
            setJobs(demo.jobs)
        },

        addCustomer(customer) {
            const id = newId()
            setCustomers((previous) => [...previous, { ...customer, id }])
            return id
        },
        updateCustomer(customer) {
            setCustomers((previous) => previous.map((c) => c.id === customer.id ? customer : c))
        },
        deleteCustomer(customerId) {
            // Removing a customer also removes their vehicles and jobs.
            const name = customers.find((c) => c.id === customerId)?.name ?? "Customer"
            rememberForUndo(`${name} deleted.`)
            setCustomers((previous) => previous.filter((c) => c.id !== customerId))
            setVehicles((previous) => previous.filter((v) => v.customerId !== customerId))
            setJobs((previous) => previous.filter((j) => j.customerId !== customerId))
        },

        addVehicle(vehicle) {
            const id = newId()
            setVehicles((previous) => [...previous, { ...vehicle, id }])
            return id
        },
        updateVehicle(vehicle) {
            setVehicles((previous) => previous.map((v) => v.id === vehicle.id ? vehicle : v))
            // Keep the vehicle's jobs pointing at the right owner.
            if (vehicle.customerId !== null) {
                const ownerId = vehicle.customerId
                setJobs((previous) => previous.map((j) => j.vehicleId === vehicle.id ? { ...j, customerId: ownerId } : j))
            }
        },
        deleteVehicle(vehicleId) {
            const rego = vehicles.find((v) => v.id === vehicleId)?.rego ?? "Vehicle"
            rememberForUndo(`${rego} deleted.`)
            setVehicles((previous) => previous.filter((v) => v.id !== vehicleId))
            setJobs((previous) => previous.filter((j) => j.vehicleId !== vehicleId))
        },

        addService(service) {
            setServices((previous) => [...previous, { ...service, id: newId() }])
        },
        updateService(service) {
            setServices((previous) => previous.map((s) => s.id === service.id ? service : s))
        },
        deleteService(serviceId) {
            const name = services.find((s) => s.id === serviceId)?.name ?? "Service"
            rememberForUndo(`${name} deleted.`)
            setServices((previous) => previous.filter((s) => s.id !== serviceId))
        },

        addJob(job) {
            const id = newId()
            setJobs((previous) => [...previous, { ...job, id, invoiceNumber: null, invoiceDate: "", nextJobId: null }])
            recordDetail(job)
            return id
        },
        updateJob(job) {
            saveJob(job)
        },
        deleteJob(jobId) {
            rememberForUndo("Job deleted.")
            setJobs((previous) => previous.filter((j) => j.id !== jobId))
        },
        setJobStatus(jobId, status) {
            const job = jobs.find((j) => j.id === jobId)
            if (!job) return
            saveJob({ ...job, status })
        },
        createInvoice(jobId) {
            const job = jobs.find((j) => j.id === jobId)
            if (!job || job.invoiceNumber !== null) return
            const number = settings.nextInvoiceNumber
            setJobs((previous) => previous.map((j) => j.id === jobId ? { ...j, invoiceNumber: number, invoiceDate: todayISO() } : j))
            setSettings((previous) => ({ ...previous, nextInvoiceNumber: number + 1 }))
        },

        undo,
        undoDelete() {
            const saved = snapshot.current
            if (!saved) return
            setCustomers(saved.customers)
            setVehicles(saved.vehicles)
            setServices(saved.services)
            setJobs(saved.jobs)
            snapshot.current = null
            setUndo(null)
        },
        dismissUndo() {
            snapshot.current = null
            setUndo(null)
        },
    }

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export default DataProvider
