import { useEffect, useState, type ReactNode } from "react"
import { DataContext, type DataContextValue } from "./DataContext"
import { loadList, saveList } from "./storage"
import { seedCustomers, seedJobs, seedServices, seedVehicles } from "./seed"
import type { Customer } from "../types/customer"
import type { Vehicle } from "../types/vehicle"
import type { Service } from "../types/service"
import type { Job } from "../types/job"

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

// Loads everything from localStorage and drops links that point at records
// which no longer exist (e.g. data saved by an older version of the app).
function loadInitialData() {
    const hasSavedVehicles = localStorage.getItem("vehicles") !== null
    const customers = loadList("customers", seedCustomers)
    const services = loadList("services", seedServices)
    // Sample jobs only make sense alongside the sample vehicles.
    const savedJobs = loadList("jobs", hasSavedVehicles ? [] : seedJobs)

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

function DataProvider({ children }: { children: ReactNode }) {
    const [initial] = useState(loadInitialData)
    const [customers, setCustomers] = useState<Customer[]>(initial.customers)
    const [vehicles, setVehicles] = useState<Vehicle[]>(initial.vehicles)
    const [services, setServices] = useState<Service[]>(initial.services)
    const [jobs, setJobs] = useState<Job[]>(initial.jobs)

    useEffect(() => saveList("customers", customers), [customers])
    useEffect(() => saveList("vehicles", vehicles), [vehicles])
    useEffect(() => saveList("services", services), [services])
    useEffect(() => saveList("jobs", jobs), [jobs])

    // A finished job updates its vehicle's "last detailed" date.
    function recordDetail(job: Omit<Job, "id">) {
        if (job.status !== "done" && job.status !== "paid") return
        setVehicles((previous) => previous.map((v) =>
            v.id === job.vehicleId && job.date > v.lastDetail ? { ...v, lastDetail: job.date } : v
        ))
    }

    const value: DataContextValue = {
        customers,
        vehicles,
        services,
        jobs,

        addCustomer(name, email) {
            setCustomers((previous) => [...previous, { id: newId(), name, email }])
        },
        updateCustomer(customer) {
            setCustomers((previous) => previous.map((c) => c.id === customer.id ? customer : c))
        },
        deleteCustomer(customerId) {
            // Removing a customer also removes their vehicles and jobs.
            setCustomers((previous) => previous.filter((c) => c.id !== customerId))
            setVehicles((previous) => previous.filter((v) => v.customerId !== customerId))
            setJobs((previous) => previous.filter((j) => j.customerId !== customerId))
        },

        addVehicle(vehicle) {
            setVehicles((previous) => [...previous, { ...vehicle, id: newId() }])
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
            setServices((previous) => previous.filter((s) => s.id !== serviceId))
        },

        addJob(job) {
            setJobs((previous) => [...previous, { ...job, id: newId() }])
            recordDetail(job)
        },
        updateJob(job) {
            setJobs((previous) => previous.map((j) => j.id === job.id ? job : j))
            recordDetail(job)
        },
        deleteJob(jobId) {
            setJobs((previous) => previous.filter((j) => j.id !== jobId))
        },
        setJobStatus(jobId, status) {
            const job = jobs.find((j) => j.id === jobId)
            if (!job) return
            setJobs((previous) => previous.map((j) => j.id === jobId ? { ...j, status } : j))
            recordDetail({ ...job, status })
        },
    }

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export default DataProvider
