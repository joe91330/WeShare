import { mutate } from 'swr';
import useSWRFetch from "../useSWRFetch";

const useGetProfile = (userId) => {
  const endpoint = userId && `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`;

  const { data, error, isLoading } = useSWRFetch(endpoint);
  
  // 添加此函數讓外部可以呼叫，使資料重新取得
  const mutateData = () => {
    mutate(endpoint);
  };

  return {
    user: data?.user,
    isLoading,
    error,
    pic: data?.user.image,
    name: data?.user.name,
    mutateData  // 提供給外部呼叫
  };
};

export default useGetProfile;
