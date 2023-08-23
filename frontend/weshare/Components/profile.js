/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/prop-types */

"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import useSWR, { useSWRConfig ,mutate as swrMutate} from "swr";
import Skeleton from "react-loading-skeleton";
import useGetProfile from "../hooks/user/useGetProfile";
import useGetOrder from "../hooks/Order/useGetOrder";
import useUpdateProfile from "../hooks/user/useUpdateProfile";
import styles from "../styles/profile.module.scss";
import "react-loading-skeleton/dist/skeleton.css";

export default function Profile({ params }) {
  const authorId = Cookies.get("userId");
  const userId = params;

  const { user, isLoading } = useGetProfile(userId);
  const { updateProfile, loading, error, success } = useUpdateProfile(userId);
  const userName = user?.name ?? "";
  const userPhone = user?.phone ?? "";
  const userRating = user?.rating ?? "";
  const userImage = user?.image ?? "/2.png";
  const fileInputRef = useRef(null);
  const { mutate } = useSWRConfig();

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const isImageValid = [".png", ".jpg", ".jpeg"].some((ext) =>
      file.name.endsWith(ext)
    );
  
    if (!isImageValid) {
      Swal.fire(
        "錯誤",
        "請選擇一個有效的圖片格式 (.png, .jpg, .jpeg)",
        "error"
      );
      return;
    }
  
    try {
      const newImageUrl = await updateProfile(file);
      if (newImageUrl) {
        mutate(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
          (data) => ({
              ...data,
              image: newImageUrl
            }),
        );
      }
    } catch {
      console.error("Error updating profile:", error);
    }
  };
  return (
    <div className={styles.wholePage}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }} // This will hide the input
      />
      <div className={styles.picAndName}>
        <div className={styles.Avator} onClick={handleAvatarClick}>
          <Image
            className={styles.myfriendpic}
            src={userImage || "/2.png"}
            alt="icon"
            width={180}
            height={180}
            quality={90}
          />
        </div>

        <div className={styles.nameandfollow}>
          <div className={styles.name}> {userName} </div>
          <div className={styles.follower}>Followers:</div>
          <div className={styles.line} />
        </div>
      </div>
      <div className={styles.tel_num}>
        <b>手機：</b> {userPhone}
      </div>
      <div className={styles.rate_num}>
        <Image src="/star.png" width={22} height={22} alt="" />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        {userRating && userRating !== 0 ? `${userRating}/5` : "尚無評價"}
      </div>
      <div className={styles.twobtn}>
        <button type="button" className={styles.connectbtn}>
          聯絡買家
        </button>
        <button type="button" className={styles.commentbtn}>
          歷史訂單
        </button>
      </div>
    </div>
  );
}
