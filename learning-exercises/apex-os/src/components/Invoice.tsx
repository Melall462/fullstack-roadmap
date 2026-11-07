import { Link, useParams } from "react-router"
import { useData } from "../data/useData"
import { formatDate, formatMoney } from "../utils/date"
import { PageHeader } from "./ui"

// New Zealand GST is 15%, so the GST inside a GST-inclusive price is 3/23 of it.
const gstIncluded = (total: number) => Math.round(total * 3 / 23 * 100) / 100

function Invoice() {
    const { jobs, customers, vehicles, settings } = useData()
    const params = useParams()
    const job = jobs.find((j) => j.id === Number(params["id"]))

    if (!job || job.invoiceNumber === null) {
        return <PageHeader title="Invoice not found" back={job ? { to: `/jobs/${job.id}`, label: "Job" } : { to: "/jobs", label: "Jobs" }} />
    }

    const customer = customers.find((c) => c.id === job.customerId)
    const vehicle = vehicles.find((v) => v.id === job.vehicleId)
    const hasGst = settings.gstNumber.trim() !== ""
    const fromLines = [settings.address, settings.phone, settings.email].filter((line) => line.trim() !== "")

    return (
        <div className="narrow invoice-page">
            <div className="no-print">
                <PageHeader title={`Invoice #${job.invoiceNumber}`} back={{ to: `/jobs/${job.id}`, label: "Job" }}>
                    <button className="btn btn-primary" onClick={() => window.print()}>Print or save as PDF</button>
                </PageHeader>
                {fromLines.length === 0 &&
                    <p className="notice" style={{ marginBottom: 24 }}>
                        Add your address, phone and bank details in <Link to="/settings">Settings</Link> so they show on invoices.
                    </p>}
            </div>

            <article className="card invoice">
                <header className="invoice-head">
                    <div>
                        <h2>{settings.businessName}</h2>
                        {fromLines.map((line) => <div key={line} className="secondary pre">{line}</div>)}
                        {hasGst && <div className="secondary">GST number {settings.gstNumber}</div>}
                    </div>
                    <div className="invoice-meta">
                        <div className="invoice-title">{hasGst ? "Tax invoice" : "Invoice"}</div>
                        <dl>
                            <div><dt>Number</dt><dd className="tnum">{job.invoiceNumber}</dd></div>
                            <div><dt>Date</dt><dd className="tnum">{formatDate(job.invoiceDate || job.date)}</dd></div>
                        </dl>
                        {job.status === "paid" && <span className="badge status-done">Paid</span>}
                    </div>
                </header>

                <div className="invoice-parties">
                    <div>
                        <div className="label">Bill to</div>
                        <strong>{customer?.name ?? "Customer"}</strong>
                        {customer?.phone && <div className="tnum">{customer.phone}</div>}
                        {customer?.email && <div>{customer.email}</div>}
                    </div>
                    <div>
                        <div className="label">Vehicle</div>
                        {vehicle ? <><strong>{vehicle.rego}</strong><div>{vehicle.year} {vehicle.make} {vehicle.model}</div></> : "Unknown"}
                    </div>
                    <div>
                        <div className="label">Work done</div>
                        <div className="tnum">{formatDate(job.date)}</div>
                    </div>
                </div>

                <table className="table invoice-lines">
                    <thead><tr><th>Description</th><th className="num">Amount</th></tr></thead>
                    <tbody>
                        {job.items.map((item) => (
                            <tr key={item.serviceId}><td>{item.name}</td><td className="num">{formatMoney(item.price)}</td></tr>
                        ))}
                    </tbody>
                    <tfoot>
                        {hasGst && <tr><td className="secondary">Includes GST (15%)</td><td className="num secondary">{formatMoney(gstIncluded(job.price))}</td></tr>}
                        <tr className="invoice-total"><td>Total{hasGst ? " (incl. GST)" : ""}</td><td className="num">{formatMoney(job.price)}</td></tr>
                    </tfoot>
                </table>

                {job.notes && <p className="secondary">{job.notes}</p>}

                {settings.paymentDetails.trim() !== "" && job.status !== "paid" &&
                    <div className="invoice-payment">
                        <div className="label">How to pay</div>
                        <div className="pre">{settings.paymentDetails}</div>
                        <div className="secondary small">Please use {job.invoiceNumber} as the reference.</div>
                    </div>
                }
                <p className="invoice-thanks">Thank you for your business.</p>
            </article>
        </div>
    )
}

export default Invoice
