export const JOB_STATUSES = ["booked", "in-progress", "done", "paid"] as const

export type JobStatus = typeof JOB_STATUSES[number]

export type Job = {
    id: number,
    customerId: number,
    vehicleId: number,
    serviceId: number,
    date: string,
    time: string,
    price: number,
    status: JobStatus,
    notes: string
}
