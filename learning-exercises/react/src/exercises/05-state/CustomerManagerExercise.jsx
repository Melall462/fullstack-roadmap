import { useState } from "react"

function CustomerManager () {
    const initialCustomers = [
        { id: 1, name: "Alex" },
        { id: 2, name: "Jordan" },
        { id: 3, name: "Sam" }
    ]

    const [customerName, setCustomerName] = useState("")

    const [customers, setCustomers] = useState(initialCustomers)

    function updateCustomers() {

        if (customerName.trim() !== "") {
            const newCustomer = {
                id: Date.now(),
                name: customerName
            }

            setCustomers([...customers, newCustomer])
            setCustomerName("")
        }
    }

    function deleteCustomer(customerName) {
        const filteredCustomer = customers.filter((customer) => {
            return customer.id !== customerName.id
        })
        setCustomers(filteredCustomer)
    }
    
    return (
        <div>
            <input value={customerName} placeholder="Customer Name" onChange={(event) => setCustomerName(event.target.value)}></input>
            <button onClick={updateCustomers}>Add Customer</button>

            <div>
                {customers.map((customer) => (
                    <div key={customer.id}>
                        <div>{customer.name}</div>
                        <button onClick={() => (
                                deleteCustomer(customer)
                            )}>x</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CustomerManager