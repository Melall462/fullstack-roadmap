import { useState } from "react"
import type React from "react"
import { useData } from "../data/useData"
import { defaultSettings, type Settings as SettingsType } from "../types/settings"
import { PageHeader } from "./ui"

type Fields = Omit<SettingsType, "nextInvoiceNumber"> & { nextInvoiceNumber: string }

function Settings() {
    const { settings, updateSettings, userEmail, signOut, hasBrowserData, importFromBrowser } = useData()
    const [imported, setImported] = useState<number | null>(null)
    const [fields, setFields] = useState<Fields>({ ...settings, nextInvoiceNumber: String(settings.nextInvoiceNumber) })
    const [error, setError] = useState("")
    const [saved, setSaved] = useState(false)

    const set = (key: keyof Fields) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFields((previous) => ({ ...previous, [key]: event.target.value }))
        setSaved(false)
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const next = Number(fields.nextInvoiceNumber)
        if (fields.businessName.trim() === "") return setError("Enter your business name.")
        if (!Number.isInteger(next) || next < 1) return setError("The next invoice number must be a whole number, like 1001.")
        setError("")
        updateSettings({
            businessName: fields.businessName.trim(),
            phone: fields.phone.trim(),
            email: fields.email.trim(),
            address: fields.address.trim(),
            gstNumber: fields.gstNumber.trim(),
            paymentDetails: fields.paymentDetails.trim(),
            reminderMessage: fields.reminderMessage.trim() || defaultSettings.reminderMessage,
            nextInvoiceNumber: next,
        })
        setSaved(true)
    }

    return (
        <div className="narrow">
            <PageHeader title="Settings" subtitle="Your business details. These show on invoices and reminders." />
            {saved && <div className="flash" role="status">Settings saved.</div>}

            <form className="form" onSubmit={handleSubmit} noValidate>
                <section className="card card-pad form">
                    <h2>Business</h2>
                    <label className="field">
                        <span>Business name</span>
                        <input value={fields.businessName} onChange={set("businessName")} />
                    </label>
                    <div className="form-row">
                        <label className="field">
                            <span>Phone <span className="hint">(optional)</span></span>
                            <input type="tel" value={fields.phone} placeholder="021 555 0123" onChange={set("phone")} />
                        </label>
                        <label className="field">
                            <span>Email <span className="hint">(optional)</span></span>
                            <input type="email" value={fields.email} placeholder="hello@yourbusiness.co.nz" onChange={set("email")} />
                        </label>
                    </div>
                    <label className="field">
                        <span>Address <span className="hint">(optional)</span></span>
                        <textarea value={fields.address} rows={3} placeholder={"12 Example Street\nAuckland 1010"} onChange={set("address")} />
                    </label>
                </section>

                <section className="card card-pad form">
                    <h2>Invoices</h2>
                    <div className="form-row">
                        <label className="field">
                            <span>GST number <span className="hint">(optional)</span></span>
                            <input value={fields.gstNumber} placeholder="123-456-789" onChange={set("gstNumber")} />
                            <span className="hint">If you add one, invoices become tax invoices and show the GST included.</span>
                        </label>
                        <label className="field">
                            <span>Next invoice number</span>
                            <input className="tnum" inputMode="numeric" value={fields.nextInvoiceNumber} onChange={set("nextInvoiceNumber")} />
                        </label>
                    </div>
                    <label className="field">
                        <span>How to pay <span className="hint">(optional)</span></span>
                        <textarea value={fields.paymentDetails} rows={3} placeholder={"Bank transfer to 12-3456-7890123-00\nApex Mobile Detailing"} onChange={set("paymentDetails")} />
                    </label>
                </section>

                <section className="card card-pad form">
                    <h2>Reminder message</h2>
                    <label className="field">
                        <span>Message</span>
                        <textarea value={fields.reminderMessage} rows={7} onChange={set("reminderMessage")} />
                        <span className="hint">
                            These fill in for each customer: {"{first name}"}, {"{name}"}, {"{vehicle}"}, {"{rego}"}, {"{months}"}, {"{business}"}.
                        </span>
                    </label>
                </section>

                {error && <span className="field-error">{error}</span>}
                <div className="form-actions">
                    <button className="btn btn-primary" type="submit">Save</button>
                </div>
            </form>

            {hasBrowserData &&
                <section className="card card-pad form" style={{ marginTop: 24 }}>
                    <h2>Data in this browser</h2>
                    <p className="secondary small">
                        This browser still has customers and jobs saved by the old version of ApexOS.
                        Importing adds them to your account. Nothing in the browser is deleted.
                    </p>
                    {imported !== null && <div className="flash" role="status">Imported {imported} records.</div>}
                    <div><button className="btn" type="button" onClick={() => setImported(importFromBrowser())}>Import from this browser</button></div>
                </section>
            }

            <section className="card card-pad form" style={{ marginTop: 24 }}>
                <h2>Account</h2>
                <p>Signed in as <strong>{userEmail}</strong></p>
                <div><button className="btn" type="button" onClick={signOut}>Sign out</button></div>
            </section>
        </div>
    )
}

export default Settings
