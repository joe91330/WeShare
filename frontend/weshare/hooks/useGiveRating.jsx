import { useState } from "react";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

function useGiveRating() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const accessToken = Cookies.get("accessToken");
  const giveRating = async (id, ratingValue) => {
    setIsLoading(true);
    setError(null);

    const url = `${process.env.NEXT_PUBLIC_API_URL}/users/${id}/rating`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        rating: ratingValue,
      }),
    };

    try {
      const res = await fetch(url, options);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to give rating.");
      }
      if (res.status === 200) {
        Swal.fire("成功!", "謝謝您的評分!", "success");
      }
      setResponse(data);
    } catch (err) {
      setError(err);
      Swal.fire("失敗!", "評分失敗!", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    response,
    giveRating,
  };
}

export default useGiveRating;
