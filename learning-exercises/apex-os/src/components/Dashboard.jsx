import { useState } from "react";
import CustomerList from "./CustomerList";
import AddCustomerForm from "./AddCustomerForm";

function Dashboard() {
    const [customers, setCustomers] = useState([
        { id: 1, name: "John", email: "john@example.com" },
        { id: 2, name: "Sarah", email: "sarah@example.com" },
        { id: 3, name: "Mike", email: "mike@example.com" },
    ]);

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

    return (
        <div>
            <h1>Customers</h1>
            <AddCustomerForm onAddCustomer={addCustomer} />
            <CustomerList customers={customers} />
        </div>
    );
}

export default Dashboard;