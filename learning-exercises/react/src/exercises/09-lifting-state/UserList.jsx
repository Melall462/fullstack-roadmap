function UserList({ users }) {
    return (
        <ul>
            {users.map((user) => (
                <li key={user.id}>{user.name}</li>
            ))}

            {users.length === 0 && (
                <p>No user found.</p>
            )}
        </ul>
    );
}

export default UserList