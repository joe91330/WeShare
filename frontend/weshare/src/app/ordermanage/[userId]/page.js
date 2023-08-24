/* eslint-disable react/prop-types */
// import PropTypes from "prop-types";

"use client";

import { parseCookies } from "nookies";
import { useRouter } from "next/navigation";
import Navbar from "../../../../Components/navbar";
import Ordermanage from "../../../../Components/ordermanage";

// import styles from "../../../../styles/chatPage.module.scss";


export default function Chats({ params }) {
  const { chatId } = params;
  console.log("hXXi", chatId);
  const cookies = parseCookies();
  const myid = cookies.userId;
  return (
    <div>
      <Navbar />
      <Ordermanage />
    </div>
  );
}
