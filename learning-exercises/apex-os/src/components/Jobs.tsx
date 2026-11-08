import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router"
import { useData } from "../data/useData"
import type { Job, JobStatus } from "../types/job"
import { formatDate, formatMoney, todayISO } from "../utils/date"
import { itemsLabel } from "../utils/jobs"
import WeekView from "./WeekView"
import { EmptyState, Flash, PageHeader, SearchBox, StatusBadge } from "./ui"

type View = "open" | "unpaid" | "all"

const VIEWS: { id: View, label: string }[] = [
    { id: "open", label: "Open" },
    { id: "unpaid", label: "Unpaid" },
    { id: "all", label: "All" },
]

// Open: still to do (booked or in progress). Unpaid: work done, waiting on payment.
// Paid jobs only show under All.
const isOpen = (job: Job) => job.status === "booked" || job.status === "in-progress"
const isUnpaid = (job: Job) => job.status === "done"

// For each status, what comes next and what the quick button says.
// Paid has no entry because nothing comes after it, so paid jobs get no button.
const NEXT_STEP: Partial<Record<JobStatus, { status: JobStatus, label: string }>> = {
    "booked": { status: "in-progress", label: "Mark in progress" },
    "in-progress": { status: "done", label: "Mark done" },
    "done": { status: "paid", label: "Mark paid" },
}

function Jobs() {
    const { jobs, customers, vehicles, loadDemoData, setJobStatus } = useData()
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
        .filter((job) => view === "all" || (view === "open" ? isOpen(job) : isUnpaid(job)))
        .filter((job) => {
            if (!term) return true
            const vehicle = vehicleFor(job)
            const text = `${customerName(job)} ${serviceName(job)} ${vehicle?.rego ?? ""} ${vehicle?.make ?? ""} ${vehicle?.model ?? ""}`
            return text.toLowerCase().includes(term)
        })
        .sort((a, b) => {
            const order = `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)
            // Open and Unpaid show the oldest first (next up, or waiting longest). All shows newest first.
            return view === "all" ? -order : order
        })

    const todayCount = jobs.filter((j) => j.date === today && isOpen(j)).length
    const openCount = jobs.filter(isOpen).length
    const unpaidCount = jobs.filter(isUnpaid).length

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
                subtitle={`${todayCount} today · ${openCount} open · ${unpaidCount} unpaid`}
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
                        <EmptyState title={term ? "No jobs match that search" : view === "open" ? "No open jobs" : view === "unpaid" ? "Nothing waiting on payment" : "No jobs here yet"}>
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
                                    <th>Next step</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibleJobs.map((job) => {
                                    const vehicle = vehicleFor(job)
                                    const next = NEXT_STEP[job.status]
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
                                            <td data-label="Next step">
                                                {next &&
                                                    <button className="btn" onClick={(event) => {
                                                        event.stopPropagation()
                                                        setJobStatus(job.id, next.status)
                                                    }}>{next.label}</button>
                                                }
                                            </td>
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
