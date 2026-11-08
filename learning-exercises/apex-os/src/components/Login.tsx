import { useState } from "react"
import type React from "react"
import { supabase } from "../lib/supabase"

function Login() {
    const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const [busy, setBusy] = useState(false)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError("")
        setMessage("")
        if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError("Enter your email, like sam@example.com.")
        if (password.length < 6) return setError("Passwords need at least 6 characters.")

        setBusy(true)
        if (mode === "sign-in") {
            const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
            if (error) setError(error.message === "Invalid login credentials" ? "That email and password don't match." : error.message)
        } else {
            const { data, error } = await supabase.auth.signUp({
                email: email.trim(),
                password,
                options: { emailRedirectTo: window.location.origin },
            })
            if (error) setError(error.message)
            // With email confirmation turned on there's no session yet.
            else if (!data.session) {
                setMessage("Check your email for a link to confirm your account, then sign in.")
                setMode("sign-in")
            }
        }
        setBusy(false)
    }

    return (
        <div className="center-screen">
            <div className="login">
                <div className="brand" style={{ marginBottom: 24 }}>
                    <span className="brand-mark" aria-hidden="true">A</span>
                    <span className="brand-name">ApexOS</span>
                </div>
                <h1>{mode === "sign-in" ? "Sign in" : "Create your account"}</h1>
                {message && <div className="flash" role="status" style={{ marginTop: 16 }}>{message}</div>}
                <form className="card card-pad form" onSubmit={handleSubmit} noValidate style={{ marginTop: 24 }}>
                    <label className="field">
                        <span>Email</span>
                        <input type="email" autoComplete="email" autoFocus value={email} onChange={(e) => setEmail(e.target.value)} />
                    </label>
                    <label className="field">
                        <span>Password</span>
                        <input type="password" autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
                            value={password} onChange={(e) => setPassword(e.target.value)} />
                    </label>
                    {error && <span className="field-error" role="alert">{error}</span>}
                    <button className="btn btn-primary" type="submit" disabled={busy}>
                        {mode === "sign-in" ? "Sign in" : "Create account"}
                    </button>
                </form>
                <p className="secondary small" style={{ marginTop: 16, textAlign: "center" }}>
                    {mode === "sign-in" ? "New here? " : "Already have an account? "}
                    <button className="btn-link" onClick={() => { setMode(mode === "sign-in" ? "sign-up" : "sign-in"); setError(""); setMessage("") }}>
                        {mode === "sign-in" ? "Create an account" : "Sign in"}
                    </button>
                </p>
            </div>
        </div>
    )
}

export default Login
