function CustomerCard({customer, onDeleteCustomer}) {
    return (
        <div className="customer-card">
            <h2>{customer.name}</h2>
            <p>{customer.email}</p>
            <button className="delete-customer" onClick={() => onDeleteCustomer(customer.id)}>Delete</button>
        </div>
    )
}

export default CustomerCard