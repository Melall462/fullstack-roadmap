import { useState } from "react";

type Props = {
    onAddCustomer: (name: string, email: string) => void,
    onClose: () => void
}

function AddCustomerForm({ onAddCustomer, onClose }: Props) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [nameError, setNameError] = useState<string | null>(null)
    const [emailError, setEmailError] = useState<string | null>(null)

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
        <div className="add-customer-form">
            <div className="inputs">
                <div className="input-group">
                    <input
                        className={nameError ? "name-input invalid" : "name-input"}
                        value={name}
                        placeholder="Name"
                        onChange={(event) => setName(event.target.value)}
                    />
                    {nameError && (
                        <p className="error-message">{nameError}</p>
                    )}
                </div>

                <div className="input-group">
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
            </div>

            <button
                className="add-customer-button"
                onClick={handleSubmit}
            >
                Add Customer
            </button>
            <button className="cancel-add-customer" type="button" onClick={() => onClose()}>Cancel</button>
        </div>
    );
}

export default AddCustomerForm;