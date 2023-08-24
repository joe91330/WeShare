/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/prop-types */
// import PropTypes from "prop-types";

"use client";

import { parseCookies } from "nookies";
import { useRouter } from "next/navigation";
import Deatailchatbox from "../../../../Components/detailchatbox";
import BriefChatBox from "../../../../Components/briefchatbox";
import useGetMessageePreview from "../../../../hooks/Message/useGetMessagePreview";
import Navbar from "../../../../Components/navbar";
import styles from "../../../../styles/chatPage.module.scss";


export default function Chats({ params }) {
  const { chatId } = params;
  console.log("hXXi", chatId);
  const { chatsPreview } = useGetMessageePreview();
  const cookies = parseCookies();
  const myid = cookies.userId;
  return (
    <div>
      <Navbar />
      <div className={styles.sepSide}>
        {myid !== chatId && <Deatailchatbox userid={chatId} />}
        <div className={styles.chatBrief}>
          {/* <div >聊天列表</div> */}
          {chatsPreview?.map((chatPreview) => (
            <div key={chatPreview.chat_id}>
              <BriefChatBox
                chatPic={chatPreview.user.image}
                chatName={chatPreview.user.name ? chatPreview.user.name : ""}
                chatid={chatPreview.user.id ? chatPreview.user.id : null}
                chatMessage={chatPreview.message}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
