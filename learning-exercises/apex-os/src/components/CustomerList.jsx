import CustomerCard from "./CustomerCard";

function CustomerList({customers}) {
    return (
        <div className="customer-list">
            {
                customers.length === 0 ?
                <p className="no-results">No customer matches</p> :
                customers.map((customer) => (
                    <div>
                        <CustomerCard
                            key={customer.id}
                            customer={customer}
                        />
                    </div>
                ))
            }
        </div>
    )
}

export default CustomerList