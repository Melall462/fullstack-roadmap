import { createContext } from "react"
import type { Customer } from "../types/customer"
import type { Vehicle } from "../types/vehicle"
import type { Service } from "../types/service"
import type { Job, JobStatus } from "../types/job"

export type DataContextValue = {
    customers: Customer[],
    vehicles: Vehicle[],
    services: Service[],
    jobs: Job[],

    addCustomer: (name: string, email: string) => void,
    updateCustomer: (customer: Customer) => void,
    deleteCustomer: (customerId: number) => void,

    addVehicle: (vehicle: Omit<Vehicle, "id">) => void,
    updateVehicle: (vehicle: Vehicle) => void,
    deleteVehicle: (vehicleId: number) => void,

    addService: (service: Omit<Service, "id">) => void,
    updateService: (service: Service) => void,
    deleteService: (serviceId: number) => void,

    addJob: (job: Omit<Job, "id">) => void,
    updateJob: (job: Job) => void,
    deleteJob: (jobId: number) => void,
    setJobStatus: (jobId: number, status: JobStatus) => void,
}

export const DataContext = createContext<DataContextValue | null>(null)
