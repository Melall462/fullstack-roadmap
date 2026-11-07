import { Link, useNavigate, useParams } from "react-router"
import { useData } from "../data/useData"
import { JOB_STATUSES } from "../types/job"
import { formatDate, formatMoney } from "../utils/date"
import { Flash, PageHeader, STATUS_LABELS, StatusBadge } from "./ui"

function JobDetail() {
    const { jobs, customers, vehicles, services, setJobStatus, deleteJob } = useData()
    const navigate = useNavigate()
    const params = useParams()
    const job = jobs.find((j) => j.id === Number(params["id"]))

    if (!job) {
        return <PageHeader title="Job not found" back={{ to: "/jobs", label: "Jobs" }} />
    }

    const customer = customers.find((c) => c.id === job.customerId)
    const vehicle = vehicles.find((v) => v.id === job.vehicleId)
    const service = services.find((s) => s.id === job.serviceId)

    function handleDelete() {
        if (!job || !window.confirm("Delete this job?")) return
        deleteJob(job.id)
        navigate("/jobs", { state: { flash: "Job deleted." } })
    }

    return (
        <div className="narrow">
            <Flash />
            <PageHeader
                title={service?.name ?? "Service removed"}
                subtitle={<span className="tnum">{formatDate(job.date)} at {job.time}</span>}
                back={{ to: "/jobs", label: "Jobs" }}
            >
                <Link className="btn" to={`/jobs/${job.id}/edit`}>Edit</Link>
            </PageHeader>

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
                    <div><dt>Total</dt><dd className="tnum"><strong>{formatMoney(job.price)}</strong></dd></div>
                </dl>
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
