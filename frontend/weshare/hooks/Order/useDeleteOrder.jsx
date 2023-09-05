import { useState } from 'react';
import Cookies from "js-cookie";

function useDeleteOrder() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);
    const accessToken = Cookies.get("accessToken");
    const deleteOrder = async (orderId) => {
        setIsLoading(true);
        setError(null);

        const url = `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`;
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        };

        try {
            const res = await fetch(url, options);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Failed to delete the order.');
            }

            setResponse(data);
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        error,
        response,
        deleteOrder,
    };
}

export default useDeleteOrder;
