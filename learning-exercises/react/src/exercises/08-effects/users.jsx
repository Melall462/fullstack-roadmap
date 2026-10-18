import { useState, useEffect } from "react"

function Users() {
    const [users, setUsers] = useState([])
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()))

    async function fetchUsers() {
        try {
            setIsLoading(true)
            setError("")

            const response = await fetch("https://jsonplaceholder.typicode.com/users")

            if (!response.ok) {
                throw new Error("Failed to fetch users")
            }

            const data = await response.json()
            setUsers(data)
        } catch (error) {
            setError(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    return (
        <div>
            <h1>Users</h1>

            <input type="text" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Name"/>

            {error && (
                <button onClick={fetchUsers} disabled={isLoading}>
                    {isLoading ? "Loading..." : "Retry"}
                </button>
            )}


            {isLoading && <p>Loading users...</p>}

            {error && <p>Error: {error}</p>}

            {!isLoading && !error && (
                <ul>
                    {filteredUsers.length === 0 ? "No users found" : filteredUsers.map((user) => (
                        <li key={user.id}>{user.name}</li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default Users