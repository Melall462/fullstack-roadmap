import { Link, NavLink, Outlet, useLocation } from "react-router"
import { useData } from "../data/useData"
import Icon, { type IconName } from "./Icon"
import { UndoToast } from "./ui"

const navItems: { to: string, label: string, icon: IconName }[] = [
    { to: "/jobs", label: "Jobs", icon: "jobs" },
    { to: "/customers", label: "Customers", icon: "customers" },
    { to: "/vehicles", label: "Vehicles", icon: "vehicles" },
    { to: "/analytics", label: "Analytics", icon: "analytics" },
]

const linkClass = ({ isActive }: { isActive: boolean }) => isActive ? "nav-link active" : "nav-link"

function Layout() {
    const { settings } = useData()
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
                    <NavLink to="/settings" className={linkClass}><Icon name="settings" /> Settings</NavLink>
                    <div className="business-name">{settings.businessName}</div>
                </div>
            </aside>

            <header className="topbar">
                <Link className="brand" to="/jobs">
                    <span className="brand-mark" aria-hidden="true">A</span>
                    <span className="brand-name">ApexOS</span>
                </Link>
                <nav className="topbar-links" aria-label="More">
                    <NavLink to="/services" aria-label="Services"><Icon name="services" /></NavLink>
                    <NavLink to="/settings" aria-label="Settings"><Icon name="settings" /></NavLink>
                </nav>
            </header>

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

            <UndoToast />
        </div>
    )
}

export default Layout
