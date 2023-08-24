/* eslint-disable react/prop-types */
// import PropTypes from "prop-types";

"use client";

// import { useRouter } from "next/navigation";
import Navbar from "../../../../Components/navbar";
import Ordermanage from "../../../../Components/ordermanage";
import styles from "./page.module.scss"



export default function Chats({ params }) {
  const { chatId } = params;
  console.log("hXXi", chatId);
  return (
    <div className={styles.layout}>
      <Navbar />
      <Ordermanage />
    </div>
  );
}
