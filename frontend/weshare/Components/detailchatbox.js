"use client";

import React, { useState, useEffect, useRef } from "react";
import { parseCookies } from "nookies";
import Image from "next/image";
// import Link from "Next/link";
import { mutate } from "swr";
import styles from "../styles/detailchatbox.module.scss";
import useGetMessages from "../hooks/Message/useGetMessage";
import useGetProfile from "../hooks/user/useGetProfile";

// import messagesData from "../Mockdata/messages.json";

export default function Deatailchatbox({ userid }) {
  const chatContainerRef = useRef(null);
  const cookies = parseCookies();
  const myid = cookies.userId;
  const [inputMessage, setinputMessage] = useState("");
  const { initialMessages, socket } = useGetMessages(userid);
  const { pic: myPic } = useGetProfile(myid);
  const { pic: userPic, name: userName } = useGetProfile(userid);

  
  const sendMessage = (message) => {
    if (socket) {
      socket.emit("message", {
        id: userid,
        message,
      });
    }
  };
  const handleInputChange = (e) => {
    setinputMessage(e.target.value);
  };
  const checkCreateMessage = () => {
    if (inputMessage.trim() !== "") {
      sendMessage(inputMessage);
      console.log("Creating message:", inputMessage);
      mutate(`${process.env.NEXT_PUBLIC_API_URL}/chats`);
      
      setinputMessage("");
    }
  };
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [initialMessages, inputMessage]);

  

  console.log(initialMessages);
  return (
    <div className={styles.wholePage}>
      <div className={styles.chatboxTitle}>
        <div className={styles.picFrame}>
          <Image src={userPic} alt="聊天室照片" width={30} height={30} />
        </div>
        <div className={styles.chatboxName}>
          <b>{userName}</b>
        </div>
        {/* <Link href={`/item/${dd}`}>  */}
        <div className={styles.chatboxLink}>至下單頁面</div>
        {/* </Link> */}
      </div>
      <div className={styles.chatMessages} ref={chatContainerRef}>
        {initialMessages?.map((chat) =>
          chat.user.id === parseInt(myid, 10) ? (
            <div key={chat.ID} className={styles.chatMessageRight}>
              <span className={styles.messageText}>{chat.message}</span>
              <div className={styles.picFrame}>
                <Image
                  src={myPic}
                  alt="聊天室照片"
                  width={60}
                  height={60}
                  className={styles.chatPic}
                />
              </div>
            </div>
          ) : (
            <div key={chat.ID} className={styles.chatMessageLeft}>
              <div className={styles.picFrame}>
                <Image
                  src={userPic}
                  alt="聊天室照片"
                  width={60}
                  height={60}
                  className={styles.chatPic}
                />
              </div>
              <span className={styles.messageText}>{chat.message}</span>
            </div>
          )
        )}
      </div>
      <div className={styles.horzontal_line} />
      <div className={styles.sendMessageOutBorder}>
        <div className={styles.sendMessage}>
          <input
            placeholder="輸入訊息"
            className={styles.snedMessage_box}
            value={inputMessage}
            onChange={handleInputChange}
          />
          <Image
            src="/right_arrow.png"
            alt="發送訊息"
            width={20}
            height={20}
            className={styles.sendMessage_icon}
            onClick={checkCreateMessage}
          />
        </div>
      </div>
    </div>
  );
}
