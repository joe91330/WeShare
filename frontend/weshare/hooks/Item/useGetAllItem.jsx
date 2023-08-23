import Cookie from "js-cookie";
import useSWRfetch from '../useSWRFetch'; // 根據你的目錄結構調整引入的路徑

const userLocation = JSON.parse(Cookie.get("userLocation") || "{}");
console.log("6666666",userLocation)
const useGetAllItems = (cursor = null, keyword = null, tag = null) => {
  // 設定基礎 URL
  const baseURL = `${process.env.NEXT_PUBLIC_API_URL}/items`;

  // 根據傳入的參數建立完整的 URL
  let url = baseURL;

  const params = [];
  if (cursor) params.push(`cursor=${cursor}`);
  if (keyword) params.push(`keyword=${keyword}`);
  if (tag) params.push(`tag=${tag}`);

  if (params.length > 0) {
    url += `?${params.join('&&')}`;
  }

  // 使用提供的 useSWRfetch
  const { data, error, isLoading } = useSWRfetch(url, {
    // 這裡可以放任何你想要的 useSWRfetch 的選項
  });

  return {
    items: data?.items,
    nextCursor: data?.next_cursor,
    error,
    isLoading
  };
};

export default useGetAllItems;
