import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer/Footer';

import Navbar from './components/navbar/Navbar'
// import { Routes } from 'react-router-dom'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Cart from './pages/Cart/Cart'
import Home from './pages/Home/Home'
import LoginPopup from './components/LoginPopup/LoginPopup';
import Verify from './pages/verify/Verify';
import MyOrders from './pages/MyOrders/MyOrders';

const App = () => {
  const[showLogin,setShowLogin] = useState(false)

  return (
    <>
      {showLogin?<LoginPopup setShowLogin={setShowLogin}/>:<></>}
      <div className='app'>
        <Navbar setShowLogin={setShowLogin}/>
        <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/cart' element={<Cart/>} />
            <Route path='/order' element={<PlaceOrder/>} />
            <Route path='/verify' element={<Verify/>} />
            <Route path='/myorders' element={<MyOrders/>} />


        </Routes>
      </div>
      <Footer/>
    </>
    
  )
}

export default App
