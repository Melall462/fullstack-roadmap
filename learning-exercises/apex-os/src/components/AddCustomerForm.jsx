import { useState } from "react";
import "./AddCustomerForm.css";

function AddCustomerForm({ onAddCustomer }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [nameError, setNameError] = useState(null)
    const [emailError, setEmailError] = useState(null)

    function handleSubmit() {
        if (
            name.trim() === "" ||
            email.trim() === "" ||
            !email.includes("@")
        ) {
            if (name.trim() === "") {
                setNameError("Please enter a valid name")
            } else {
                setNameError(null)
            }
            if (email.trim() === "" || !email.includes("@")) {
                setEmailError("Please enter a valid email")
            } else {
                setEmailError(null)
            }
        } else {
            onAddCustomer(name.trim(), email.trim());
            setName("");
            setEmail("");
            setNameError(null)
            setEmailError(null)
        }
    }

    return (
        <div>
            <div className="inputs">
                <input
                    className={nameError ? "name-input invalid" : "name-input"}
                    value={name}
                    placeholder="Name"
                    onChange={(event) => setName(event.target.value)}
                />
                {nameError && (
                    <p className="error-message">{nameError}</p>
                )}

                <input
                    className={emailError ? "email-input invalid" : "email-input"}
                    value={email}
                    placeholder="Email"                                                                                                                                      
                    onChange={(event) => setEmail(event.target.value)}
                />
                {emailError && (
                    <p className="error-message">{emailError}</p>
                )}
            </div>

            <button
                className="add-customer-button"
                onClick={handleSubmit}
            >
                Add Customer
            </button>
        </div>
    );
}

export default AddCustomerForm;