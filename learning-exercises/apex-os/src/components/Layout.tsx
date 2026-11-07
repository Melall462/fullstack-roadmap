import { Outlet, NavLink } from "react-router"

function Layout() {
    return(
        <div className="app-layout">
            <aside className="sidebar">
                <h2>ApexOS</h2>
                <NavLink 
                    to={"/dashboard"}
                    className={({isActive}) => isActive ? "active" : ""}
                >Dashboard</NavLink>
                <NavLink 
                    to={"/customers"}
                    className={({isActive}) => isActive ? "active" : ""}    
                >Customers</NavLink>
                <NavLink 
                    to={"/vehicles"}
                    className={({isActive}) => isActive ? "active" : ""}    
                >Vehicles</NavLink>
            </aside>
            <main className="main-content">
                <Outlet />
            </main>
        </div>
        )
}

export default Layout