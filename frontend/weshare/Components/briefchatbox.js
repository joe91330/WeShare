"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "../styles/briefchatbox.module.scss";

export default function BriefChatBox({ chatPic, chatName,chatid }) {
  return (
    <Link href={`/chat/${chatid}`} >
      <div className={styles.border}>
        <div className={styles.picFrame}>
          <Image src="/個人照片.png" alt="聊天室照片" width={40} height={40} />
        </div>
        <div className={styles.userName}>{chatName}</div>
      </div>
    </Link>
  );
}
