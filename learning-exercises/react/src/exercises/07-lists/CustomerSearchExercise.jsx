import { useState } from "react";
import CustomerCard from "./CustomerCard.jsx"

function CustomerSearchExercise() {
    const customers = [
        { id: 1, name: "James", phone: "0211234567" },
        { id: 2, name: "Sarah", phone: "0221234567" },
        { id: 3, name: "Mike", phone: "0271234567" }
    ];

    const [searchTerm, setSearchTerm] = useState("")
    
    const filteredCustomer = customers.filter((customer) => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div>
            <input value={searchTerm} type="text" onChange={(event) => setSearchTerm(event.target.value)}/>
            <div>
                {filteredCustomer.map((customer) => (
                    <CustomerCard name={customer.name} phone={customer.phone}/>
                ))}
            </div>
        </div>
    )
}

export default CustomerSearchExercise