import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App'
import AuthGate from './components/AuthGate'
import DataProvider from './data/DataProvider'

const root = document.getElementById('root')

if (root) {
  createRoot(root).render(
    <StrictMode>
      <BrowserRouter>
        <AuthGate>
          {(session) => (
            // key: a different account gets a fresh copy of the data
            <DataProvider key={session.user.id} userId={session.user.id} userEmail={session.user.email ?? ""}>
              <App />
            </DataProvider>
          )}
        </AuthGate>
      </BrowserRouter>
    </StrictMode>,
  )
}
