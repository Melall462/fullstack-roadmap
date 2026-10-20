function CustomerCount({filteredCustomers, setSearchTerm}) {
    return (
        <div>
            {
                filteredCustomers.length === 1 ?
                <p>Showing {filteredCustomers.length} customer</p> :
                <p>Showing {filteredCustomers.length} customers</p>
            }
            <button onClick={() => setSearchTerm("")}>
                Clear Search
            </button>
        </div>
    )
}

export default CustomerCount