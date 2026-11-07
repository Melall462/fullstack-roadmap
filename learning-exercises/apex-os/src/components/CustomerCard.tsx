import { useState } from "react";
import type { Customer } from "../types/customer";
import type { Vehicle } from "../types/vehicle";

type Props ={
    customer: Customer,
    vehicles: Vehicle[],
    jobCount: number,
    onDeleteCustomer: (customerId: number) => void,
    onEditCustomer: (value: Customer) => void
}

function CustomerCard({customer, vehicles, jobCount, onDeleteCustomer, onEditCustomer}: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(customer.name);
    const [email, setEmail] = useState(customer.email);

    function saveCustomer() {
        if (!name.trim() || !email.trim() || !email.includes("@")) {
            return;
        }

        onEditCustomer({
            ...customer,
            name: name.trim(),
            email: email.trim()
        });

        setIsEditing(false);
    }

    function cancelEdit() {
        setName(customer.name);
        setEmail(customer.email);
        setIsEditing(false);
    }
    
    return (
        <div className="customer-card">
            {
                isEditing ?
                <div>
                    <input className="edit-name" value={name} onChange={(event) => setName(event.target.value)}></input>
                    <input className="edit-email" value={email} onChange={(event) => setEmail(event.target.value)}></input>
                    <div className="customer-buttons">
                        <button className="edit-customer" onClick={saveCustomer}>Save</button>
                        <button className="delete-customer" onClick={cancelEdit}>Cancel</button>
                    </div>
                </div> :
                <div>
                    <h2>{customer.name}</h2>
                    <p>{customer.email}</p>
                    <ul className="customer-vehicles">
                        {vehicles.length === 0 ?
                            <li className="muted">No vehicles</li> :
                            vehicles.map((vehicle) => (
                                <li key={vehicle.id}>{vehicle.year} {vehicle.make} {vehicle.model} - {vehicle.rego}</li>
                            ))
                        }
                    </ul>
                    <p className="muted">{jobCount} job{jobCount === 1 ? "" : "s"}</p>
                    <div className="customer-buttons">
                        <button className="edit-customer" onClick={() => setIsEditing(true)}>Edit</button>
                        <button className="delete-customer" onClick={() => onDeleteCustomer(customer.id)}>Delete</button>
                    </div>
                </div>
            }
        </div>
    )
}

export default CustomerCard