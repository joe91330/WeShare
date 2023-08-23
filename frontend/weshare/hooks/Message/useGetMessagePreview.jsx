"use client";

import useSWRFetch from "../useSWRFetch";

const useGetMessageePreview = () => {
  const { data, error } = useSWRFetch(
    `${process.env.NEXT_PUBLIC_API_URL}/chats`
  );
  console.log("data?.chats",data?.chats );

  return { chatsPreview:data?.chats, error };
};

export default useGetMessageePreview;
