import { Link, useNavigate, useParams } from "react-router"
import { useData } from "../data/useData"
import { formatDate, formatMoney } from "../utils/date"
import { itemsLabel } from "../utils/jobs"
import { EmptyState, Flash, PageHeader, StatusBadge } from "./ui"

function VehicleDetail() {
    const { vehicles, customers, jobs, deleteVehicle } = useData()
    const navigate = useNavigate()
    const params = useParams()
    const vehicle = vehicles.find((v) => v.id === Number(params["id"]))

    if (!vehicle) {
        return <PageHeader title="Vehicle not found" back={{ to: "/vehicles", label: "Vehicles" }} />
    }

    const owner = customers.find((c) => c.id === vehicle.customerId)
    const history = jobs
        .filter((j) => j.vehicleId === vehicle.id)
        .sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`))

    function handleDelete() {
        if (!vehicle) return
        deleteVehicle(vehicle.id)
        navigate(owner ? `/customers/${owner.id}` : "/vehicles")
    }

    return (
        <div>
            <Flash />
            <PageHeader
                title={<><span className="plate" style={{ fontSize: 22, verticalAlign: "middle" }}>{vehicle.rego}</span> {vehicle.make} {vehicle.model}</>}
                back={owner ? { to: `/customers/${owner.id}`, label: owner.name } : { to: "/vehicles", label: "Vehicles" }}
            >
                <Link className="btn" to={`/vehicles/${vehicle.id}/edit`}>Edit</Link>
                {owner && <Link className="btn btn-primary" to={`/jobs/new?vehicle=${vehicle.id}`}>New job</Link>}
            </PageHeader>

            <div className="card card-pad">
                <dl className="facts">
                    <div><dt>Owner</dt><dd>{owner ? <Link to={`/customers/${owner.id}`}>{owner.name}</Link> : <span className="secondary">No owner</span>}</dd></div>
                    <div><dt>Year</dt><dd className="tnum">{vehicle.year}</dd></div>
                    <div><dt>Colour</dt><dd>{vehicle.color || <span className="secondary">Not set</span>}</dd></div>
                    <div><dt>Last detail</dt><dd className="tnum">{vehicle.lastDetail ? formatDate(vehicle.lastDetail) : <span className="secondary">Never</span>}</dd></div>
                </dl>
                {vehicle.notes && <p className="notice" style={{ marginTop: 16 }}>{vehicle.notes}</p>}
            </div>

            <section className="section">
                <h2>Job history</h2>
                <div className="card">
                    {history.length === 0 ?
                        <EmptyState title="No jobs for this vehicle yet." /> :
                        <table className="table">
                            <thead><tr><th>When</th><th>Services</th><th>Status</th><th className="num">Total</th></tr></thead>
                            <tbody>
                                {history.map((job) => (
                                    <tr key={job.id} className="clickable" onClick={() => navigate(`/jobs/${job.id}`)}>
                                        <td className="lead"><Link className="main tnum" to={`/jobs/${job.id}`} onClick={(e) => e.stopPropagation()}>{formatDate(job.date)}</Link></td>
                                        <td data-label="Services">{itemsLabel(job.items)}</td>
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
                <div><button className="btn-link danger" onClick={handleDelete}>Delete vehicle</button>
                    {history.length > 0 && <span className="secondary small"> (also deletes {history.length} job{history.length === 1 ? "" : "s"})</span>}</div>
            </section>
        </div>
    )
}

export default VehicleDetail
