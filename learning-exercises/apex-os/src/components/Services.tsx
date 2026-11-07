import { useState } from "react"
import type React from "react"
import { useData } from "../data/useData"
import type { Service } from "../types/service"
import { formatMoney } from "../utils/date"
import { EmptyState, PageHeader } from "./ui"

type Fields = { name: string, price: string, durationMins: string }

const emptyFields: Fields = { name: "", price: "", durationMins: "" }

function formatDuration(mins: number): string {
    if (mins < 60) return `${mins} min`
    const hours = mins / 60
    return `${Number.isInteger(hours) ? hours : hours.toFixed(1)} h`
}

function Services() {
    const { services, jobs, addService, updateService, deleteService } = useData()
    const [fields, setFields] = useState<Fields>(emptyFields)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")

    function reset() {
        setFields(emptyFields)
        setEditingId(null)
        setError("")
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const price = Number(fields.price)
        const durationMins = Number(fields.durationMins)
        if (fields.name.trim() === "") return setError("Enter a service name.")
        if (fields.price === "" || !Number.isFinite(price) || price < 0) return setError("Enter a price, like 120.")
        if (!Number.isInteger(durationMins) || durationMins <= 0) return setError("Enter the time it takes in minutes, like 90.")

        const details = { name: fields.name.trim(), price, durationMins }
        if (editingId === null) {
            addService(details)
            setMessage("Service added.")
        } else {
            updateService({ id: editingId, ...details })
            setMessage("Service saved.")
        }
        reset()
    }

    function startEdit(service: Service) {
        setFields({ name: service.name, price: String(service.price), durationMins: String(service.durationMins) })
        setEditingId(service.id)
        setError("")
        setMessage("")
    }

    function handleDelete(service: Service) {
        const used = jobs.filter((j) => j.serviceId === service.id).length
        if (used > 0) {
            setMessage("")
            setError(`${service.name} is used by ${used} job(s), so it can't be deleted.`)
            return
        }
        deleteService(service.id)
        if (editingId === service.id) reset()
        setMessage("Service deleted.")
    }

    return (
        <div>
            <PageHeader title="Services" subtitle="Your services and prices. New jobs start with these prices." />

            {message && <div className="flash" role="status">{message}</div>}

            <form className="card card-pad form" onSubmit={handleSubmit} noValidate>
                <h2>{editingId === null ? "Add a service" : "Edit service"}</h2>
                <div className="form-row">
                    <label className="field" style={{ gridColumn: "span 2" }}>
                        <span>Name</span>
                        <input value={fields.name} placeholder="Ceramic coating" onChange={(e) => setFields({ ...fields, name: e.target.value })} />
                    </label>
                    <label className="field">
                        <span>Price ($)</span>
                        <input className="tnum" inputMode="decimal" value={fields.price} placeholder="250" onChange={(e) => setFields({ ...fields, price: e.target.value })} />
                    </label>
                    <label className="field">
                        <span>Time (minutes)</span>
                        <input className="tnum" inputMode="numeric" value={fields.durationMins} placeholder="120" onChange={(e) => setFields({ ...fields, durationMins: e.target.value })} />
                    </label>
                </div>
                {error && <span className="field-error">{error}</span>}
                <div className="form-actions">
                    {editingId !== null && <button className="btn btn-ghost" type="button" onClick={reset}>Cancel</button>}
                    <button className="btn btn-primary" type="submit">{editingId === null ? "Add service" : "Save"}</button>
                </div>
            </form>

            <section className="section" style={{ marginTop: 24 }}>
                <div className="card">
                    {services.length === 0 ?
                        <EmptyState title="No services yet. Add your first one above." /> :
                        <table className="table">
                            <thead>
                                <tr><th>Service</th><th className="num">Price</th><th className="num">Time</th><th className="num">Jobs</th><th></th></tr>
                            </thead>
                            <tbody>
                                {services.map((service) => (
                                    <tr key={service.id}>
                                        <td className="lead main">{service.name}</td>
                                        <td data-label="Price" className="num">{formatMoney(service.price)}</td>
                                        <td data-label="Time" className="num">{formatDuration(service.durationMins)}</td>
                                        <td data-label="Jobs" className="num">{jobs.filter((j) => j.serviceId === service.id).length}</td>
                                        <td className="num">
                                            <button className="btn btn-ghost" onClick={() => startEdit(service)}>Edit</button>
                                            <button className="btn btn-ghost btn-danger" onClick={() => handleDelete(service)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    }
                </div>
            </section>
        </div>
    )
}

export default Services
