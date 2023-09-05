import { useState } from 'react';
import { mutate } from 'swr';
import axios from 'axios';
import Cookies from 'js-cookie';

const useUpdateProfile = (userId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const accessToken = Cookies.get("accessToken");

  const updateProfile = async ( imageBlob) => {
    setLoading(true);
    setSuccess(false);
    setError(null);
    setImageUrl(null);

    const formData = new FormData();
    formData.append("picture", imageBlob);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/image`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          }
        }
      );

      if (response.status === 200) {
        setSuccess(true);
        setImageUrl(response.data);
        console.log("fuck")
        // Optimistically update the user's photo in local data
        mutate(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
          
        );
      }
    } catch (err) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return { updateProfile, loading, error, success, imageUrl };
};

export default useUpdateProfile;
