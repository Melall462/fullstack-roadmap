export const JOB_STATUSES = ["booked", "in-progress", "done", "paid"] as const

export type JobStatus = typeof JOB_STATUSES[number]

// One service on a job. Name, price and time are copied from the service when
// the job is saved, so renaming or repricing a service never changes old jobs.
export type JobItem = {
    serviceId: number,
    name: string,
    price: number,
    durationMins: number
}

// "Every 2 weeks" is { every: 2, unit: "week" }.
export type Repeat = {
    every: number,
    unit: "week" | "month"
}

export type Job = {
    id: number,
    customerId: number,
    vehicleId: number,
    items: JobItem[],
    date: string,
    time: string,
    price: number,          // total of all items
    status: JobStatus,
    notes: string,
    invoiceNumber: number | null,
    invoiceDate: string,    // "" until an invoice is created
    repeat: Repeat | null,  // null for a one-off job
    nextJobId: number | null // the job booked automatically after this one, once it's done
}
