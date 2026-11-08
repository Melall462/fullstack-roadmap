import { createContext } from "react"
import type { Customer } from "../types/customer"
import type { Vehicle } from "../types/vehicle"
import type { Service } from "../types/service"
import type { Job, JobStatus } from "../types/job"
import type { Settings } from "../types/settings"

// The last thing deleted, so it can be brought back with Undo.
export type UndoNotice = { id: number, message: string }

export type DataContextValue = {
    customers: Customer[],
    vehicles: Vehicle[],
    services: Service[],
    jobs: Job[],
    settings: Settings,

    // Account and saving
    userEmail: string,
    signOut: () => void,
    saveState: "saved" | "saving" | "error",
    saveError: string,
    retrySave: () => void,
    hasBrowserData: boolean,          // data from the old localStorage version is in this browser
    importFromBrowser: () => number,  // returns how many records were imported

    updateSettings: (changes: Partial<Settings>) => void,
    loadDemoData: () => void,

    addCustomer: (customer: Omit<Customer, "id">) => number,
    updateCustomer: (customer: Customer) => void,
    deleteCustomer: (customerId: number) => void,

    addVehicle: (vehicle: Omit<Vehicle, "id">) => number,
    updateVehicle: (vehicle: Vehicle) => void,
    deleteVehicle: (vehicleId: number) => void,

    addService: (service: Omit<Service, "id">) => void,
    updateService: (service: Service) => void,
    deleteService: (serviceId: number) => void,

    addJob: (job: Omit<Job, "id" | "invoiceNumber" | "invoiceDate" | "nextJobId">) => number,
    updateJob: (job: Job) => void,
    deleteJob: (jobId: number) => void,
    setJobStatus: (jobId: number, status: JobStatus) => void,
    createInvoice: (jobId: number) => void,

    undo: UndoNotice | null,
    undoDelete: () => void,
    dismissUndo: () => void,
}

export const DataContext = createContext<DataContextValue | null>(null)
