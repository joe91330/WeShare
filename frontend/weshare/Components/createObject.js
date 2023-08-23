/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

"use client";

import { useState, useRef } from "react";
import Swal from "sweetalert2";
import Image from "next/image";
import styles from "../styles/createObject.module.scss";
import useGeoCoder from "../hooks/map/useGeoCoder";
import useCreateItem from "../hooks/Item/useCreateItem";
import useCreateItemImage from "../hooks/Item/useCreateItemImage";

export default function CreateObject() {
  const { getLatLng } = useGeoCoder();
  const { uploadImage, imageUrl } = useCreateItemImage();
  const { createItem, loading, error, success } = useCreateItem();
  const inputRef = useRef(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [cost, setCost] = useState("");
  const [number, setNumber] = useState("");
  const [tempImageUrl, setTempImageUrl] = useState("");
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
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
      setTempImageUrl(URL.createObjectURL(file)); // 這裡改成設定臨時的URL
      await uploadImage(file);
    }
  };
  const handleSubmit = async () => {
    const coordinates = await getLatLng(location);

    if (!coordinates) {
      // Handle the error in case we don't get lat/lng
      console.error("Unable to fetch coordinates for the location.");
      return;
    }

    const itemData = {
      title,
      tag: category,
      introduction: description,
      location,
      cost,
      buyers_limit: number,
      image: imageUrl,
      ...coordinates,
    };

    createItem(itemData);
  };
  return (
    <div className={styles.wholePage}>
      <div className={styles.titleAndType}>
        <div className={styles.fontType}>標題</div>
        <input
          type="text"
          placeholder="商品名稱"
          className={styles.inputFrame}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className={styles.fontType_right}>類型</div>
        <select
          className={styles.filter}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">選擇類型</option>
          <option value="食品">食品</option>
          <option value="日用品">日用品</option>
          <option value="食物">衣物</option>
          <option value="美妝">美妝</option>
          <option value="家具">家具</option>
          <option value="優惠卷">優惠卷</option>
          <option value="其他">其他</option>
        </select>
      </div>
      <div className={styles.contentAndPic}>
        <div className={styles.fontType}>內容</div>
        <textarea
          className={styles.inputFrame}
          placeholder="物品詳細資訊"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="file"
          style={{ display: "none" }}
          onChange={handleImageChange}
          ref={inputRef}
        />
        <div
          className={styles.uploadPic}
          onClick={() => inputRef.current?.click()}
        >
          {imageUrl ? (
            <Image
              src={tempImageUrl}
              alt="Uploaded Item"
              className={styles.uploadPic1}
              width={250}
              height={200}
            />
          ) : (
            "上傳圖片"
          )}
        </div>
      </div>
      <div className={styles.loactionAndPrice}>
        <div className={styles.fontType}>地點</div>
        <input
          type="text"
          className={styles.inputFrameLocation}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="面交地點"
        />
        <div className={styles.fontType_right}>價格</div>
        <input
          type="text"
          className={styles.inputFramePrice}
          value={cost}
          onChange={(e) => setCost(e.target.value)}
        />
        <div className={styles.fontType_right}>數量</div>
        <input
          type="text"
          className={styles.inputFrameNumber}
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
      </div>

      <button
        type="button"
        className={styles.confirmCreate}
        onClick={handleSubmit}
      >
        確定送出
      </button>
    </div>
  );
}
