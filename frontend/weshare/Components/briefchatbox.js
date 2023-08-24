"use client";

import Image from "next/image";
import { mutate } from "swr";
import Link from "next/link";
import styles from "../styles/briefchatbox.module.scss";

export default function BriefChatBox({
  chatPic,
  chatName,
  chatid,
  chatMessage,
}) {
  mutate(`${process.env.NEXT_PUBLIC_API_URL}/chats`);
  return (
    <Link href={`/chat/${chatid}`} style={{ textDecoration: 'none'}}>
      <div className={styles.border}>
        <div className={styles.picFrame}>
          <Image src={chatPic} alt="聊天室照片" width={40} height={40} />
        </div>
        <div className={styles.userName}>{chatName}</div>
        <div className={styles.chatMessagePreview}>{chatMessage}</div>
      </div>
    </Link>
  );
}
