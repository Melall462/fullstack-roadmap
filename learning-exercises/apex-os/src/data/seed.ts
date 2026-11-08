import type { Customer } from "../types/customer"
import type { Vehicle } from "../types/vehicle"
import type { Service } from "../types/service"
import type { Job } from "../types/job"
import { addDays, todayISO } from "../utils/date"

export const seedCustomers: Customer[] = [
    { id: 1, name: "John", email: "john@example.com", phone: "021 555 0101" },
    { id: 2, name: "Sarah", email: "sarah@example.com", phone: "" },
    { id: 3, name: "Mike", email: "mike@example.com", phone: "027 555 0199" },
]

export const seedVehicles: Vehicle[] = [
    { id: 1, make: "Toyota", model: "Corolla", year: "2018", rego: "ABC123", customerId: 1, color: "White", lastDetail: "2026-10-15", notes: "" },
    { id: 2, make: "Honda", model: "Civic", year: "2024", rego: "DEF456", customerId: 2, color: "Red", lastDetail: "2026-08-22", notes: "Pet hair on back seat" },
]

export const seedServices: Service[] = [
    { id: 1, name: "Exterior Wash", price: 60, durationMins: 60 },
    { id: 2, name: "Interior Detail", price: 120, durationMins: 120 },
    { id: 3, name: "Full Detail", price: 220, durationMins: 240 },
]

const today = todayISO()

export const seedJobs: Job[] = [
    { id: 1, customerId: 1, vehicleId: 1, items: [{ serviceId: 3, name: "Full Detail", price: 220, durationMins: 240 }], date: today, time: "10:00", price: 220, status: "booked", notes: "", invoiceNumber: null, invoiceDate: "", repeat: { every: 1, unit: "month" }, nextJobId: null },
    { id: 2, customerId: 2, vehicleId: 2, items: [{ serviceId: 2, name: "Interior Detail", price: 120, durationMins: 120 }], date: addDays(today, 2), time: "13:30", price: 120, status: "booked", notes: "Focus on back seat", invoiceNumber: null, invoiceDate: "", repeat: null, nextJobId: null },
]
