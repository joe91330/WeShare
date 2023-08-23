/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable import/no-extraneous-dependencies */
import Image from "next/image";
import ReactStars from "react-stars";
import { useState } from "react";
import Cookies from "js-cookie";
import styles from "../styles/navbar.module.scss";
import useGiveRating from "../hooks/useGiveRating";
import useAgreeOrder from "../hooks/Order/useAgreeOrder";
import useDeleteOrder from "../hooks/Order/useDeleteOrder";

function Notification({ event }) {
  const [rating, setRating] = useState(null);
  const [isOrderConfirmed, setOrderConfirmed] = useState(false);

  const { giveRating } = useGiveRating();
  const { agreeOrder } = useAgreeOrder();
  const { deleteOrder } = useDeleteOrder();

  const authorId = Cookies.get("userId");

  const isSeller =
    event.type === "買家下單通知" && authorId === event.recipient_id.toString();
  const isBuyerRating =
    event.type === "交易成功通知" && authorId === event.recipient_id.toString();

  const handleAgreeOrder = async () => {
    await agreeOrder(event.order.id);
    setOrderConfirmed(true);
  };

  const handleDeleteOrder = async () => {
    await deleteOrder(event.order.id);
  };

  const handleRate = async (newRating) => {
    setRating(newRating);
    await giveRating(event.user.sender_id, newRating);
  };

  return (
    <div>
      <div className={styles.div2}>
        <div className={styles.leftboard}>
          <Image
            className={styles.menu_pic}
            src={event.user.image}
            width={50}
            height={50}
            alt="個人照片"
          />
          <div className={styles.createdtime}>{event.created_at}</div>
        </div>
        <div className={styles.rightboard}>
          <div className={styles.noticontent}>{event.type}</div>

          {isSeller && !isOrderConfirmed && (
            <>
              <div className={styles.noticontent}>
                {event.user.name} 購買 {event.order.quantity} 個{" "}
                {event.order.title}
              </div>
              <div className={styles.twobtn}>
                <button
                  className={styles.confirmbtn}
                  type="button"
                  onClick={handleAgreeOrder}
                >
                  確認訂單
                </button>
                <button
                  className={styles.canclebtn}
                  type="button"
                  onClick={handleDeleteOrder}
                >
                  取消訂單
                </button>
              </div>
            </>
          )}

          {isSeller && isOrderConfirmed && (
            <>
              <div className={styles.noticontent}>
                {event.user.name} 購買 {event.order.quantity} 個{" "}
                {event.order.title}
              </div>
              <div>
                <ReactStars
                  className={styles.giverate}
                  count={5}
                  size={24}
                  color2="#ffd700"
                  value={rating}
                  onChange={handleRate}
                />
              </div>
            </>
          )}

          {isBuyerRating && (
            <>
              <div className={styles.noticontent}>
                {event.user.name} 同意 {event.order.quantity} 個{" "}
                {event.order.title} 訂單
              </div>
              <div>
                <ReactStars
                  className={styles.giverate}
                  count={5}
                  size={24}
                  color2="#ffd700"
                  value={rating}
                  onChange={handleRate}
                />
              </div>
            </>
          )}
        </div>
      </div>
      <div className={styles.notiline} />
    </div>
  );
}

export default Notification;
