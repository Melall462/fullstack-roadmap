import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { useData } from "../data/useData"
import { formatDate, todayISO } from "../utils/date"
import { EmptyState, Flash, PageHeader, SearchBox } from "./ui"

function Customers() {
    const { customers, vehicles, jobs } = useData()
    const navigate = useNavigate()
    const [search, setSearch] = useState("")

    const term = search.toLowerCase().trim()
    const today = todayISO()

    const filtered = customers
        .filter((c) => `${c.name} ${c.email} ${c.phone}`.toLowerCase().includes(term) ||
            (term.replace(/\D/g, "") !== "" && c.phone.replace(/\D/g, "").includes(term.replace(/\D/g, ""))))
        .sort((a, b) => a.name.localeCompare(b.name))

    return (
        <div>
            <Flash />
            <PageHeader title="Customers" subtitle={`${customers.length} customer${customers.length === 1 ? "" : "s"}`}>
                <SearchBox value={search} onChange={setSearch} placeholder="Search name, phone or email" />
                <Link className="btn btn-primary" to="/customers/new">Add customer</Link>
            </PageHeader>

            <div className="card">
                {filtered.length === 0 ?
                    <EmptyState title={term ? "No customers match that search" : "No customers yet"}>
                        {term ? "Try another name, phone or email." : "Add your first customer to get started."}
                    </EmptyState> :
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Contact</th>
                                <th>Vehicles</th>
                                <th className="num">Jobs</th>
                                <th>Last job</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((customer) => {
                                const owned = vehicles.filter((v) => v.customerId === customer.id)
                                const customerJobs = jobs.filter((j) => j.customerId === customer.id)
                                const lastJob = customerJobs.map((j) => j.date).filter((d) => d <= today).sort().at(-1)
                                return (
                                    <tr key={customer.id} className="clickable" onClick={() => navigate(`/customers/${customer.id}`)}>
                                        <td className="lead">
                                            <Link className="main" to={`/customers/${customer.id}`} onClick={(event) => event.stopPropagation()}>{customer.name}</Link>
                                        </td>
                                        <td data-label="Contact">
                                            <div className="tnum">{customer.phone}</div>
                                            <div className="cell-sub">{customer.email}</div>
                                        </td>
                                        <td data-label="Vehicles">
                                            {owned.length === 0 ? <span className="cell-sub">None</span> :
                                                owned.map((v) => <span key={v.id} className="plate" style={{ marginRight: 4 }}>{v.rego}</span>)}
                                        </td>
                                        <td data-label="Jobs" className="num">{customerJobs.length}</td>
                                        <td data-label="Last job" className="cell-sub tnum">{lastJob ? formatDate(lastJob) : "None yet"}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                }
            </div>
        </div>
    )
}

export default Customers
