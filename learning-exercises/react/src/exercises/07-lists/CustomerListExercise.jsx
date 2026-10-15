import CustomerCard from "./CustomerCard.jsx"

function CustomerListExercise() {
    const customers = [
        { id: 1, name: "James", phone: "0211234567" },
        { id: 2, name: "Sarah", phone: "0221234567" },
        { id: 3, name: "Mike", phone: "0271234567" }
    ];

    return (
        <div>
            <h2>Customers</h2>
            <div>{customers.map((customer) => (
                <CustomerCard key={customer.id} name={customer.name} phone={customer.phone}/>
            )
            )}</div>
        </div>
    );
}

export default CustomerListExercise;