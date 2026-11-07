import { useState } from "react"
import type React from "react"
import { Link, useNavigate, useParams, useSearchParams } from "react-router"
import { useData } from "../data/useData"
import type { JobItem, JobStatus } from "../types/job"
import { JOB_STATUSES } from "../types/job"
import { formatMoney, todayISO } from "../utils/date"
import { clashesWith, durationOf, endTime, formatDuration, itemsLabel } from "../utils/jobs"
import { EmptyState, Flash, PageHeader, STATUS_LABELS, Steps } from "./ui"
import Icon from "./Icon"

type Errors = Partial<Record<"customer" | "vehicle" | "service" | "when" | "price", string>>

// A service ticked on the form; price is kept as text while it's being typed.
type Line = Omit<JobItem, "price"> & { price: string }

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
    const [lines, setLines] = useState<Line[]>(existing ? existing.items.map((i) => ({ ...i, price: String(i.price) })) : [])
    const [date, setDate] = useState(existing?.date ?? todayISO())
    const [time, setTime] = useState(existing?.time ?? "09:00")
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

    // Every service you can tick: the current list plus any old ones already on this job.
    const options: Omit<JobItem, "price">[] = [
        ...services.map((s) => ({ serviceId: s.id, name: s.name, durationMins: s.durationMins })),
        ...lines.filter((l) => !services.some((s) => s.id === l.serviceId)),
    ]

    function toggleService(serviceId: number) {
        const ticked = lines.some((l) => l.serviceId === serviceId)
        if (ticked) {
            setLines(lines.filter((l) => l.serviceId !== serviceId))
            return
        }
        const service = services.find((s) => s.id === serviceId)
        if (service) setLines([...lines, { serviceId, name: service.name, price: String(service.price), durationMins: service.durationMins }])
    }

    function setLinePrice(serviceId: number, value: string) {
        setLines(lines.map((l) => l.serviceId === serviceId ? { ...l, price: value } : l))
    }

    const items: JobItem[] = lines.map((l) => ({ ...l, price: Number(l.price) || 0 }))
    const total = items.reduce((sum, i) => sum + i.price, 0)
    const clashes = date && time && lines.length > 0 ? clashesWith({ id: existing?.id ?? -1, date, time, items }, jobs) : []

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const next: Errors = {}
        if (!customer) next.customer = "Choose a customer."
        if (!vehicle) next.vehicle = "Choose a vehicle."
        if (lines.length === 0) next.service = "Tick at least one service."
        if (!date || !time) next.when = "Choose a date and time."
        if (lines.some((l) => l.price === "" || !Number.isFinite(Number(l.price)) || Number(l.price) < 0)) next.price = "Enter a price for each service, like 120."
        setErrors(next)
        if (Object.keys(next).length > 0 || !customer || !vehicle) return

        const details = {
            customerId: customer.id,
            vehicleId: vehicle.id,
            items,
            date,
            time,
            price: total,
            status,
            notes: notes.trim(),
        }
        if (existing) {
            updateJob({ ...existing, ...details })
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

                <fieldset className="field">
                    <legend>Services</legend>
                    {options.length === 0 ?
                        <div className="notice">No services yet. <Link to="/services">Add a service</Link> with its price first.</div> :
                        <div className="service-list" aria-invalid={errors.service ? true : undefined}>
                            {options.map((option) => {
                                const line = lines.find((l) => l.serviceId === option.serviceId)
                                const service = services.find((s) => s.id === option.serviceId)
                                return (
                                    <div key={option.serviceId} className={line ? "service-option picked-option" : "service-option"}>
                                        <label className="check">
                                            <input type="checkbox" checked={line !== undefined} disabled={!service && !line}
                                                onChange={() => line && !service ? setLines(lines.filter((l) => l !== line)) : toggleService(option.serviceId)} />
                                            <span>
                                                {option.name}
                                                <span className="secondary small"> · {formatDuration(option.durationMins)}</span>
                                            </span>
                                        </label>
                                        {line ?
                                            <span className="line-price">
                                                <span className="secondary">$</span>
                                                <input inputMode="decimal" className="tnum" value={line.price} aria-label={`Price for ${option.name}`}
                                                    onChange={(event) => setLinePrice(option.serviceId, event.target.value)} />
                                            </span> :
                                            <span className="secondary tnum">{service ? formatMoney(service.price) : ""}</span>}
                                    </div>
                                )
                            })}
                        </div>
                    }
                    {errors.service && <span className="field-error">{errors.service}</span>}
                    {errors.price && <span className="field-error">{errors.price}</span>}
                    {lines.length > 0 &&
                        <div className="job-total">
                            <span className="secondary">{itemsLabel(items)} · {formatDuration(durationOf(items))}</span>
                            <strong className="tnum">{formatMoney(total)}</strong>
                        </div>
                    }
                </fieldset>

                <div className="form-row">
                    <label className="field">
                        <span>Date</span>
                        <input type="date" className="tnum" value={date} onChange={(event) => setDate(event.target.value)} />
                    </label>
                    <label className="field">
                        <span>Start time</span>
                        <input type="time" className="tnum" value={time} onChange={(event) => setTime(event.target.value)} />
                    </label>
                </div>
                {errors.when && <span className="field-error">{errors.when}</span>}
                {clashes.length > 0 &&
                    <div className="warning" role="status">
                        <Icon name="alert" size={16} />
                        <span>
                            This overlaps with {clashes.map((c) => `${customers.find((x) => x.id === c.customerId)?.name ?? "another job"} (${c.time}–${endTime(c)})`).join(", ")}.
                            You can still save it.
                        </span>
                    </div>
                }

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
