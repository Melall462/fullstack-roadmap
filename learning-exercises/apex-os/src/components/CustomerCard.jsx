import { useState } from "react";

function CustomerCard({customer, onDeleteCustomer, onEditCustomer}) {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(customer.name);
    const [email, setEmail] = useState(customer.email);

    function saveCustomer() {
        if (!name.trim() || !email.trim()) {
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
                    <input className="edit-name" value={name}onChange={(event) => setName(event.target.value)}></input>
                    <input className="edit-email" value={email} onChange={(event) => setEmail(event.target.value)}></input>
                    <div className="customer-buttons">
                        <button className="edit-customer" onClick={saveCustomer}>Save</button>
                        <button className="delete-customer" onClick={cancelEdit}>Cancel</button>
                    </div>
                </div> :
                <div>
                    <h2>{customer.name}</h2>
                    <p>{customer.email}</p>
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