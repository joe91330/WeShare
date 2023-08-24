import { useState } from "react";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { mutate } from 'swr';

function useAgreeOrder() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const accessToken = Cookies.get("accessToken");
  const agreeOrder = async (orderId) => {
    setIsLoading(true);
    setError(null);

    const url = `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/agree`;
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    try {
      const res = await fetch(url, options);
      const data = await res.json();
      Swal.fire("成功", "確認訂單成功!", "success");
      mutate(`${process.env.NEXT_PUBLIC_API_URL}/events`);
      if (!res.ok) {
        throw new Error(data.message || "Failed to agree the order.");
      }

      setResponse(data);
      
    } catch (err) {
      setError(err);
      Swal.fire("錯誤","確認訂單失敗!", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    response,
    agreeOrder,
  };
}

export default useAgreeOrder;
