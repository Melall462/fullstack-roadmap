import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { useData } from "../data/useData"
import { formatDate } from "../utils/date"
import { EmptyState, Flash, PageHeader, SearchBox } from "./ui"

function Vehicles() {
    const { vehicles, customers, jobs } = useData()
    const navigate = useNavigate()
    const [search, setSearch] = useState("")

    const term = search.toLowerCase().trim()
    const ownerName = (customerId: number | null) => customers.find((c) => c.id === customerId)?.name ?? ""

    const filtered = vehicles
        .filter((v) => `${v.rego} ${v.make} ${v.model} ${ownerName(v.customerId)}`.toLowerCase().includes(term))
        .sort((a, b) => a.rego.localeCompare(b.rego))

    return (
        <div>
            <Flash />
            <PageHeader title="Vehicles" subtitle={`${vehicles.length} vehicle${vehicles.length === 1 ? "" : "s"}`}>
                <SearchBox value={search} onChange={setSearch} placeholder="Search rego, make or owner" />
                <Link className="btn btn-primary" to="/vehicles/new">Add vehicle</Link>
            </PageHeader>

            <div className="card">
                {filtered.length === 0 ?
                    <EmptyState title={term ? "No vehicles match that search" : "No vehicles yet"}>
                        {term ? "Try a rego, make or owner." : "Add a customer first, then add their vehicle."}
                    </EmptyState> :
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Rego</th>
                                <th>Vehicle</th>
                                <th>Owner</th>
                                <th>Last detail</th>
                                <th className="num">Jobs</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((vehicle) => (
                                <tr key={vehicle.id} className="clickable" onClick={() => navigate(`/vehicles/${vehicle.id}`)}>
                                    <td className="lead">
                                        <Link to={`/vehicles/${vehicle.id}`} onClick={(event) => event.stopPropagation()}><span className="plate">{vehicle.rego}</span></Link>
                                    </td>
                                    <td data-label="Vehicle">{vehicle.year} {vehicle.make} {vehicle.model}</td>
                                    <td data-label="Owner">{ownerName(vehicle.customerId) || <span className="cell-sub">No owner</span>}</td>
                                    <td data-label="Last detail" className="cell-sub tnum">{vehicle.lastDetail ? formatDate(vehicle.lastDetail) : "Never"}</td>
                                    <td data-label="Jobs" className="num">{jobs.filter((j) => j.vehicleId === vehicle.id).length}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                }
            </div>
        </div>
    )
}

export default Vehicles
