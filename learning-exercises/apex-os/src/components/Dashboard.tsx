import { Link } from "react-router"
import { useData } from "../data/useData"
import type { Job } from "../types/job"
import { addDays, daysSince, formatDate, formatMoney, todayISO } from "../utils/date"
import "./Dashboard.css"

const DUE_AFTER_DAYS = 60

function Dashboard() {
    const { jobs, customers, vehicles, services } = useData()

    const today = todayISO()
    const weekAhead = addDays(today, 7)
    const monthPrefix = today.slice(0, 7) // "YYYY-MM"

    const byDateTime = (a: Job, b: Job) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)

    const todaysJobs = jobs.filter((j) => j.date === today).sort(byDateTime)
    const upcomingJobs = jobs
        .filter((j) => j.date > today && j.date <= weekAhead && j.status === "booked")
        .sort(byDateTime)

    const monthJobs = jobs.filter((j) => j.date.startsWith(monthPrefix))
    const revenuePaid = monthJobs.filter((j) => j.status === "paid").reduce((sum, j) => sum + j.price, 0)
    const revenueOwed = monthJobs.filter((j) => j.status === "done").reduce((sum, j) => sum + j.price, 0)

    const dueVehicles = vehicles
        .filter((v) => !v.lastDetail || daysSince(v.lastDetail) > DUE_AFTER_DAYS)
        // Skip cars that already have a booking coming up.
        .filter((v) => !jobs.some((j) => j.vehicleId === v.id && j.date >= today && j.status === "booked"))

    function describe(job: Job): string {
        const customer = customers.find((c) => c.id === job.customerId)?.name ?? "Unknown customer"
        const service = services.find((s) => s.id === job.serviceId)?.name ?? "Deleted service"
        return `${service} — ${customer}`
    }

    return (
        <div className="dashboard">
            <h1>Dashboard</h1>

            <div className="stat-row">
                <div className="stat-tile">
                    <p className="stat-label">Jobs today</p>
                    <p className="stat-value">{todaysJobs.length}</p>
                </div>
                <div className="stat-tile">
                    <p className="stat-label">Booked next 7 days</p>
                    <p className="stat-value">{upcomingJobs.length}</p>
                </div>
                <div className="stat-tile">
                    <p className="stat-label">Paid this month</p>
                    <p className="stat-value">{formatMoney(revenuePaid)}</p>
                </div>
                <div className="stat-tile">
                    <p className="stat-label">Done, awaiting payment</p>
                    <p className="stat-value">{formatMoney(revenueOwed)}</p>
                </div>
            </div>

            <div className="dashboard-grid">
                <section className="panel">
                    <h2>Today</h2>
                    {todaysJobs.length === 0 ?
                        <p className="muted">Nothing booked today.</p> :
                        <ul className="panel-list">
                            {todaysJobs.map((job) => (
                                <li key={job.id}>
                                    <span className="when">{job.time}</span>
                                    <span>{describe(job)}</span>
                                    <span className={`badge status-${job.status}`}>{job.status}</span>
                                </li>
                            ))}
                        </ul>
                    }
                </section>

                <section className="panel">
                    <h2>Coming up</h2>
                    {upcomingJobs.length === 0 ?
                        <p className="muted">No bookings in the next 7 days.</p> :
                        <ul className="panel-list">
                            {upcomingJobs.map((job) => (
                                <li key={job.id}>
                                    <span className="when">{formatDate(job.date)} {job.time}</span>
                                    <span>{describe(job)}</span>
                                </li>
                            ))}
                        </ul>
                    }
                </section>

                <section className="panel">
                    <h2>Due for a detail</h2>
                    <p className="muted">Not detailed in {DUE_AFTER_DAYS}+ days and nothing booked.</p>
                    {dueVehicles.length === 0 ?
                        <p className="muted">All caught up.</p> :
                        <ul className="panel-list">
                            {dueVehicles.map((vehicle) => (
                                <li key={vehicle.id}>
                                    <span>{vehicle.make} {vehicle.model} - {vehicle.rego}</span>
                                    <span className="muted">
                                        {customers.find((c) => c.id === vehicle.customerId)?.name ?? "No owner"}
                                    </span>
                                    <span className="when">
                                        {vehicle.lastDetail ? `${daysSince(vehicle.lastDetail)} days` : "never"}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    }
                </section>
            </div>

            <p className="dashboard-links">
                <Link to="/jobs">Manage jobs →</Link>
            </p>
        </div>
    )
}

export default Dashboard
