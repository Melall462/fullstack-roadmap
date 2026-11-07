import { Link, useNavigate, useParams } from "react-router"
import { useData } from "../data/useData"
import { JOB_STATUSES } from "../types/job"
import { formatDate, formatMoney } from "../utils/date"
import { clashesWith, durationOf, endTime, formatDuration, isFinished, isOpen } from "../utils/jobs"
import Icon from "./Icon"
import { Flash, PageHeader, STATUS_LABELS, StatusBadge } from "./ui"

function JobDetail() {
    const { jobs, customers, vehicles, setJobStatus, deleteJob, createInvoice } = useData()
    const navigate = useNavigate()
    const params = useParams()
    const job = jobs.find((j) => j.id === Number(params["id"]))

    if (!job) {
        return <PageHeader title="Job not found" back={{ to: "/jobs", label: "Jobs" }} />
    }

    const customer = customers.find((c) => c.id === job.customerId)
    const vehicle = vehicles.find((v) => v.id === job.vehicleId)
    const clashes = isOpen(job) ? clashesWith(job, jobs) : []
    const title = job.items.length === 1 && job.items[0] ? job.items[0].name : `${customer?.name ?? "Job"}'s job`

    function handleDelete() {
        if (!job) return
        deleteJob(job.id)
        navigate("/jobs")
    }

    function handleInvoice() {
        if (!job) return
        createInvoice(job.id)
        navigate(`/jobs/${job.id}/invoice`)
    }

    return (
        <div className="narrow">
            <Flash />
            <PageHeader
                title={title}
                subtitle={<span className="tnum">{formatDate(job.date)}, {job.time}–{endTime(job)}</span>}
                back={{ to: "/jobs", label: "Jobs" }}
            >
                <Link className="btn" to={`/jobs/${job.id}/edit`}>Edit</Link>
                {job.invoiceNumber !== null ?
                    <Link className="btn" to={`/jobs/${job.id}/invoice`}>View invoice</Link> :
                    <button className={isFinished(job) ? "btn btn-primary" : "btn"} onClick={handleInvoice}>Create invoice</button>}
            </PageHeader>

            {clashes.length > 0 &&
                <div className="warning" role="status" style={{ marginBottom: 24 }}>
                    <Icon name="alert" size={16} />
                    <span>
                        Overlaps with {clashes.map((c, i) => (
                            <span key={c.id}>{i > 0 && ", "}<Link to={`/jobs/${c.id}`}>{customers.find((x) => x.id === c.customerId)?.name ?? "another job"} at {c.time}</Link></span>
                        ))}.
                    </span>
                </div>
            }

            <div className="card card-pad">
                <dl className="facts">
                    <div><dt>Customer</dt><dd>{customer ? <Link to={`/customers/${customer.id}`}>{customer.name}</Link> : "Unknown"}</dd></div>
                    <div>
                        <dt>Vehicle</dt>
                        <dd>{vehicle ? <Link to={`/vehicles/${vehicle.id}`}><span className="plate">{vehicle.rego}</span></Link> : "Unknown"}
                            {vehicle && <div className="secondary small">{vehicle.year} {vehicle.make} {vehicle.model}</div>}
                        </dd>
                    </div>
                    <div><dt>Status</dt><dd><StatusBadge status={job.status} /></dd></div>
                    <div><dt>Invoice</dt><dd className="tnum">{job.invoiceNumber !== null ? `#${job.invoiceNumber}` : <span className="secondary">Not created</span>}</dd></div>
                </dl>

                <table className="table items">
                    <thead><tr><th>Service</th><th className="num">Time</th><th className="num">Price</th></tr></thead>
                    <tbody>
                        {job.items.map((item) => (
                            <tr key={item.serviceId}>
                                <td className="lead">{item.name}</td>
                                <td data-label="Time" className="num">{formatDuration(item.durationMins)}</td>
                                <td data-label="Price" className="num">{formatMoney(item.price)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td><strong>Total</strong></td>
                            <td className="num secondary">{formatDuration(durationOf(job.items))}</td>
                            <td className="num"><strong>{formatMoney(job.price)}</strong></td>
                        </tr>
                    </tfoot>
                </table>

                {job.notes && <p className="notice" style={{ marginTop: 16 }}>{job.notes}</p>}
            </div>

            <section className="section">
                <h2>Update status</h2>
                <div className="tabs" role="radiogroup" aria-label="Job status">
                    {JOB_STATUSES.map((s) => (
                        <button key={s} role="radio" aria-checked={job.status === s} onClick={() => setJobStatus(job.id, s)}>
                            {STATUS_LABELS[s]}
                        </button>
                    ))}
                </div>
            </section>

            <section className="section">
                <div><button className="btn-link danger" onClick={handleDelete}>Delete job</button></div>
            </section>
        </div>
    )
}

export default JobDetail
