import { useState } from "react"
import type React from "react"
import { Link, useNavigate, useParams, useSearchParams } from "react-router"
import { useData } from "../data/useData"
import { EmptyState, Flash, PageHeader, Steps } from "./ui"

type Fields = { make: string, model: string, year: string, rego: string, color: string, notes: string }
type Errors = Partial<Record<keyof Fields | "owner", string>>

function tidy(value: string): string {
    const trimmed = value.trim()
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
}

// Add a vehicle (step 2 of the flow) or edit an existing one.
function VehicleForm() {
    const { customers, vehicles, addVehicle, updateVehicle } = useData()
    const navigate = useNavigate()
    const params = useParams()
    const [searchParams] = useSearchParams()

    const isEdit = params["id"] !== undefined
    const existing = isEdit ? vehicles.find((v) => v.id === Number(params["id"])) : undefined
    const presetOwner = customers.find((c) => c.id === Number(searchParams.get("customer")))

    const [ownerId, setOwnerId] = useState(existing ? String(existing.customerId ?? "") : presetOwner ? String(presetOwner.id) : "")
    const [changingOwner, setChangingOwner] = useState(!presetOwner && !existing)
    const [fields, setFields] = useState<Fields>({
        make: existing?.make ?? "",
        model: existing?.model ?? "",
        year: existing?.year ?? "",
        rego: existing?.rego ?? "",
        color: existing?.color ?? "",
        notes: existing?.notes ?? "",
    })
    const [errors, setErrors] = useState<Errors>({})

    if (isEdit && !existing) {
        return <div className="card"><EmptyState title="Vehicle not found" /></div>
    }

    const owner = customers.find((c) => String(c.id) === ownerId)
    const set = (key: keyof Fields) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setFields((previous) => ({ ...previous, [key]: event.target.value }))

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const rego = fields.rego.trim().toUpperCase().replace(/\s+/g, "")
        const next: Errors = {}
        if (!owner && !existing) next.owner = "Choose who owns this vehicle."
        if (rego === "") next.rego = "Enter the rego."
        else if (vehicles.some((v) => v.rego === rego && v.id !== existing?.id)) next.rego = "That rego is already on file."
        if (fields.make.trim() === "") next.make = "Enter the make."
        if (fields.model.trim() === "") next.model = "Enter the model."
        if (!/^\d{4}$/.test(fields.year.trim())) next.year = "Enter a 4-digit year."
        setErrors(next)
        if (Object.keys(next).length > 0) return

        const details = {
            make: tidy(fields.make),
            model: tidy(fields.model),
            year: fields.year.trim(),
            rego,
            color: tidy(fields.color),
            customerId: owner ? owner.id : null,
            notes: fields.notes.trim(),
        }

        if (existing) {
            updateVehicle({ ...existing, ...details })
            navigate(`/vehicles/${existing.id}`, { state: { flash: "Vehicle saved." } })
        } else {
            const id = addVehicle({ ...details, lastDetail: "" })
            navigate(`/jobs/new?vehicle=${id}`, { state: { flash: "Vehicle added." } })
        }
    }

    if (!existing && customers.length === 0) {
        return (
            <div className="narrow">
                <PageHeader title="Add vehicle" back={{ to: "/vehicles", label: "Vehicles" }} />
                <div className="card">
                    <EmptyState title="Every vehicle needs an owner">
                        Add the customer first.
                        <div className="toolbar"><Link className="btn btn-primary" to="/customers/new">Add customer</Link></div>
                    </EmptyState>
                </div>
            </div>
        )
    }

    const title = existing ? "Edit vehicle" : owner && !changingOwner ? `Add a vehicle for ${owner.name}` : "Add vehicle"

    return (
        <div className="narrow">
            <Flash />
            <PageHeader
                title={title}
                back={existing ? { to: `/vehicles/${existing.id}`, label: existing.rego } : owner ? { to: `/customers/${owner.id}`, label: owner.name } : { to: "/vehicles", label: "Vehicles" }}
            />
            {!existing && <Steps current={2} />}

            <form className="card card-pad form" onSubmit={handleSubmit} noValidate>
                {owner && !changingOwner ?
                    <div className="picked">
                        <div><div className="label">Owner</div><strong>{owner.name}</strong></div>
                        <button className="btn-link" type="button" onClick={() => setChangingOwner(true)}>Change</button>
                    </div> :
                    <label className="field">
                        <span>Owner</span>
                        <select value={ownerId} aria-invalid={errors.owner ? true : undefined} onChange={(event) => setOwnerId(event.target.value)}>
                            <option value="">{existing ? "No owner" : "Choose a customer"}</option>
                            {[...customers].sort((a, b) => a.name.localeCompare(b.name)).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        {errors.owner ?
                            <span className="field-error">{errors.owner}</span> :
                            !existing && <span className="hint">Not on the list? <Link to="/customers/new">Add customer</Link></span>}
                    </label>
                }

                <label className="field">
                    <span>Rego</span>
                    <input autoFocus value={fields.rego} placeholder="ABC123" autoCapitalize="characters"
                        style={{ textTransform: "uppercase" }} aria-invalid={errors.rego ? true : undefined} onChange={set("rego")} />
                    {errors.rego && <span className="field-error">{errors.rego}</span>}
                </label>

                <div className="form-row">
                    <label className="field">
                        <span>Make</span>
                        <input value={fields.make} placeholder="Toyota" aria-invalid={errors.make ? true : undefined} onChange={set("make")} />
                        {errors.make && <span className="field-error">{errors.make}</span>}
                    </label>
                    <label className="field">
                        <span>Model</span>
                        <input value={fields.model} placeholder="Corolla" aria-invalid={errors.model ? true : undefined} onChange={set("model")} />
                        {errors.model && <span className="field-error">{errors.model}</span>}
                    </label>
                </div>

                <div className="form-row">
                    <label className="field">
                        <span>Year</span>
                        <input value={fields.year} placeholder="2020" inputMode="numeric" className="tnum" aria-invalid={errors.year ? true : undefined} onChange={set("year")} />
                        {errors.year && <span className="field-error">{errors.year}</span>}
                    </label>
                    <label className="field">
                        <span>Colour <span className="hint">(optional)</span></span>
                        <input value={fields.color} placeholder="White" onChange={set("color")} />
                    </label>
                </div>

                <label className="field">
                    <span>Notes <span className="hint">(optional)</span></span>
                    <textarea value={fields.notes} placeholder="Anything to remember for next time" onChange={set("notes")} />
                </label>

                <div className="form-actions">
                    {!existing && owner && <Link className="left small" to={`/customers/${owner.id}`}>Skip for now</Link>}
                    <button className="btn btn-ghost" type="button" onClick={() => navigate(-1)}>Cancel</button>
                    <button className="btn btn-primary" type="submit">{existing ? "Save" : "Save and create job"}</button>
                </div>
            </form>
        </div>
    )
}

export default VehicleForm
