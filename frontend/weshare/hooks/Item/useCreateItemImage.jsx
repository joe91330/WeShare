// hooks/item/useCreateItemImage.js
import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const useCreateItemImage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const accessToken = Cookies.get("accessToken");

  const uploadImage = async (imageBlob) => {
    setLoading(true);
    setError(null);
    setImageUrl(null);

    const formData = new FormData();
    formData.append("picture", imageBlob);

    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'multipart/form-data',
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/items/image`,
        formData,
        { headers }
      );

      if (response.status === 200 && response.data?.item?.image) {
        setImageUrl(response.data.item.image);
      }
    } catch (err) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return { uploadImage, loading, error, imageUrl };
};

export default useCreateItemImage;
