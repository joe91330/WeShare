/* eslint-disable no-shadow */
import { useState } from "react";
import axios from 'axios';
import Swal from "sweetalert2";
import Cookies from 'js-cookie';


const useCreateOrder = () => {
  const [isLoading1, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);
  const [success, setsuccess] = useState(null);
  const accessToken = Cookies.get("accessToken");

  const createOrder = async (itemId, quantity) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/orders/${itemId}`, {
        quantity
      }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        }
      });

      setOrder(response.data.order);
      setsuccess(true);
      if (response.status === 200) {
        Swal.fire("成功!", "商品下單成功!", "success");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Could not create order");
      setsuccess(false);
      Swal.fire("失敗!", "商品下單失敗!", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading1,
    error,
    order,
    createOrder,
    success
  };
};

export default useCreateOrder;
