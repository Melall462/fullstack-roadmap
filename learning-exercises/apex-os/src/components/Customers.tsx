import { useState, useEffect } from "react";
import CustomerList from "./CustomerList";
import AddCustomerForm from "./AddCustomerForm";
import SearchCustomers from "./SearchCustomers";
import "./Customers.css"

type Customer = {
    id: number,
    name: string,
    email: string
}

const initialCustomers = [
    { id: 1, name: "John", email: "john@example.com" },
    { id: 2, name: "Sarah", email: "sarah@example.com" },
    { id: 3, name: "Mike", email: "mike@example.com" },
];

function Customers() {
    const [customers, setCustomers] = useState<Customer[]>(() => {
        const savedCustomers = localStorage.getItem("customers")

        return savedCustomers ?
        JSON.parse(savedCustomers) :
        initialCustomers
    })

    useEffect(() => {
        localStorage.setItem("customers", JSON.stringify(customers));
    }, [customers]);

    const [searchTerm, setSearchTerm] = useState("")
    const [isFormOpen, setIsFormOpen] = useState(false)

    const filteredCustomers = customers.filter((customer) => (
        customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    ))

    function addCustomer(name: string, email: string) {
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

    function deleteCustomer(customerId: number) {
        setCustomers((previousCustomers) => 
        previousCustomers.filter(
            (customer) => customer.id !== customerId
        ))
    }

    function editCustomer(updatedCustomer: Customer) {
        setCustomers((previousCustomers) =>
            previousCustomers.map((customer) =>
                customer.id === updatedCustomer.id
                    ? updatedCustomer
                    : customer
            )
        );
    }

    return(
        <div className="customers">
            <h1>Customers</h1>
            {!isFormOpen && <button className="add-customer-button" onClick={() => setIsFormOpen(true)}>Add Customer</button>}
            {isFormOpen &&
                <div className="add-customer-popup" onClick={() => setIsFormOpen(false)}>
                    <div className="modal-panel" onClick={(event) => event.stopPropagation()}>
                        <AddCustomerForm onAddCustomer={(name: string, email: string) => (addCustomer(name, email), setIsFormOpen(false))} onClose={() => setIsFormOpen(false)} />
                    </div>
                </div>
            }
            <SearchCustomers searchTerm={searchTerm} onSearchChange={setSearchTerm}/>
            <CustomerList customers={filteredCustomers} onDeleteCustomer={deleteCustomer} onEditCustomer={editCustomer}/>
        </div>
    )
}

export default Customers