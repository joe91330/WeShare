import { useState } from 'react';
import Swal from "sweetalert2";
import axios from 'axios';
import Cookies from 'js-cookie';

const useCreateItem = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const accessToken = Cookies.get("accessToken");

  const createItem = async (itemData) => {
    setLoading(true);
    setSuccess(false);
    setError(null);

    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/items`,
        itemData,
        { headers }
      );

      if (response.status === 200) {
        setSuccess(true);
        Swal.fire("成功!", "商品上架成功!", "success");
      }
    } catch (err) {
      setError(err.message || 'An error occurred.');
      Swal.fire("失敗!", "商品上架失敗!", "error");
    } finally {
      setLoading(false);
    }
  };

  return { createItem, loading, error, success };
};

export default useCreateItem;
