import { useState } from "react";
import { useData } from "../data/useData";
import CustomerList from "./CustomerList";
import AddCustomerForm from "./AddCustomerForm";
import SearchCustomers from "./SearchCustomers";
import "./Customers.css"

function Customers() {
    const { customers, vehicles, jobs, addCustomer, updateCustomer, deleteCustomer } = useData()

    const [searchTerm, setSearchTerm] = useState("")
    const [isFormOpen, setIsFormOpen] = useState(false)

    const normalizedSearch = searchTerm.toLowerCase().trim()

    const filteredCustomers = customers.filter((customer) => (
        customer.name.toLowerCase().includes(normalizedSearch) ||
        customer.email.toLowerCase().includes(normalizedSearch)
    ))

    function handleDeleteCustomer(customerId: number) {
        const vehicleCount = vehicles.filter((v) => v.customerId === customerId).length
        const jobCount = jobs.filter((j) => j.customerId === customerId).length
        if (vehicleCount + jobCount > 0 &&
            !window.confirm(`This will also delete ${vehicleCount} vehicle(s) and ${jobCount} job(s). Continue?`)) {
            return
        }
        deleteCustomer(customerId)
    }

    return(
        <div className="customers">
            <h1>Customers</h1>
            {!isFormOpen && <button className="add-customer-button" onClick={() => setIsFormOpen(true)}>Add Customer</button>}
            {isFormOpen &&
                <div className="modal-overlay" onClick={() => setIsFormOpen(false)}>
                    <div className="modal-panel" onClick={(event) => event.stopPropagation()}>
                        <AddCustomerForm onAddCustomer={(name: string, email: string) => {
                            addCustomer(name, email)
                            setIsFormOpen(false)
                        }} onClose={() => setIsFormOpen(false)} />
                    </div>
                </div>
            }
            <SearchCustomers searchTerm={searchTerm} onSearchChange={setSearchTerm}/>
            <CustomerList customers={filteredCustomers} vehicles={vehicles} jobs={jobs} onDeleteCustomer={handleDeleteCustomer} onEditCustomer={updateCustomer}/>
        </div>
    )
}

export default Customers