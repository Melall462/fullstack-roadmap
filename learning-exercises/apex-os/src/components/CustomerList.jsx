import CustomerCard from "./CustomerCard";

function CustomerList({customers, onDeleteCustomer}) {
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
                            onDeleteCustomer={onDeleteCustomer}
                        />
                    </div>
                ))
            }
        </div>
    )
}

export default CustomerList