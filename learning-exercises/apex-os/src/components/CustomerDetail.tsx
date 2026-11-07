import { Link, useNavigate, useParams } from "react-router"
import { useData } from "../data/useData"
import { formatDate, formatMoney } from "../utils/date"
import { EmptyState, Flash, PageHeader, StatusBadge } from "./ui"

function CustomerDetail() {
    const { customers, vehicles, jobs, services, deleteCustomer } = useData()
    const navigate = useNavigate()
    const params = useParams()
    const customer = customers.find((c) => c.id === Number(params["id"]))

    if (!customer) {
        return (
            <div>
                <PageHeader title="Customer not found" back={{ to: "/customers", label: "Customers" }} />
            </div>
        )
    }

    const owned = vehicles.filter((v) => v.customerId === customer.id)
    const customerJobs = jobs
        .filter((j) => j.customerId === customer.id)
        .sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`))
    const firstName = customer.name.split(" ")[0] ?? customer.name

    function handleDelete() {
        if (!customer) return
        const detail = owned.length + customerJobs.length > 0
            ? ` This also deletes ${owned.length} vehicle(s) and ${customerJobs.length} job(s).`
            : ""
        if (!window.confirm(`Delete ${customer.name}?${detail}`)) return
        deleteCustomer(customer.id)
        navigate("/customers", { state: { flash: "Customer deleted." } })
    }

    return (
        <div>
            <Flash />
            <PageHeader title={customer.name} subtitle={<a href={`mailto:${customer.email}`}>{customer.email}</a>} back={{ to: "/customers", label: "Customers" }}>
                <Link className="btn" to={`/customers/${customer.id}/edit`}>Edit</Link>
                {owned.length > 0 && <Link className="btn btn-primary" to={`/jobs/new?customer=${customer.id}`}>New job</Link>}
            </PageHeader>

            <section className="section">
                <div className="section-head">
                    <h2>Vehicles</h2>
                    <Link className={owned.length === 0 ? "btn btn-primary" : "btn"} to={`/vehicles/new?customer=${customer.id}`}>Add vehicle</Link>
                </div>
                <div className="card">
                    {owned.length === 0 ?
                        <EmptyState title={`No vehicles yet. Add one for ${firstName}.`} /> :
                        <table className="table">
                            <thead><tr><th>Rego</th><th>Vehicle</th><th>Colour</th><th>Last detail</th></tr></thead>
                            <tbody>
                                {owned.map((v) => (
                                    <tr key={v.id} className="clickable" onClick={() => navigate(`/vehicles/${v.id}`)}>
                                        <td className="lead"><Link to={`/vehicles/${v.id}`} onClick={(e) => e.stopPropagation()}><span className="plate">{v.rego}</span></Link></td>
                                        <td data-label="Vehicle">{v.year} {v.make} {v.model}</td>
                                        <td data-label="Colour" className="cell-sub">{v.color || "Not set"}</td>
                                        <td data-label="Last detail" className="cell-sub tnum">{v.lastDetail ? formatDate(v.lastDetail) : "Never"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    }
                </div>
            </section>

            <section className="section">
                <h2>Jobs</h2>
                <div className="card">
                    {customerJobs.length === 0 ?
                        <EmptyState title={owned.length === 0 ? "Add a vehicle first, then book a job." : `No jobs yet for ${firstName}.`} /> :
                        <table className="table">
                            <thead><tr><th>When</th><th>Vehicle</th><th>Service</th><th>Status</th><th className="num">Total</th></tr></thead>
                            <tbody>
                                {customerJobs.map((job) => (
                                    <tr key={job.id} className="clickable" onClick={() => navigate(`/jobs/${job.id}`)}>
                                        <td className="lead"><Link className="main tnum" to={`/jobs/${job.id}`} onClick={(e) => e.stopPropagation()}>{formatDate(job.date)}</Link></td>
                                        <td data-label="Vehicle"><span className="plate">{vehicles.find((v) => v.id === job.vehicleId)?.rego ?? "?"}</span></td>
                                        <td data-label="Service">{services.find((s) => s.id === job.serviceId)?.name ?? "Service removed"}</td>
                                        <td data-label="Status"><StatusBadge status={job.status} /></td>
                                        <td data-label="Total" className="num">{formatMoney(job.price)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    }
                </div>
            </section>

            <section className="section">
                <div><button className="btn-link danger" onClick={handleDelete}>Delete customer</button></div>
            </section>
        </div>
    )
}

export default CustomerDetail
