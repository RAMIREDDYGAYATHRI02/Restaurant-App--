import React, { useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";
import './verify.css'
const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const { url } = useContext(StoreContext);
  const navigate = useNavigate();

  const verifyPayment = async () => {
    try {
      console.log("Verify called with:", { success, orderId });
      const response = await axios.post(`${url}/api/order/verify`, {
        success: success === "true",
        orderId,
      });
      console.log("Response from backend:", response.data);
      if (response.data.success) {
        navigate("/myorders");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error in verifyPayment:", error);
      navigate("/");
    }
  };

  useEffect(() => {
    verifyPayment();
  }, []);

  return (
    <div className="verify">
      <div className="spinner" />
    </div>
  );
};

export default Verify;
