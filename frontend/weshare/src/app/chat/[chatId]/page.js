/* eslint-disable react/prop-types */
// import PropTypes from "prop-types";

"use client";

import Deatailchatbox from "../../../../Components/detailchatbox";
import BriefChatBox from "../../../../Components/briefchatbox";
import useGetMessageePreview from "../../../../hooks/Message/useGetMessagePreview";
import Navbar from "../../../../Components/navbar";
import styles from "../../../../styles/chatPage.module.scss";

export default function Chats({ params }) {
  const { chatId } = params;
  console.log("hXXi", chatId);
  const { chatsPreview } = useGetMessageePreview();
  return (
    <div>
      <Navbar />
      <div className={styles.sepSide}>
        <Deatailchatbox userid={chatId} />
        {chatsPreview?.map((chatPreview) => (
          <div key={chatPreview.chat_id}>
            <BriefChatBox
              chatPic={
                chatPreview.user.image
                  ? chatPreview.user.image
                  : "/個人照片.png"
              }
              chatName={chatPreview.user.name ? chatPreview.user.name : ""}
              chatid={chatPreview.user.id ? chatPreview.user.id : null}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
