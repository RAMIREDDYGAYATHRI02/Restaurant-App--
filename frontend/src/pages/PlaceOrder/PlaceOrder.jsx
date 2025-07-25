import React, { useContext, useState } from "react";
import axios from "axios";
import "./PlaceOrder.css";
import { StoreContext } from "../../Context/StoreContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } =
    useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();

    try {
      // Prepare order items
      let orderItems = [];
      food_list.forEach((item) => {
        if (cartItems[item._id] > 0) {
          let itemInfo = { ...item, quantity: cartItems[item._id] }; // Clone item to avoid mutation
          orderItems.push(itemInfo);
        }
      });

      // Prepare order data
      let orderData = {
        address: data,
        items: orderItems,
        amount: getTotalCartAmount() + (getTotalCartAmount() === 0 ? 0 : 2), // Add delivery fee
      };

      console.log("Order Data:", orderData); // Debugging order data

      // Place order via API
      const response = await axios.post(
        url + "/api/order/place",
        orderData,
        { headers: { token } }
      );

      console.log("Order API Response:", response.data); // Debugging response

      if (response.data.success) {
        const { session_url } = response.data;

        if (session_url) {
          console.log("Redirecting to:", session_url); // Debugging session URL
          window.location.replace(session_url);
        } else {
          alert("Error: No session URL returned from server.");
        }
      } else {
        alert("Order placement failed: " + (response.data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error placing order:", error.message, error.response?.data);
      alert("Error placing order: " + error.message);
    }
  };
  const navigate=useNavigate();

  useEffect(()=>{
    if(!token){
navigate('/cart')
    }
    else if(getTotalCartAmount()===0){
navigate('/cart')
    }

  },[token])

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            required
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            type="text"
            placeholder="First Name"
          />
          <input
            required
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName}
            type="text"
            placeholder="Last Name"
          />
        </div>
        <input
          required
          name="email"
          onChange={onChangeHandler}
          value={data.email}
          type="email"
          placeholder="Email address"
        />
        <input
          required
          name="street"
          onChange={onChangeHandler}
          value={data.street}
          type="text"
          placeholder="Street"
        />
        <div className="multi-fields">
          <input
            required
            name="city"
            onChange={onChangeHandler}
            value={data.city}
            type="text"
            placeholder="City"
          />
          <input
            required
            name="state"
            onChange={onChangeHandler}
            value={data.state}
            type="text"
            placeholder="State"
          />
        </div>
        <div className="multi-fields">
          <input
            required
            name="zipcode"
            onChange={onChangeHandler}
            value={data.zipcode}
            type="text"
            placeholder="Zip code"
          />
          <input
            required
            name="country"
            onChange={onChangeHandler}
            value={data.country}
            type="text"
            placeholder="Country"
          />
        </div>
        <input
          required
          name="phone"
          onChange={onChangeHandler}
          value={data.phone}
          type="text"
          placeholder="Phone"
        />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                ${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}
              </b>
            </div>
          </div>
          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
