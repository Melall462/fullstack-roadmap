import CustomerCard from "./CustomerCard";
import type { Customer } from "../types/customer";
import type { Vehicle } from "../types/vehicle";
import type { Job } from "../types/job";

type Props ={
    customers: Customer[],
    vehicles: Vehicle[],
    jobs: Job[],
    onDeleteCustomer: (customerId: number) => void,
    onEditCustomer: (value: Customer) => void
}

function CustomerList({customers, vehicles, jobs, onDeleteCustomer, onEditCustomer}: Props) {
    return (
        <div className="customer-list">
            {
                customers.length === 0 ?
                <p className="no-results">No customer matches</p> :
                customers.map((customer) => (
                    <div key={customer.id}>
                        <CustomerCard   
                            customer={customer}
                            vehicles={vehicles.filter((v) => v.customerId === customer.id)}
                            jobCount={jobs.filter((j) => j.customerId === customer.id).length}
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