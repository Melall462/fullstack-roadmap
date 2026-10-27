import CustomerCard from "./CustomerCard";

function CustomerList({customers, onDeleteCustomer, onEditCustomer}) {
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
                            onEditCustomer={onEditCustomer}
                        />
                    </div>
                ))
            }
        </div>
    )
}

export default CustomerList