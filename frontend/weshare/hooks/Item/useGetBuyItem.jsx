import useSWR from "../useSWRFetch";  // 請確認路徑是正確的

const useGetBuyItem = () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/items/buy`;
  const { data, error, isLoading } = useSWR(url);
  return { data, error, isLoading };
};

export default useGetBuyItem;
