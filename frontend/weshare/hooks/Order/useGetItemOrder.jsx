// useGetItemOrder.js
import useSWR from "../useSWRFetch";  // 請確認路徑是正確的

const useGetItemOrder = (itemId) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/orders/${itemId}`;
  const { data, error, isLoading } = useSWR(url);

  return { data, error, isLoading };
};

export default useGetItemOrder;
