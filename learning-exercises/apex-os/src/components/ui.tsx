import type { ReactNode } from "react"
import { Link, useLocation } from "react-router"
import type { JobStatus } from "../types/job"
import Icon from "./Icon"

export const STATUS_LABELS: Record<JobStatus, string> = {
    "booked": "Booked",
    "in-progress": "In progress",
    "done": "Done",
    "paid": "Paid",
}

export function StatusBadge({ status }: { status: JobStatus }) {
    return <span className={`badge status-${status}`}>{STATUS_LABELS[status]}</span>
}

// A short confirmation passed between pages with navigate(path, { state: { flash } }).
export function Flash() {
    const location = useLocation()
    const state = location.state as { flash?: string } | null
    if (!state?.flash) return null
    return (
        <div className="flash" role="status">
            <Icon name="check" size={16} /> {state.flash}
        </div>
    )
}

type PageHeaderProps = {
    title: ReactNode,
    subtitle?: ReactNode,
    back?: { to: string, label: string },
    children?: ReactNode,
}

export function PageHeader({ title, subtitle, back, children }: PageHeaderProps) {
    return (
        <>
            {back && <Link className="back" to={back.to}><Icon name="back" size={16} /> {back.label}</Link>}
            <div className="page-header">
                <div>
                    <h1>{title}</h1>
                    {subtitle && <p>{subtitle}</p>}
                </div>
                {children && <div className="toolbar">{children}</div>}
            </div>
        </>
    )
}

export function SearchBox({ value, onChange, placeholder }: { value: string, onChange: (value: string) => void, placeholder: string }) {
    return (
        <div className="search">
            <Icon name="search" />
            <input type="search" placeholder={placeholder} aria-label={placeholder} value={value} onChange={(event) => onChange(event.target.value)} />
        </div>
    )
}

export function EmptyState({ title, children }: { title: string, children?: ReactNode }) {
    return (
        <div className="empty">
            <strong>{title}</strong>
            {children}
        </div>
    )
}

const STEPS = ["Customer", "Vehicle", "Job"] as const

// The add customer → vehicle → job flow.
export function Steps({ current }: { current: 1 | 2 | 3 }) {
    return (
        <ol className="steps" aria-label="Steps">
            {STEPS.map((label, index) => {
                const step = index + 1
                const state = step === current ? "current" : step < current ? "complete" : ""
                return (
                    <li key={label} className={state} aria-current={step === current ? "step" : undefined}>
                        <span className="dot">{step < current ? <Icon name="check" size={14} /> : step}</span>
                        {label}
                    </li>
                )
            })}
        </ol>
    )
}
