import { useState, useEffect } from "react";
import CustomerList from "./CustomerList";
import AddCustomerForm from "./AddCustomerForm";
import SearchCustomers from "./SearchCustomers";
import GetBusinessName from "./localStorage";

function Dashboard() {
    const initialCustomers = [
        { id: 1, name: "John", email: "john@example.com" },
        { id: 2, name: "Sarah", email: "sarah@example.com" },
        { id: 3, name: "Mike", email: "mike@example.com" },
    ];
    const [customers, setCustomers] = useState(() => {
        const savedCustomers = localStorage.getItem("customers")

        return savedCustomers ?
        JSON.parse(savedCustomers) :
        initialCustomers
    })

    useEffect(() => {
        localStorage.setItem("customers", JSON.stringify(customers));
    }, [customers]);

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
        ))
    }

    function editCustomer(updatedCustomer) {
        setCustomers((previousCustomers) =>
            previousCustomers.map((customer) =>
                customer.id === updatedCustomer.id
                    ? updatedCustomer
                    : customer
            )
        );
    }

    return (
        <div className="dashboard">
            <GetBusinessName/>
            <h1>Customers</h1>
            <AddCustomerForm onAddCustomer={addCustomer} />
            <SearchCustomers searchTerm={searchTerm} onSearchChange={setSearchTerm}/>
            <CustomerList customers={filteredCustomers} onDeleteCustomer={deleteCustomer} onEditCustomer={editCustomer}/>
        </div>
    );
}

export default Dashboard;