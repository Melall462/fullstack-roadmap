import { useState } from "react";
import CustomerList from "./CustomerList";
import AddCustomerForm from "./AddCustomerForm";
import SearchCustomers from "./SearchCustomers";

function Dashboard() {
    const [customers, setCustomers] = useState([
        { id: 1, name: "John", email: "john@example.com" },
        { id: 2, name: "Sarah", email: "sarah@example.com" },
        { id: 3, name: "Mike", email: "mike@example.com" },
    ]);
    const [searchTerm, setSearchTerm] = useState("")

    const filteredCustomers = customers.filter((customer) => (
        customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    ))

    function addCustomer(name, email) {
        const newCustomer = {
            id: Date.now(),
            name,
            email
        };

        setCustomers((previousCustomers) => [
            ...previousCustomers,
            newCustomer
        ]);
    }

    function deleteCustomer(customerId) {
        setCustomers((previousCustomers) => 
        previousCustomers.filter(
            (customer) => customer.id !== customerId
        )
    )
    }

    return (
        <div className="dashboard">
            <h1>Customers</h1>
            <AddCustomerForm onAddCustomer={addCustomer} />
            <SearchCustomers searchTerm={searchTerm} onSearchChange={setSearchTerm}/>
            <CustomerList customers={filteredCustomers} onDeleteCustomer={deleteCustomer}/>
        </div>
    );
}

export default Dashboard;