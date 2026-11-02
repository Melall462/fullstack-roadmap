type props = {
    searchTerm: string,
    onSearchChange: (value: string) => void
}

function SearchCustomers({ searchTerm, onSearchChange }: props) {
    return (
        <div>
            <input
                type="text"
                placeholder="Search Customer"
                value={searchTerm}
                onChange={(event) => onSearchChange(event.target.value)}
                className="search-input"
            />
        </div>
    );
}

export default SearchCustomers;