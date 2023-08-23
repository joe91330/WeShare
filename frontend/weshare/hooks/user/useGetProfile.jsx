import useSWRFetch from "../useSWRFetch";

const useGetProfile = (userId) => {
  const { data, error, isLoading } = useSWRFetch(
    userId && `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`
  );
  return {
    user: data?.user,
    isLoading,
    error,
    pic: data?.user.image,
    name: data?.user.name,
  };
};

export default useGetProfile;
