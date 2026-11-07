import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router"
import { useData } from "../data/useData"
import type { Job } from "../types/job"
import { formatDate, formatMoney, todayISO } from "../utils/date"
import { isOpen, itemsLabel } from "../utils/jobs"
import WeekView from "./WeekView"
import { EmptyState, Flash, PageHeader, SearchBox, StatusBadge } from "./ui"

type View = "open" | "finished" | "all"

const VIEWS: { id: View, label: string }[] = [
    { id: "open", label: "Open" },
    { id: "finished", label: "Finished" },
    { id: "all", label: "All" },
]


function Jobs() {
    const { jobs, customers, vehicles, loadDemoData } = useData()
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const layout = searchParams.get("view") === "week" ? "week" : "list"
    const [view, setView] = useState<View>("open")
    const [search, setSearch] = useState("")

    const today = todayISO()
    const term = search.toLowerCase().trim()

    const customerName = (job: Job) => customers.find((c) => c.id === job.customerId)?.name ?? "Unknown customer"
    const vehicleFor = (job: Job) => vehicles.find((v) => v.id === job.vehicleId)
    const serviceName = (job: Job) => itemsLabel(job.items)

    const visibleJobs = jobs
        .filter((job) => view === "all" || (view === "open" ? isOpen(job) : !isOpen(job)))
        .filter((job) => {
            if (!term) return true
            const vehicle = vehicleFor(job)
            const text = `${customerName(job)} ${serviceName(job)} ${vehicle?.rego ?? ""} ${vehicle?.make ?? ""} ${vehicle?.model ?? ""}`
            return text.toLowerCase().includes(term)
        })
        .sort((a, b) => {
            const order = `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)
            return view === "open" ? order : -order
        })

    const todayCount = jobs.filter((j) => j.date === today && isOpen(j)).length
    const openCount = jobs.filter(isOpen).length

    if (customers.length === 0) {
        return (
            <div>
                <PageHeader title="Jobs" />
                <div className="card">
                    <EmptyState title="No customers yet">
                        Add your first customer, then their vehicle, then book a job.
                        <div className="toolbar">
                            <Link className="btn btn-primary" to="/customers/new">Add customer</Link>
                            <button className="btn btn-ghost" onClick={loadDemoData}>Load sample data</button>
                        </div>
                    </EmptyState>
                </div>
            </div>
        )
    }

    return (
        <div>
            <Flash />
            <PageHeader
                title="Jobs"
                subtitle={`${todayCount} today · ${openCount} open`}
            >
                {layout === "list" && <SearchBox value={search} onChange={setSearch} placeholder="Search customer, rego or service" />}
                <div className="switch" role="group" aria-label="Show as">
                    <button aria-pressed={layout === "list"} onClick={() => setSearchParams({}, { replace: true })}>List</button>
                    <button aria-pressed={layout === "week"} onClick={() => setSearchParams({ view: "week" }, { replace: true })}>Week</button>
                </div>
            </PageHeader>

            {layout === "week" ? <WeekView /> :

            <div className="section">
                <div className="tabs" role="tablist" aria-label="Show jobs">
                    {VIEWS.map((option) => (
                        <button
                            key={option.id}
                            role="tab"
                            aria-selected={view === option.id}
                            onClick={() => setView(option.id)}
                        >{option.label}</button>
                    ))}
                </div>

                <div className="card">
                    {visibleJobs.length === 0 ?
                        <EmptyState title={term ? "No jobs match that search" : view === "open" ? "No open jobs" : "No jobs here yet"}>
                            {term ? "Try a name, rego or service." : <span>Use <Link to="/jobs/new">New job</Link> to book one.</span>}
                        </EmptyState> :
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>When</th>
                                    <th>Customer</th>
                                    <th>Vehicle</th>
                                    <th>Services</th>
                                    <th>Status</th>
                                    <th className="num">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibleJobs.map((job) => {
                                    const vehicle = vehicleFor(job)
                                    return (
                                        <tr key={job.id} className="clickable" onClick={() => navigate(`/jobs/${job.id}`)}>
                                            <td className="lead">
                                                <Link className="main tnum" to={`/jobs/${job.id}`} onClick={(event) => event.stopPropagation()}>
                                                    {job.date === today ? "Today" : formatDate(job.date)}
                                                </Link>
                                                <span className="cell-sub tnum"> · {job.time}</span>
                                            </td>
                                            <td data-label="Customer">{customerName(job)}</td>
                                            <td data-label="Vehicle">
                                                {vehicle ? <span><span className="plate">{vehicle.rego}</span> <span className="cell-sub">{vehicle.make} {vehicle.model}</span></span> : "Unknown vehicle"}
                                            </td>
                                            <td data-label="Services">{serviceName(job)}</td>
                                            <td data-label="Status"><StatusBadge status={job.status} /></td>
                                            <td data-label="Total" className="num">{formatMoney(job.price)}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    }
                </div>
            </div>
            }
        </div>
    )
}

export default Jobs
