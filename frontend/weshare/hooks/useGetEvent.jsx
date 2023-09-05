import useSWRfetch from "./useSWRFetch"; // Adjust the import path

const useGetEvents = () => {
  const { data, error, isLoading } = useSWRfetch(
    `${process.env.NEXT_PUBLIC_API_URL}/events`
  );

  return {
    events: data?.event,
    isLoading,
    error,
  };
};

export default useGetEvents;
