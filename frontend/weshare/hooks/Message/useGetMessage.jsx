/* eslint-disable import/no-extraneous-dependencies */

import axios from "axios";
import { useState, useEffect } from "react";
import { parseCookies } from "nookies";
import { mutate } from "swr";
import { io } from "socket.io-client";

const useGetMessages = (userid) => {
  const cookies = parseCookies();
  const { accessToken } = cookies;
  const myid = cookies.userId;
  const roomName = userid > myid ? `${myid}${userid}` : `${userid}${myid}`;
  // console.log('myid', myid);
  // console.log('userid', userid);
  console.log("roomName", roomName);
  const [initialMessages, setinitialMessages] = useState([]); // 創建一個狀態來存儲消息
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [nextTenMessagesCursor, setnextTenMessagesCursor] = useState("");

  useEffect(() => {
    (async () => {
      console.log("getmessages - userID", userid);
      // if (isFetchingMessages) return;
      try {
        // setIsFetchingMessages(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/chats/${userid}&${
            nextTenMessagesCursor ? `cursor=${nextTenMessagesCursor}` : ""
          }`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              // 'Content-Type': 'application/json'
            },
          }
        );
        console.log("response.data", response.data);
        setinitialMessages(response.data.data.chats);
        setnextTenMessagesCursor(response.data.data.next_cursor);
        // eslint-disable-next-line camelcase
      } catch (err) {
        console.log("getmessages - err", err);
        setError(err.response?.data?.message || "發送訊息失敗");
      } finally {
        // setIsFetchingMessages(false);
      }
    })();

    // 建立 socket 連接
    const newSocket = io("https://13.238.130.147/", {
      extraHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    newSocket.on("connection", () => {
      // 連接成功後，向伺服器端發送加入房間的請求
    });
    newSocket.emit("test", `chat${roomName}`);
    // newSocket.emit( `chat${roomName}`);

    // 接收伺服器端傳來的訊息
    newSocket.on("response", (messageData) => {
      console.log("收到", messageData);
      mutate(`${process.env.NEXT_PUBLIC_API_URL}/chats`);
      setinitialMessages((prevMessages) => [...prevMessages, messageData]);
    });
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // 使用 useEffect 來監聽捲動事件
  // useEffect(() => {
  //   const handleScroll = () => {
  //     const { scrollY } = window;
  //     // const pageHeight = document.documentElement.scrollHeight;
  //     // const windowHeight = window.innerHeight;
  //     const remainingDistance = 100;

  //     if (
  //       scrollY <= remainingDistance &&
  //       !isFetchingMessages &&
  //       nextTenMessagesCursor != null
  //     ) {
  //       console.log("get the posts!");
  //       (async () => {
  //         console.log("getmessages - userID", userid);
  //         if (isFetchingMessages) return;
  //         try {
  //           setIsFetchingMessages(true);
  //           const response = await axios.get(
  //             `${process.env.NEXT_PUBLIC_API_URL}/chats/${userid}&${
  //               nextTenMessagesCursor ? `cursor=${nextTenMessagesCursor}` : ""
  //             }`,
  //             {
  //               headers: {
  //                 Authorization: `Bearer ${accessToken}`,
  //                 // 'Content-Type': 'application/json'
  //               },
  //             }
  //           );
  //           console.log("response.data", response.data);
  //           setinitialMessages(response.data.data.chats);
  //           setnextTenMessagesCursor(response.data.data.next_cursor);
  //           // eslint-disable-next-line camelcase
  //         } catch (err) {
  //           console.log("getmessages - err", err);
  //           setError(err.response?.data?.message || "發送訊息失敗");
  //         } finally {
  //           setIsFetchingMessages(false);
  //         }
  //       })();
  //     }
  //   };

  //   const debounce = (fn, delay) => {
  //     let timeId = null;
  //     return function (...args) {
  //       const shouldExecuteImmediate = !timeId;

  //       if (timeId) clearTimeout(timeId);

  //       timeId = setTimeout(() => {
  //         timeId = null;
  //         if (!shouldExecuteImmediate) {
  //           fn.apply(this, args);
  //         }
  //       }, delay);

  //       if (shouldExecuteImmediate) {
  //         fn.apply(this, args);
  //       }
  //     };
  //   };

  //   // 在捲動事件上套用 debounce 處理
  //   const handleScrollDebounced = debounce(handleScroll, 1000);
  //   window.addEventListener("scroll", handleScrollDebounced);

  //   // 移除事件監聽器，避免記憶體洩漏
  //   return () => {
  //     window.removeEventListener("scroll", handleScrollDebounced);
  //   };
  // }, [isFetchingMessages, nextTenMessagesCursor]);
  return { initialMessages, socket, error };
};

export default useGetMessages;
