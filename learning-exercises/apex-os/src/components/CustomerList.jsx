import CustomerCard from "./CustomerCard";

function CustomerList({customers}) {
    return (
        <div>
            {customers.map((customer) => (
                <CustomerCard
                    key={customer.id}
                    customer={customer}
                />
            ))}
        </div>
    )
}

export default CustomerList