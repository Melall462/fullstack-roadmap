import CustomerCard from "./CustomerCard";

type Customer = {
    name: string,
    email: string,
    id: number
}

type Props ={
    customers: Customer[],
    onDeleteCustomer: (customerId: number) => void,
    onEditCustomer: (value: Customer) => void
}

function CustomerList({customers, onDeleteCustomer, onEditCustomer}: Props) {
    return (
        <div className="customer-list">
            {
                customers.length === 0 ?
                <p className="no-results">No customer matches</p> :
                customers.map((customer) => (
                    <div key={customer.id}>
                        <CustomerCard   
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