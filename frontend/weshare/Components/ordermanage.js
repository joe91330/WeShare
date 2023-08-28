// import Image from "next/image";
// import Link from "next/link";

"use client";

import { useState } from "react";
import styles from "../styles/ordermanage.module.scss";
import useGetOrder from "../hooks/Order/useGetOrder";

export default function Ordermanage() {
  const { buyHistory, sellHistory } = useGetOrder();
  const [historyStatus, sethistoryStatus] = useState(true);
  const toggleActive = () => {
    sethistoryStatus((prevState) => !prevState);
  };

  return (
    <div className={styles.outborder}>

      <div
        role="button"
        tabIndex={0}
        className={`${styles.outbutton} ${historyStatus ? styles.active : ""}`}
        onClick={toggleActive}
        onKeyUp={toggleActive}
      >
        <span className={styles.toggleText}>
          <span
            className={styles.buyText}
            style={{ color: historyStatus ? "#fff" : "#000" }}
          >
            Buy
          </span>
          <span
            className={styles.sellText}
            style={{ color: historyStatus ? "#000" : "#fff" }}
          >
            Sell
          </span>
        </span>
      </div>

      <div className={styles.border}>
        {historyStatus ? (
          <div className={styles.buySellRecord}>購買記錄</div>
        ) : (
          <div className={styles.buySellRecord}>販賣記錄</div>
        )}
        <div className={styles.longLine} />
        <table className={styles.grid}>
          <tr>
            <th>商品</th>
            <th>價錢</th>
            <th>數量</th>
            <th>賣家</th>
            <th>評分</th>
            <th>地點</th>
          </tr>
          {historyStatus
            ? buyHistory?.map((history) => (
                <tr>
                  <td>{history.item.title}</td>
                  <td>{history.item.cost}</td>
                  <td>{history.quantity}</td>
                  <td>{history.user.name}</td>
                  <td>{history.user.rating}</td>
                  <td>{history.item.location}</td>
                </tr>
              ))
            : sellHistory?.map((history) => (
                <tr>
                  <td>{history.item.title}</td>
                  <td>{history.item.cost}</td>
                  <td>{history.quantity}</td>
                  <td>{history.user.name}</td>
                  <td>{history.user.rating}</td>
                  <td>{history.item.location}</td>
                </tr>
              ))}
        </table>
      </div>
    </div>
  );
}
