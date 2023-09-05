

import useSWRFetch from '../useSWRFetch';

const useGetItem = (itemId) => {
    const { data, error, isLoading } = useSWRFetch(itemId && `${process.env.NEXT_PUBLIC_API_URL}/items/${itemId}`);
    return {
        item: data?.item, 
        isLoading,
        isError: !!error
    };
};

export default useGetItem;
