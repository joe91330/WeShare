import axios from "axios";
import { useState, useEffect } from "react";
import { parseCookies } from "nookies";
import { io } from "socket.io-client";
// import useSWRFetch from "../useSWRFetch";

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

  useEffect(() => {
    (async () => {
      console.log("getmessages - userID", userid);

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/chats/${userid}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              // 'Content-Type': 'application/json'
            },
          }
        );
        console.log("response.data", response.data);
        setinitialMessages(response.data.data.chats);
        // eslint-disable-next-line camelcase
      } catch (err) {
        console.log("getmessages - err", err);
        setError(err.response?.data?.message || "發送訊息失敗");
      }
    })();

    // 建立 socket 連接
    const newSocket = io("http://13.238.130.147/", {
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

      setinitialMessages((prevMessages) => [...prevMessages, messageData]);
    });

    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return { initialMessages, socket, error };
};

export default useGetMessages;
