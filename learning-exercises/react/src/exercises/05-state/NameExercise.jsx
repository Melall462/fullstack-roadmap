import { useState } from "react"

function Name1() {
    const [name, setName] = useState("Alex")

    return (
        <div>
            <div>{name}</div>
            <button onClick={() => {setName("Jordan")}}>Jordan</button>
        </div>
    )
}

export default Name1