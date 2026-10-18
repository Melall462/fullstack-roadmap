import { useState } from "react"

function CustomerManager () {
    const initialCustomers = [
        { id: 1, name: "Alex" },
        { id: 2, name: "Jordan" },
        { id: 3, name: "Sam" }
    ]

    const [customerName, setCustomerName] = useState("")
    const [customers, setCustomers] = useState(initialCustomers)
    const [editingId, setEditingId] = useState(null)
    const [editedName, setEditedName] = useState("")

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

    function saveCustomer() {
        if (editedName.trim() !== "") {
            const updatedCustomers = customers.map((customer) => {
                if (customer.id === editingId) {
                    return {
                        ...customer,
                        name: editedName.trim()
                    }
                }

                return customer
            })

            setCustomers(updatedCustomers)
            setEditingId(null)
        }
    }
    
    return (
        <div>
            <input value={customerName} placeholder="Customer Name" onChange={(event) => setCustomerName(event.target.value)}></input>
            <button onClick={updateCustomers}>Add Customer</button>

            <div>
                {customers.map((customer) => (
                    <div key={customer.id}>
                        {customer.id === editingId ? (
                            <div>
                                <input value={editedName} placeholder="Edit Name" onChange={(event) => setEditedName(event.target.value)}></input>
                                <button onClick={saveCustomer}>Save</button>
                                <button onClick={() => {setEditingId(null), setEditedName("")}}>Cancel</button>
                            </div>    
                        ) : (
                            <div>
                                <div>{customer.name}</div>
                                <button onClick={() => (deleteCustomer(customer))}>x</button>
                                <button onClick={() => {
                                    setEditedName(customer.name)
                                    setEditingId(customer.id)
                                }}>Edit</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CustomerManager