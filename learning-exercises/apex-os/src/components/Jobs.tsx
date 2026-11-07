import { useState } from "react"
import { useData } from "../data/useData"
import type { Job, JobStatus } from "../types/job"
import { JOB_STATUSES } from "../types/job"
import { todayISO } from "../utils/date"
import JobCard from "./JobCard"
import JobForm from "./JobForm"
import "./Jobs.css"

type View = "upcoming" | "past" | "all"

function Jobs() {
    const { jobs, customers, vehicles, services, addJob, updateJob, deleteJob, setJobStatus } = useData()

    const [view, setView] = useState<View>("upcoming")
    const [statusFilter, setStatusFilter] = useState<JobStatus | "all">("all")
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingJob, setEditingJob] = useState<Job | null>(null)

    const today = todayISO()

    const visibleJobs = jobs
        .filter((job) => view === "all" || (view === "upcoming" ? job.date >= today : job.date < today))
        .filter((job) => statusFilter === "all" || job.status === statusFilter)
        .sort((a, b) => {
            const order = `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)
            return view === "past" ? -order : order
        })

    function openNewJob() {
        setEditingJob(null)
        setIsFormOpen(true)
    }

    function openEditJob(job: Job) {
        setEditingJob(job)
        setIsFormOpen(true)
    }

    function closeForm() {
        setEditingJob(null)
        setIsFormOpen(false)
    }

    function handleSave(details: Omit<Job, "id">) {
        if (editingJob) {
            updateJob({ ...details, id: editingJob.id })
        } else {
            addJob(details)
        }
        closeForm()
    }

    function handleDelete(jobId: number) {
        if (window.confirm("Delete this job?")) deleteJob(jobId)
    }

    function vehicleLabel(job: Job): string {
        const vehicle = vehicles.find((v) => v.id === job.vehicleId)
        return vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model} - ${vehicle.rego}` : "Unknown vehicle"
    }

    const canCreateJob = customers.length > 0 && vehicles.length > 0 && services.length > 0

    return (
        <div>
            <h1>Jobs</h1>

            <div className="jobs-toolbar">
                <div className="segmented">
                    {(["upcoming", "past", "all"] as const).map((option) => (
                        <button
                            key={option}
                            className={view === option ? "active" : ""}
                            onClick={() => setView(option)}
                        >{option}</button>
                    ))}
                </div>
                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as JobStatus | "all")}>
                    <option value="all">All statuses</option>
                    {JOB_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <button className="btn btn-primary" onClick={openNewJob} disabled={!canCreateJob}>New Job</button>
            </div>
            {!canCreateJob && <p className="muted">Add at least one customer, vehicle and service before booking a job.</p>}

            {isFormOpen &&
                <div className="modal-overlay" onClick={closeForm}>
                    <div className="modal-panel" onClick={(event) => event.stopPropagation()}>
                        <JobForm job={editingJob} onSave={handleSave} onClose={closeForm} />
                    </div>
                </div>
            }

            {visibleJobs.length === 0 ?
                <p>No jobs to show.</p> :
                <div className="job-list">
                    {visibleJobs.map((job) => (
                        <JobCard
                            key={job.id}
                            job={job}
                            customerName={customers.find((c) => c.id === job.customerId)?.name ?? "Unknown customer"}
                            vehicleLabel={vehicleLabel(job)}
                            serviceName={services.find((s) => s.id === job.serviceId)?.name ?? "Deleted service"}
                            onStatusChange={setJobStatus}
                            onEdit={openEditJob}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            }
        </div>
    )
}

export default Jobs
