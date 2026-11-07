import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter }from 'react-router' 
import './index.css'
import App from './App'
import DataProvider from './data/DataProvider'

const root = document.getElementById('root')

if (root) {
  createRoot(root).render(
    <StrictMode>
      <BrowserRouter>
        <DataProvider>
          <App />
        </DataProvider>
      </BrowserRouter>
    </StrictMode>,
  ) 
}