import { useState } from "react";

function Name2() {
    const [customerName, setCustomerName] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [error, setError] = useState("")

    function handleSave() {
        if (customerName.trim() === "") {
            setError("Please enter a customer name.")
        } else {
            setError("Customer saved!")
            setCustomerName("")
            setPhoneNumber("")
        }
    }

    function handleReset() {
        setError("")
        setCustomerName("")
        setPhoneNumber("")
    }

    return (
    <div>
        <input value={customerName} placeholder="Name" onChange={(event) => setCustomerName(event.target.value)}></input>
        <input type="tel" value={phoneNumber} placeholder="Phone Number" onChange={(event) => setPhoneNumber(event.target.value)}></input>
        <p>Customer Name: {customerName}</p>
        <p>Phone Number: {phoneNumber}</p>
        <button onClick={handleSave}>Save Customer</button>
        <button onClick={handleReset}>Reset Form</button>
        <p>{error}</p>
    </div>
    )
}

export default Name2    