import type { Job, JobStatus } from "../types/job"
import { JOB_STATUSES } from "../types/job"
import { formatDate, formatMoney } from "../utils/date"

type Props = {
    job: Job,
    customerName: string,
    vehicleLabel: string,
    serviceName: string,
    onStatusChange: (jobId: number, status: JobStatus) => void,
    onEdit: (job: Job) => void,
    onDelete: (jobId: number) => void
}

function JobCard({ job, customerName, vehicleLabel, serviceName, onStatusChange, onEdit, onDelete }: Props) {
    return (
        <div className={`job-card status-${job.status}`}>
            <div className="job-main">
                <p className="job-when">{formatDate(job.date)} · {job.time}</p>
                <p className="job-title">{serviceName} — {customerName}</p>
                <p className="muted">{vehicleLabel}</p>
                {job.notes && <p className="job-notes">{job.notes}</p>}
            </div>
            <div className="job-side">
                <p className="job-price">{formatMoney(job.price)}</p>
                <select
                    className="status-select"
                    value={job.status}
                    onChange={(event) => onStatusChange(job.id, event.target.value as JobStatus)}
                >
                    {JOB_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <div className="row-actions">
                    <button className="btn btn-small" onClick={() => onEdit(job)}>Edit</button>
                    <button className="btn btn-small btn-danger" onClick={() => onDelete(job.id)}>Delete</button>
                </div>
            </div>
        </div>
    )
}

export default JobCard
