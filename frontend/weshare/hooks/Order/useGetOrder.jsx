import useSWRFetch from "../useSWRFetch";

const useGetOrder = () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/orders`;
  const { data, error, isLoading1 } = useSWRFetch(url);

  return { data, error, isLoading1 };
};

export default useGetOrder;
