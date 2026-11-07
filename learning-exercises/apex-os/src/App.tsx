import './App.css'
import type { ReactNode } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router'
import Layout from './components/Layout'
import Jobs from './components/Jobs'
import JobForm from './components/JobForm'
import JobDetail from './components/JobDetail'
import Customers from './components/Customers'
import CustomerForm from './components/CustomerForm'
import CustomerDetail from './components/CustomerDetail'
import Vehicles from './components/Vehicles'
import VehicleForm from './components/VehicleForm'
import VehicleDetail from './components/VehicleDetail'
import Services from './components/Services'
import Analytics from './components/Analytics'

// Forms read their starting values once, so give each visit a fresh copy
// (e.g. /jobs/new?vehicle=1 then /jobs/new?vehicle=2).
function Fresh({ children }: { children: ReactNode }) {
  const location = useLocation()
  return <div key={location.key}>{children}</div>
}

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path='/' element={<Navigate to='/jobs' replace />} />
        <Route path='/dashboard' element={<Navigate to='/jobs' replace />} />

        <Route path='/jobs' element={<Jobs />} />
        <Route path='/jobs/new' element={<Fresh><JobForm /></Fresh>} />
        <Route path='/jobs/:id' element={<JobDetail />} />
        <Route path='/jobs/:id/edit' element={<Fresh><JobForm /></Fresh>} />

        <Route path='/customers' element={<Customers />} />
        <Route path='/customers/new' element={<Fresh><CustomerForm /></Fresh>} />
        <Route path='/customers/:id' element={<CustomerDetail />} />
        <Route path='/customers/:id/edit' element={<Fresh><CustomerForm /></Fresh>} />

        <Route path='/vehicles' element={<Vehicles />} />
        <Route path='/vehicles/new' element={<Fresh><VehicleForm /></Fresh>} />
        <Route path='/vehicles/:id' element={<VehicleDetail />} />
        <Route path='/vehicles/:id/edit' element={<Fresh><VehicleForm /></Fresh>} />

        <Route path='/analytics' element={<Analytics />} />
        <Route path='/services' element={<Services />} />
        <Route path='*' element={<Navigate to='/jobs' replace />} />
      </Route>
    </Routes>
  )
}

export default App
