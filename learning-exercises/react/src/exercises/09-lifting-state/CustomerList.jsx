function CustomerList({ filteredCustomers}) {

    return (
        <ul>
            {filteredCustomers.map((customer) => (
                <li key={customer.id}>{customer.name}</li>
            ))}

            {filteredCustomers.length === 0 && (
                <li>No customers found.</li>
            )}
        </ul>
    );
}

export default CustomerList;