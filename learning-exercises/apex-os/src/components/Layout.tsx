import { Link, NavLink, Outlet, useLocation } from "react-router"
import { useData } from "../data/useData"
import Icon, { type IconName } from "./Icon"

const navItems: { to: string, label: string, icon: IconName }[] = [
    { to: "/jobs", label: "Jobs", icon: "jobs" },
    { to: "/customers", label: "Customers", icon: "customers" },
    { to: "/vehicles", label: "Vehicles", icon: "vehicles" },
    { to: "/analytics", label: "Analytics", icon: "analytics" },
]

const linkClass = ({ isActive }: { isActive: boolean }) => isActive ? "nav-link active" : "nav-link"

function Layout() {
    const { businessName } = useData()
    const { pathname } = useLocation()
    const isNewJob = pathname === "/jobs/new"

    return (
        <div className="app-layout">
            <aside className="sidebar">
                <Link className="brand" to="/jobs">
                    <span className="brand-mark" aria-hidden="true">A</span>
                    <span className="brand-name">ApexOS</span>
                </Link>

                <Link className="btn new-job" to="/jobs/new"><Icon name="plus" /> New job</Link>

                <nav className="nav" aria-label="Main">
                    {navItems.map((item) => (
                        <NavLink key={item.to} to={item.to} className={({ isActive }) => linkClass({ isActive: isActive && !isNewJob })}>
                            <Icon name={item.icon} /> {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <NavLink to="/services" className={linkClass}><Icon name="services" /> Services</NavLink>
                    <div className="business-name">{businessName}</div>
                </div>
            </aside>

            <div className="main">
                <main className="main-content">
                    <Outlet />
                </main>
            </div>

            <nav className="tabbar" aria-label="Main">
                {navItems.map((item) => (
                    <NavLink key={item.to} to={item.to} className={({ isActive }) => isActive && !isNewJob ? "active" : ""}>
                        <Icon name={item.icon} /> {item.label}
                    </NavLink>
                ))}
                <NavLink to="/jobs/new" className={({ isActive }) => isActive ? "active" : ""}>
                    <Icon name="plus" /> New job
                </NavLink>
            </nav>
        </div>
    )
}

export default Layout
