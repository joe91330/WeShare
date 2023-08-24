
"use client";

import useSWRFetch from "../useSWRFetch";

const useGetOrder = () => {
  const { data, error } = useSWRFetch(
    `${process.env.NEXT_PUBLIC_API_URL}/orders`
  );
  console.log("data?", data);
  return { buyHistory: data?.buy,sellHistory: data?.sell, error };
};

export default useGetOrder;
