import { useState, useEffect } from "react";
import UserList from "./UserList";
import SearchBar from "./SearchBar"

function App() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await fetch("https://jsonplaceholder.typicode.com/users")

                if (!response.ok) {
                    throw new Error("Failed to fetch users")
                }

                const data = await response.json()

                setUsers(data)
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [])

    const filteredUsers = users.filter((user) => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div>
            <h1>User Directory</h1>
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
            <div>
                {
                    loading === true ?
                    <p>Loading users...</p> :
                    error !== null ?
                    <p>{error}</p> :
                    <UserList users={filteredUsers}/>
                }
            </div>
        </div>
    );
}

export default App;
