import type { Customer } from "../types/customer"
import type { Vehicle } from "../types/vehicle"
import type { Service } from "../types/service"
import type { Job, JobStatus } from "../types/job"
import { addDays, todayISO } from "../utils/date"

// Generates a realistic-looking six months of history so the app has
// something to show. Uses a seeded random so the result is the same each time.
function seededRandom(seed: number) {
    let state = seed
    return () => {
        state = (Math.imul(state, 1664525) + 1013904223) >>> 0
        return state / 4294967296
    }
}

export function createDemoData() {
    const random = seededRandom(42)
    const pick = <T,>(items: readonly T[]): T => items[Math.floor(random() * items.length)] as T

    const customers: Customer[] = [
        "Aroha Ngata", "James Chen", "Sarah Wilson", "Mike Patel", "Emma Thompson",
        "Liam O'Connor", "Priya Sharma", "Tom Walker", "Hannah Lee", "Ben Taylor",
    ].map((name, index) => ({
        id: index + 1,
        name,
        email: `${name.toLowerCase().replace(/[^a-z]+/g, ".")}@example.com`,
        phone: `02${1 + (index % 7)} 555 0${String(100 + index * 7).padStart(3, "0")}`,
    }))

    const models = [
        ["Toyota", "Corolla"], ["Honda", "Civic"], ["Mazda", "CX-5"], ["Ford", "Ranger"],
        ["Tesla", "Model 3"], ["Toyota", "Hilux"], ["Kia", "Sportage"], ["BMW", "X3"],
        ["Hyundai", "Tucson"], ["Mitsubishi", "Outlander"], ["Subaru", "Outback"], ["Nissan", "Leaf"],
    ] as const
    const colors = ["White", "Black", "Silver", "Grey", "Blue", "Red"] as const

    const vehicles: Vehicle[] = models.map(([make, model], index) => ({
        id: index + 1,
        make,
        model,
        year: String(2014 + Math.floor(random() * 11)),
        rego: `${String.fromCharCode(65 + index)}${String.fromCharCode(75 + (index % 10))}${String.fromCharCode(80 + (index % 8))}${100 + Math.floor(random() * 900)}`,
        customerId: (customers[index % customers.length] as Customer).id,
        color: pick(colors),
        lastDetail: "",
        notes: index === 1 ? "Pet hair on back seat" : "",
    }))

    const services: Service[] = [
        { id: 1, name: "Exterior Wash", price: 60, durationMins: 60 },
        { id: 2, name: "Interior Detail", price: 140, durationMins: 120 },
        { id: 3, name: "Full Detail", price: 240, durationMins: 240 },
        { id: 4, name: "Ceramic Coating", price: 650, durationMins: 360 },
    ]
    const serviceWeights = [1, 1, 1, 2, 2, 3, 3, 3, 4] // ids, weighted toward full details

    const today = todayISO()
    const jobs: Job[] = []
    const times = ["08:30", "09:00", "10:00", "11:30", "13:00", "14:30", "16:00"] as const

    for (let offset = -182; offset <= 14; offset++) {
        const date = addDays(today, offset)
        // Business grows over time: ~1 job every 3 days early on, ~1 a day lately.
        const progress = (offset + 182) / 196
        const chance = 0.3 + progress * 0.55
        let count = 0
        if (random() < chance) count++
        if (random() < chance * 0.35) count++

        for (let n = 0; n < count; n++) {
            const vehicle = pick(vehicles)
            const serviceId = pick(serviceWeights)
            const service = services.find((s) => s.id === serviceId) as Service
            const items = [{ serviceId: service.id, name: service.name, price: service.price, durationMins: service.durationMins }]
            // Some washes come with an interior detail as well.
            const extra = services[1] as Service
            if (service.id === 1 && random() < 0.4) items.push({ serviceId: extra.id, name: extra.name, price: extra.price, durationMins: extra.durationMins })
            let status: JobStatus = "booked"
            if (offset < -3) status = random() < 0.95 ? "paid" : "done"
            else if (offset < 0) status = random() < 0.5 ? "paid" : "done"
            else if (offset === 0) status = n === 0 ? "in-progress" : "booked"

            jobs.push({
                id: jobs.length + 1,
                customerId: vehicle.customerId as number,
                vehicleId: vehicle.id,
                items,
                date,
                time: times[(n * 3 + Math.floor(random() * 4)) % times.length] as string,
                price: items.reduce((sum, i) => sum + i.price, 0),
                status,
                notes: "",
                invoiceNumber: null,
                invoiceDate: "",
            })
        }
    }

    // A vehicle's last detail is its most recent finished job.
    for (const vehicle of vehicles) {
        const finished = jobs
            .filter((j) => j.vehicleId === vehicle.id && (j.status === "done" || j.status === "paid"))
            .map((j) => j.date)
            .sort()
        vehicle.lastDetail = finished[finished.length - 1] ?? ""
    }
    // Leave a couple of cars overdue so "due for a detail" has entries.
    for (const vehicle of vehicles.slice(-2)) {
        for (const job of jobs) {
            if (job.vehicleId === vehicle.id && job.date > addDays(today, -75)) job.vehicleId = (vehicles[0] as Vehicle).id
        }
    }
    for (const job of jobs) {
        job.customerId = (vehicles.find((v) => v.id === job.vehicleId) as Vehicle).customerId as number
    }
    for (const vehicle of vehicles) {
        const finished = jobs
            .filter((j) => j.vehicleId === vehicle.id && (j.status === "done" || j.status === "paid"))
            .map((j) => j.date)
            .sort()
        vehicle.lastDetail = finished[finished.length - 1] ?? ""
    }

    return { customers, vehicles, services, jobs }
}
