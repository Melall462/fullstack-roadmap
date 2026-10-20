function SearchBar({ searchTerm, setSearchTerm }) {
    return (
        <div>    
            <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            />
            <button onClick={() => setSearchTerm("")}>
                Clear Search
            </button>
        </div>
    );
}

export default SearchBar;