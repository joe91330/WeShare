import axios from "axios";
import { useState } from "react";
import { parseCookies } from "nookies";

const useCreateMessages = () => {
  const cookies = parseCookies();
  const { accessToken } = cookies;
  const [error, setError] = useState(null);
  const createMessages = async (userID, message) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/chats/${userID}`,
        {
          message,
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response);
      // eslint-disable-next-line camelcase
    } catch (err) {
      setError(err.response?.data?.message || "發送訊息失敗");
    }
  };

  return { createMessages, error };
};

export default useCreateMessages;
