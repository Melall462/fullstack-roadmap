import { useState } from "react"
import type React from "react"
import { useData } from "../data/useData"
import type { Job, JobStatus } from "../types/job"
import { JOB_STATUSES } from "../types/job"
import { todayISO } from "../utils/date"

type Props = {
    job: Job | null,
    onSave: (job: Omit<Job, "id">) => void,
    onClose: () => void
}

function JobForm({ job, onSave, onClose }: Props) {
    const { customers, vehicles, services } = useData()

    const [customerId, setCustomerId] = useState(job ? String(job.customerId) : "")
    const [vehicleId, setVehicleId] = useState(job ? String(job.vehicleId) : "")
    const [serviceId, setServiceId] = useState(job ? String(job.serviceId) : "")
    const [date, setDate] = useState(job ? job.date : todayISO())
    const [time, setTime] = useState(job ? job.time : "09:00")
    const [price, setPrice] = useState(job ? String(job.price) : "")
    const [status, setStatus] = useState<JobStatus>(job ? job.status : "booked")
    const [notes, setNotes] = useState(job ? job.notes : "")
    const [error, setError] = useState("")

    const customerVehicles = vehicles.filter((v) => String(v.customerId) === customerId)

    function handleCustomerChange(value: string) {
        setCustomerId(value)
        // Pick the customer's only vehicle automatically, otherwise make them choose.
        const owned = vehicles.filter((v) => String(v.customerId) === value)
        setVehicleId(owned.length === 1 && owned[0] ? String(owned[0].id) : "")
    }

    function handleServiceChange(value: string) {
        setServiceId(value)
        const service = services.find((s) => String(s.id) === value)
        if (service) setPrice(String(service.price))
    }

    function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault()
        const priceNumber = Number(price)

        if (!customerId || !vehicleId || !serviceId) {
            setError("Please choose a customer, vehicle and service")
            return
        }
        if (!date || !time) {
            setError("Please choose a date and time")
            return
        }
        if (price === "" || !Number.isFinite(priceNumber) || priceNumber < 0) {
            setError("Please enter a valid price")
            return
        }

        onSave({
            customerId: Number(customerId),
            vehicleId: Number(vehicleId),
            serviceId: Number(serviceId),
            date,
            time,
            price: priceNumber,
            status,
            notes: notes.trim(),
        })
    }

    return (
        <form className="job-form" onSubmit={handleSubmit}>
            <h2>{job ? "Edit Job" : "New Job"}</h2>

            <label>
                Customer
                <select value={customerId} onChange={(event) => handleCustomerChange(event.target.value)}>
                    <option value="">Choose a customer</option>
                    {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </label>

            <label>
                Vehicle
                <select value={vehicleId} onChange={(event) => setVehicleId(event.target.value)} disabled={!customerId}>
                    <option value="">{customerId && customerVehicles.length === 0 ? "This customer has no vehicles" : "Choose a vehicle"}</option>
                    {customerVehicles.map((v) => <option key={v.id} value={v.id}>{v.year} {v.make} {v.model} - {v.rego}</option>)}
                </select>
            </label>

            <label>
                Service
                <select value={serviceId} onChange={(event) => handleServiceChange(event.target.value)}>
                    <option value="">Choose a service</option>
                    {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
            </label>

            <div className="form-row">
                <label>
                    Date
                    <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
                </label>
                <label>
                    Time
                    <input type="time" value={time} onChange={(event) => setTime(event.target.value)} />
                </label>
            </div>

            <div className="form-row">
                <label>
                    Price ($)
                    <input inputMode="decimal" value={price} onChange={(event) => setPrice(event.target.value)} />
                </label>
                <label>
                    Status
                    <select value={status} onChange={(event) => setStatus(event.target.value as JobStatus)}>
                        {JOB_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                </label>
            </div>

            <label>
                Notes
                <textarea value={notes} onChange={(event) => setNotes(event.target.value)} />
            </label>

            {error && <p className="error-message">{error}</p>}

            <div className="form-actions">
                <button className="btn btn-primary" type="submit">{job ? "Save" : "Add Job"}</button>
                <button className="btn btn-danger" type="button" onClick={onClose}>Cancel</button>
            </div>
        </form>
    )
}

export default JobForm
