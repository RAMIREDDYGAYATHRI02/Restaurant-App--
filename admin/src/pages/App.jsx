import React from 'react'
import Navbar from '../../src/components/Navbar/Navbar'
import Sidebar from '../../src/components/Sidebar/Sidebar'
import { Route, Routes } from 'react-router-dom'
import List from './List/List'
import Add from './Add/Add'
import Orders from './Orders/Orders'
 import { ToastContainer } from 'react-toastify';
 import 'react-toastify/dist/ReactToastify.css'
const App = () => {
   const url="https://restaurant-app-backend-hsx9.onrender.com"
  return (
    <>
    <ToastContainer/>
      <Navbar/>
      <hr/>
      <div className='app-content'>
        <Sidebar/>
        <Routes>
            <Route path="/add" element={<Add url={url}/>}/>
            <Route path="/list" element={<List url={url}/>}/>
            <Route path="/orders" element={<Orders url={url}/>}/>
        </Routes>
      </div>


    </>
  )
}

export default App
