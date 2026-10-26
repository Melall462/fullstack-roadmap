function CustomerCard({customer}) {
    return (
        <div className="customer-card">
            <h2>{customer.name}</h2>
            <p>{customer.email}</p>
        </div>
    )
}

export default CustomerCard