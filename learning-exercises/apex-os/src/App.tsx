import './App.css'
import { Route, Routes, Navigate } from 'react-router';
import Dashboard from './components/Dashboard';
import Customers from './components/Customers';
import Vehicles from './components/Vehicles';
import Layout from './components/Layout';
import Jobs from './components/Jobs';
import Services from './components/Services';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path='/' element={<Navigate to={"/dashboard"} replace></Navigate>}></Route>
        <Route path='/dashboard' element={<Dashboard />}></Route>
        <Route path='/customers' element={<Customers />}></Route>
        <Route path='/vehicles' element={<Vehicles />}></Route>
        <Route path='/jobs' element={<Jobs />}></Route>
        <Route path='/services' element={<Services />}></Route>
      </Route>
    </Routes>
  )
}

export default App