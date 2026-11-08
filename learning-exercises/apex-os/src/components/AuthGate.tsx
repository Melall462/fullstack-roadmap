import { useEffect, useState, type ReactNode } from "react"
import type { Session } from "@supabase/supabase-js"
import { isConfigured, supabase } from "../lib/supabase"
import Login from "./Login"

// Shows the login screen until someone is signed in, then renders the app for that user.
function AuthGate({ children }: { children: (session: Session) => ReactNode }) {
    // undefined = still checking, null = signed out
    const [session, setSession] = useState<Session | null | undefined>(undefined)

    useEffect(() => {
        if (!isConfigured) return
        supabase.auth.getSession().then(({ data }) => setSession(data.session))
        const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next))
        return () => data.subscription.unsubscribe()
    }, [])

    if (!isConfigured) {
        return (
            <div className="center-screen">
                <div className="card card-pad form" style={{ maxWidth: 480 }}>
                    <h2>Supabase isn't set up yet</h2>
                    <p className="secondary">
                        Copy <code>.env.example</code> to <code>.env.local</code>, fill in your project URL and
                        publishable key, then restart <code>npm run dev</code>.
                    </p>
                </div>
            </div>
        )
    }
    if (session === undefined) return <div className="center-screen"><p className="secondary">Loading…</p></div>
    if (session === null) return <Login />
    return <>{children(session)}</>
}

export default AuthGate
