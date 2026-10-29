import './App.css'
import { Route, Routes, Navigate } from 'react-router';
import Dashboard from './components/Dashboard.jsx';
import Customers from './components/Customers.jsx';
import Vehicles from './components/Vehicles.jsx';
import Layout from './components/Layout.jsx';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path='/' element={<Navigate to={"/dashboard"} replace></Navigate>}></Route>
        <Route path='/dashboard' element={<Dashboard />}></Route>
        <Route path='/customers' element={<Customers />}></Route>
        <Route path='/vehicles' element={<Vehicles />}></Route>
      </Route>
    </Routes>
  )
}

export default App