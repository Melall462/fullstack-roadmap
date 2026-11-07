import { useState } from "react"
import type React from "react"
import VehicleCard from "./VehicleCard"
import "./Vehicles.css"
import { useData } from "../data/useData"
import type { Vehicle } from "../types/vehicle"

type VehicleForm = {
    make: string,
    model: string,
    year: string,
    rego: string,
    color: string,
    customerId: string,
    notes: string
}

const emptyForm: VehicleForm = { make: "", model: "", year: "", rego: "", color: "", customerId: "", notes: "" }

function capitalize(value: string): string {
    const trimmed = value.trim()
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase()
}

function Vehicles() {
    const { vehicles, customers, jobs, addVehicle, updateVehicle, deleteVehicle } = useData()

    const [searchTerm, setSearchTerm] = useState("")
    const [form, setForm] = useState<VehicleForm>(emptyForm)
    const [error, setError] = useState("")
    const [editingId, setEditingId] = useState<number | null>(null)
    const [isFormOpen, setIsFormOpen] = useState(false)

    const normalizedSearch = searchTerm.toLowerCase().trim()

    function ownerName(vehicle: Vehicle): string {
        return customers.find((c) => c.id === vehicle.customerId)?.name ?? ""
    }

    const filteredVehicles = vehicles.filter((vehicle) => (
        vehicle.rego.toLowerCase().includes(normalizedSearch) ||
        vehicle.make.toLowerCase().includes(normalizedSearch) ||
        vehicle.model.toLowerCase().includes(normalizedSearch) ||
        ownerName(vehicle).toLowerCase().includes(normalizedSearch)
    ))

    function updateField(field: keyof VehicleForm, value: string) {
        setForm((previous) => ({ ...previous, [field]: value }))
    }

    function closeForm() {
        setForm(emptyForm)
        setEditingId(null)
        setError("")
        setIsFormOpen(false)
    }

    function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault()
        setError("")

        if (form.make.trim() === "" || form.model.trim() === "" || form.year.trim() === "" || form.rego.trim() === "") {
            setError("Please fill in make, model, year and rego")
            return
        }
        if (!/^\d{4}$/.test(form.year.trim())) {
            setError("Please enter a 4-digit year")
            return
        }

        const rego = form.rego.trim().toUpperCase()
        if (vehicles.some((vehicle) => vehicle.rego === rego && vehicle.id !== editingId)) {
            setError("A vehicle with that rego already exists")
            return
        }

        const details = {
            make: capitalize(form.make),
            model: capitalize(form.model),
            year: form.year.trim(),
            rego,
            color: capitalize(form.color),
            customerId: form.customerId === "" ? null : Number(form.customerId),
            notes: form.notes.trim(),
        }

        const existing = vehicles.find((vehicle) => vehicle.id === editingId)
        if (existing) {
            updateVehicle({ ...existing, ...details })
        } else {
            addVehicle({ ...details, lastDetail: "" })
        }
        closeForm()
    }

    function handleEdit(vehicleId: number) {
        const vehicle = vehicles.find((v) => v.id === vehicleId)
        if (!vehicle) return
        setForm({
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            rego: vehicle.rego,
            color: vehicle.color,
            customerId: vehicle.customerId === null ? "" : String(vehicle.customerId),
            notes: vehicle.notes,
        })
        setEditingId(vehicleId)
        setIsFormOpen(true)
    }

    function handleDelete(vehicleId: number) {
        const jobCount = jobs.filter((j) => j.vehicleId === vehicleId).length
        if (jobCount > 0 && !window.confirm(`This will also delete ${jobCount} job(s) for this vehicle. Continue?`)) {
            return
        }
        deleteVehicle(vehicleId)
    }

    return(
        <div>
            <h1>Vehicles</h1>
            <input className="vehicle-search" placeholder="Search Vehicle..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)}></input>
            {!isFormOpen && <button className="add-vehicle-button-popup" type="button" onClick={() => setIsFormOpen(true)}>Add Vehicle</button>}
            {isFormOpen &&
                <div className="modal-overlay" onClick={closeForm}>
                    <div className="modal-panel" onClick={(event) => event.stopPropagation()}>
                        <form className="add-vehicle" onSubmit={handleSubmit}>
                            <h2>{editingId === null ? "Add Vehicle" : "Edit Vehicle"}</h2>
                            <select className="vehicle-input" value={form.customerId} onChange={(event) => updateField("customerId", event.target.value)}>
                                <option value="">No owner</option>
                                {customers.map((customer) => (
                                    <option key={customer.id} value={customer.id}>{customer.name}</option>
                                ))}
                            </select>
                            <input className="vehicle-input" placeholder="Make" value={form.make} onChange={(event) => updateField("make", event.target.value)}></input>
                            <input className="vehicle-input" placeholder="Model" value={form.model} onChange={(event) => updateField("model", event.target.value)}></input>
                            <input className="vehicle-input" placeholder="Year" inputMode="numeric" value={form.year} onChange={(event) => updateField("year", event.target.value)}></input>
                            <input className="vehicle-input" placeholder="Rego" value={form.rego} onChange={(event) => updateField("rego", event.target.value)}></input>
                            <input className="vehicle-input" placeholder="Colour" value={form.color} onChange={(event) => updateField("color", event.target.value)}></input>
                            <textarea className="vehicle-input" placeholder="Notes" value={form.notes} onChange={(event) => updateField("notes", event.target.value)}></textarea>
                            {error !== "" && <p className="error-message">{error}</p>}
                            <button className="add-vehicle-button" type="submit">{editingId === null ? "Add Vehicle" : "Update"}</button>
                            <button className="cancel-button" onClick={closeForm} type="button">Cancel</button>
                        </form>
                    </div>
                </div>
            }
            {
                filteredVehicles.length === 0 ?
                <p>No vehicles found</p> :
                <div>
                    {filteredVehicles.map((vehicle) => (
                        <VehicleCard
                            key={vehicle.id}
                            vehicle={vehicle}
                            ownerName={ownerName(vehicle)}
                            jobCount={jobs.filter((j) => j.vehicleId === vehicle.id).length}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            }
        </div>
    )
}

export default Vehicles
