import { useState } from "react"
import type React from "react"
import { useNavigate, useParams } from "react-router"
import { useData } from "../data/useData"
import { EmptyState, PageHeader, Steps } from "./ui"

// Add a customer (step 1 of the flow) or edit an existing one.
function CustomerForm() {
    const { customers, addCustomer, updateCustomer } = useData()
    const navigate = useNavigate()
    const params = useParams()
    const existing = params["id"] ? customers.find((c) => c.id === Number(params["id"])) : undefined
    const isEdit = params["id"] !== undefined

    const [name, setName] = useState(existing?.name ?? "")
    const [email, setEmail] = useState(existing?.email ?? "")
    const [phone, setPhone] = useState(existing?.phone ?? "")
    const [errors, setErrors] = useState<{ name?: string, email?: string, phone?: string }>({})

    if (isEdit && !existing) {
        return <div className="card"><EmptyState title="Customer not found" /></div>
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const next: { name?: string, email?: string, phone?: string } = {}
        if (name.trim() === "") next.name = "Enter the customer's name."
        if (email.trim() === "" && phone.trim() === "") next.phone = "Enter a phone number or an email."
        else if (email.trim() !== "" && !/^\S+@\S+\.\S+$/.test(email.trim())) next.email = "Enter an email like sam@example.com."
        else if (phone.trim() !== "" && !/^[+\d][\d\s()-]{5,}$/.test(phone.trim())) next.phone = "Enter a phone number like 021 555 0123."
        setErrors(next)
        if (next.name || next.email || next.phone) return

        const details = { name: name.trim(), email: email.trim(), phone: phone.trim() }
        if (existing) {
            updateCustomer({ ...existing, ...details })
            navigate(`/customers/${existing.id}`, { state: { flash: "Customer saved." } })
        } else {
            const id = addCustomer(details)
            navigate(`/vehicles/new?customer=${id}`, { state: { flash: "Customer added." } })
        }
    }

    return (
        <div className="narrow">
            {existing ?
                <PageHeader title="Edit customer" back={{ to: `/customers/${existing.id}`, label: existing.name }} /> :
                <>
                    <PageHeader title="Add customer" back={{ to: "/customers", label: "Customers" }} />
                    <Steps current={1} />
                </>
            }
            <form className="card card-pad form" onSubmit={handleSubmit} noValidate>
                <label className="field">
                    <span>Name</span>
                    <input autoFocus value={name} placeholder="Sam Wilson" aria-invalid={errors.name ? true : undefined}
                        onChange={(event) => setName(event.target.value)} />
                    {errors.name && <span className="field-error">{errors.name}</span>}
                </label>
                <label className="field">
                    <span>Phone</span>
                    <input type="tel" value={phone} placeholder="021 555 0123" autoComplete="tel" aria-invalid={errors.phone ? true : undefined}
                        onChange={(event) => setPhone(event.target.value)} />
                    {errors.phone ?
                        <span className="field-error">{errors.phone}</span> :
                        <span className="hint">A phone number, an email, or both.</span>}
                </label>
                <label className="field">
                    <span>Email</span>
                    <input type="email" value={email} placeholder="sam@example.com" aria-invalid={errors.email ? true : undefined}
                        onChange={(event) => setEmail(event.target.value)} />
                    {errors.email && <span className="field-error">{errors.email}</span>}
                </label>
                <div className="form-actions">
                    <button className="btn btn-ghost" type="button" onClick={() => navigate(-1)}>Cancel</button>
                    <button className="btn btn-primary" type="submit">{existing ? "Save" : "Save and add vehicle"}</button>
                </div>
            </form>
        </div>
    )
}

export default CustomerForm
