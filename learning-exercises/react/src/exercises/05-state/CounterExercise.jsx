import { useState } from 'react';

function Counter() {
    const [count, setCount] = useState(0);

    return (
        <div>
            <h1>{count}</h1>
            <button onClick={() => setCount(Math.max(0, count - 1))}>Decrease</button>
            <button onClick={() => setCount(count + 1)}>Increase</button>
            <button onClick={() => setCount(0)}>Reset</button>
            <p>{DisplayJobs(count)}</p>
        </div>
    );
}

function DisplayJobs(count) {
    if (count > 0) {
        return `Jobs added: ${count}`
    } else {
        return "No jobs added yet"
    }
}

export default Counter;