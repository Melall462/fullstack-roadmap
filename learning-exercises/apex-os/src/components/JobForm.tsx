import { useState } from "react"
import type React from "react"
import { Link, useNavigate, useParams, useSearchParams } from "react-router"
import { useData } from "../data/useData"
import type { JobStatus } from "../types/job"
import { JOB_STATUSES } from "../types/job"
import { formatMoney, todayISO } from "../utils/date"
import { EmptyState, Flash, PageHeader, STATUS_LABELS, Steps } from "./ui"

type Errors = Partial<Record<"customer" | "vehicle" | "service" | "when" | "price", string>>

// Create a job (step 3 of the flow) or edit an existing one.
// The customer and vehicle carry forward from the earlier steps via ?customer= / ?vehicle=.
function JobForm() {
    const { customers, vehicles, services, jobs, addJob, updateJob } = useData()
    const navigate = useNavigate()
    const params = useParams()
    const [searchParams] = useSearchParams()

    const isEdit = params["id"] !== undefined
    const existing = isEdit ? jobs.find((j) => j.id === Number(params["id"])) : undefined

    const presetVehicle = vehicles.find((v) => v.id === Number(searchParams.get("vehicle")))
    const presetCustomer = customers.find((c) => c.id === (presetVehicle?.customerId ?? Number(searchParams.get("customer"))))
    const onlyVehicle = (customerId: number | undefined) => {
        const owned = vehicles.filter((v) => v.customerId === customerId)
        return owned.length === 1 && owned[0] ? String(owned[0].id) : ""
    }

    const [customerId, setCustomerId] = useState(existing ? String(existing.customerId) : presetCustomer ? String(presetCustomer.id) : "")
    const [vehicleId, setVehicleId] = useState(existing ? String(existing.vehicleId) : presetVehicle ? String(presetVehicle.id) : onlyVehicle(presetCustomer?.id))
    const [pickCustomer, setPickCustomer] = useState(!existing && !presetCustomer)
    const [pickVehicle, setPickVehicle] = useState(!existing && !presetVehicle && onlyVehicle(presetCustomer?.id) === "")
    const [serviceId, setServiceId] = useState(existing ? String(existing.serviceId) : "")
    const [date, setDate] = useState(existing?.date ?? todayISO())
    const [time, setTime] = useState(existing?.time ?? "09:00")
    const [price, setPrice] = useState(existing ? String(existing.price) : "")
    const [status, setStatus] = useState<JobStatus>(existing?.status ?? "booked")
    const [notes, setNotes] = useState(existing?.notes ?? "")
    const [errors, setErrors] = useState<Errors>({})

    if (isEdit && !existing) {
        return <div className="card"><EmptyState title="Job not found" /></div>
    }

    const customer = customers.find((c) => String(c.id) === customerId)
    const vehicle = vehicles.find((v) => String(v.id) === vehicleId)
    const owned = vehicles.filter((v) => customer && v.customerId === customer.id)

    function chooseCustomer(value: string) {
        setCustomerId(value)
        const only = onlyVehicle(Number(value))
        setVehicleId(only)
        setPickVehicle(only === "")
    }

    function chooseService(value: string) {
        setServiceId(value)
        const service = services.find((s) => String(s.id) === value)
        if (service) setPrice(String(service.price))
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const amount = Number(price)
        const next: Errors = {}
        if (!customer) next.customer = "Choose a customer."
        if (!vehicle) next.vehicle = "Choose a vehicle."
        if (!serviceId) next.service = "Choose a service."
        if (!date || !time) next.when = "Choose a date and time."
        if (price === "" || !Number.isFinite(amount) || amount < 0) next.price = "Enter a price, like 120."
        setErrors(next)
        if (Object.keys(next).length > 0 || !customer || !vehicle) return

        const details = {
            customerId: customer.id,
            vehicleId: vehicle.id,
            serviceId: Number(serviceId),
            date,
            time,
            price: amount,
            status,
            notes: notes.trim(),
        }
        if (existing) {
            updateJob({ ...details, id: existing.id })
            navigate(`/jobs/${existing.id}`, { state: { flash: "Job saved." } })
        } else {
            const id = addJob(details)
            navigate(`/jobs/${id}`, { state: { flash: "Job created." } })
        }
    }

    if (!existing && customers.length === 0) {
        return (
            <div className="narrow">
                <PageHeader title="New job" />
                <Steps current={1} />
                <div className="card">
                    <EmptyState title="Start with the customer">
                        Add who the job is for, then their vehicle.
                        <div className="toolbar"><Link className="btn btn-primary" to="/customers/new">Add customer</Link></div>
                    </EmptyState>
                </div>
            </div>
        )
    }

    return (
        <div className="narrow">
            <Flash />
            <PageHeader
                title={existing ? "Edit job" : "Create a job"}
                back={existing ? { to: `/jobs/${existing.id}`, label: "Job" } : { to: "/jobs", label: "Jobs" }}
            />
            {!existing && <Steps current={!customer ? 1 : !vehicle ? 2 : 3} />}

            <form className="card card-pad form" onSubmit={handleSubmit} noValidate>
                {customer && !pickCustomer ?
                    <div className="picked">
                        <div><div className="label">Customer</div><strong>{customer.name}</strong></div>
                        <button className="btn-link" type="button" onClick={() => setPickCustomer(true)}>Change</button>
                    </div> :
                    <label className="field">
                        <span>Customer</span>
                        <select value={customerId} aria-invalid={errors.customer ? true : undefined} onChange={(event) => chooseCustomer(event.target.value)}>
                            <option value="">Choose a customer</option>
                            {[...customers].sort((a, b) => a.name.localeCompare(b.name)).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        {errors.customer ?
                            <span className="field-error">{errors.customer}</span> :
                            <span className="hint">New customer? <Link to="/customers/new">Add customer</Link></span>}
                    </label>
                }

                {customer && (vehicle && !pickVehicle ?
                    <div className="picked">
                        <div><div className="label">Vehicle</div><strong><span className="plate">{vehicle.rego}</span> {vehicle.year} {vehicle.make} {vehicle.model}</strong></div>
                        <button className="btn-link" type="button" onClick={() => setPickVehicle(true)}>Change</button>
                    </div> :
                    owned.length === 0 ?
                        <div className="notice">
                            {customer.name} has no vehicles yet. <Link to={`/vehicles/new?customer=${customer.id}`}>Add a vehicle for {customer.name}</Link>
                        </div> :
                        <label className="field">
                            <span>Vehicle</span>
                            <select value={vehicleId} aria-invalid={errors.vehicle ? true : undefined} onChange={(event) => setVehicleId(event.target.value)}>
                                <option value="">Choose a vehicle</option>
                                {owned.map((v) => <option key={v.id} value={v.id}>{v.rego} · {v.year} {v.make} {v.model}</option>)}
                            </select>
                            {errors.vehicle ?
                                <span className="field-error">{errors.vehicle}</span> :
                                <span className="hint">Different vehicle? <Link to={`/vehicles/new?customer=${customer.id}`}>Add vehicle</Link></span>}
                        </label>
                )}

                <label className="field">
                    <span>Service</span>
                    {services.length === 0 ?
                        <div className="notice">No services yet. <Link to="/services">Add a service</Link> with its price first.</div> :
                        <select value={serviceId} aria-invalid={errors.service ? true : undefined} onChange={(event) => chooseService(event.target.value)}>
                            <option value="">Choose a service</option>
                            {services.map((s) => <option key={s.id} value={s.id}>{s.name} · {formatMoney(s.price)}</option>)}
                        </select>
                    }
                    {errors.service && <span className="field-error">{errors.service}</span>}
                </label>

                <div className="form-row">
                    <label className="field">
                        <span>Date</span>
                        <input type="date" className="tnum" value={date} onChange={(event) => setDate(event.target.value)} />
                    </label>
                    <label className="field">
                        <span>Time</span>
                        <input type="time" className="tnum" value={time} onChange={(event) => setTime(event.target.value)} />
                    </label>
                    <label className="field">
                        <span>Price ($)</span>
                        <input inputMode="decimal" className="tnum" value={price} placeholder="0.00" aria-invalid={errors.price ? true : undefined}
                            onChange={(event) => setPrice(event.target.value)} />
                    </label>
                </div>
                {(errors.when || errors.price) && <span className="field-error">{errors.when ?? errors.price}</span>}

                {existing &&
                    <label className="field">
                        <span>Status</span>
                        <select value={status} onChange={(event) => setStatus(event.target.value as JobStatus)}>
                            {JOB_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                        </select>
                    </label>
                }

                <label className="field">
                    <span>Notes <span className="hint">(optional)</span></span>
                    <textarea value={notes} placeholder="Anything the job needs" onChange={(event) => setNotes(event.target.value)} />
                </label>

                <div className="form-actions">
                    <button className="btn btn-ghost" type="button" onClick={() => navigate(-1)}>Cancel</button>
                    <button className="btn btn-primary" type="submit">{existing ? "Save" : "Create job"}</button>
                </div>
            </form>
        </div>
    )
}

export default JobForm
