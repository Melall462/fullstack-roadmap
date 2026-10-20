import { useState, useEffect } from "react";

function FetchUsers() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [searchTerm, setSearchTerm] = useState("")

    async function getUsers(signal) {
        setError("")
        setLoading(true)

        try {
            const response = await fetch(
                "https://jsonplaceholder.typicode.com/users",
                { signal }
            )

            if (!response.ok) {
                throw new Error("Failed to fetch users")
            }

            const data = await response.json()
            setUsers(data)
        } catch (error) {
            if (error.name !== "AbortError") {
                setError(error.message)
            }
        } finally {
            setLoading(false)
        }
    }
    
    useEffect(() => {
        const controller = new AbortController()
        getUsers(controller.signal)

        return () => {
            controller.abort()
        }
    }, [])

    const filteredUsers = users.filter((user) => (
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    ))

    return (
        <div>
            <h1>Users</h1>
            {loading ? (
                <p>Loading users...</p>
            ) : error ? (
                <div>
                    <p>{error}</p>
                    <button onClick={() => getUsers(new AbortController().signal)}>Retry</button>                
                    </div>
            ) : (
                <div>
                    <input type="text" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)}/>
                    {filteredUsers.length === 0 ? (
                        <p>No users found.</p>
                    ) : (
                        <ul>{filteredUsers.map((user) => (
                            <li key={user.id}>
                                <div>
                                    {user.name} - {user.email}
                                </div>
                            </li>
                        ))}
                        </ul>
                    )}
                    
                </div>
            )}
        </div>
    )
}

export default FetchUsers