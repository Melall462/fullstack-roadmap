import { useState } from "react"
import type React from "react"
import { useData } from "../data/useData"
import type { Service } from "../types/service"
import { formatMoney } from "../utils/date"
import "./Services.css"

type ServiceForm = { name: string, price: string, durationMins: string }

const emptyForm: ServiceForm = { name: "", price: "", durationMins: "" }

function Services() {
    const { services, jobs, addService, updateService, deleteService } = useData()
    const [form, setForm] = useState<ServiceForm>(emptyForm)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [error, setError] = useState("")

    function resetForm() {
        setForm(emptyForm)
        setEditingId(null)
        setError("")
    }

    function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault()
        const price = Number(form.price)
        const durationMins = Number(form.durationMins)

        if (form.name.trim() === "") {
            setError("Please enter a service name")
            return
        }
        if (form.price === "" || !Number.isFinite(price) || price < 0) {
            setError("Please enter a valid price")
            return
        }
        if (form.durationMins === "" || !Number.isInteger(durationMins) || durationMins <= 0) {
            setError("Please enter the duration in whole minutes")
            return
        }

        const details = { name: form.name.trim(), price, durationMins }
        if (editingId === null) {
            addService(details)
        } else {
            updateService({ id: editingId, ...details })
        }
        resetForm()
    }

    function startEdit(service: Service) {
        setForm({ name: service.name, price: String(service.price), durationMins: String(service.durationMins) })
        setEditingId(service.id)
        setError("")
    }

    function handleDelete(service: Service) {
        const jobCount = jobs.filter((j) => j.serviceId === service.id).length
        if (jobCount > 0) {
            window.alert(`"${service.name}" is used by ${jobCount} job(s), so it can't be deleted.`)
            return
        }
        deleteService(service.id)
        if (editingId === service.id) resetForm()
    }

    return (
        <div>
            <h1>Services</h1>
            <form className="service-form" onSubmit={handleSubmit}>
                <input placeholder="Service name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
                <input placeholder="Price ($)" inputMode="decimal" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} />
                <input placeholder="Duration (mins)" inputMode="numeric" value={form.durationMins} onChange={(event) => setForm({ ...form, durationMins: event.target.value })} />
                <button className="btn btn-primary" type="submit">{editingId === null ? "Add Service" : "Save"}</button>
                {editingId !== null && <button className="btn btn-danger" type="button" onClick={resetForm}>Cancel</button>}
            </form>
            {error && <p className="error-message">{error}</p>}

            {services.length === 0 ?
                <p>No services yet. Add your first package above.</p> :
                <table className="services-table">
                    <thead>
                        <tr><th>Service</th><th>Price</th><th>Duration</th><th>Jobs</th><th></th></tr>
                    </thead>
                    <tbody>
                        {services.map((service) => (
                            <tr key={service.id}>
                                <td>{service.name}</td>
                                <td>{formatMoney(service.price)}</td>
                                <td>{service.durationMins} mins</td>
                                <td>{jobs.filter((j) => j.serviceId === service.id).length}</td>
                                <td className="row-actions">
                                    <button className="btn btn-small" onClick={() => startEdit(service)}>Edit</button>
                                    <button className="btn btn-small btn-danger" onClick={() => handleDelete(service)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            }
        </div>
    )
}

export default Services
