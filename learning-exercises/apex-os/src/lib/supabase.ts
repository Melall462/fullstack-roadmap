import { createClient } from "@supabase/supabase-js"

// Set these in .env.local (see .env.example). The publishable key is meant to be
// public: Row Level Security in the database is what keeps each account's data private.
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined

export const isConfigured = Boolean(url && key)

export const supabase = createClient(url ?? "http://localhost", key ?? "missing-key")
