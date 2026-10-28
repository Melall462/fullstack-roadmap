import { useState } from "react";

function GetBusinessName() {
    const [businessName, setBusinessName] = useState(localStorage.getItem("businessName") || "Apex Mobile Detailing");
    const [newBusinessName, setNewBusinessName] = useState("")

    function changeBusinessName() {
        const trimmedName = newBusinessName.trim()

        if(!trimmedName) return;

        setBusinessName(trimmedName)
        localStorage.setItem("businessName", trimmedName)
        setNewBusinessName("")
    }

    return (
        <div>
            <h1>{businessName}</h1>
            <div>
                <input placeholder="Business Name" value={newBusinessName} onChange={(event) => setNewBusinessName(event.target.value)}></input>
                <button onClick={changeBusinessName}>Change</button>
            </div>
        </div>
    );
}

export default GetBusinessName;