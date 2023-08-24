/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/prop-types */

"use client";

import styles from "../styles/ordermanage.module.scss";
import useGetItemOrder from "../hooks/Order/useGetItemOrder";

export default function Lookfororder({ itemid }) {
  console.log(itemid);
  const { data, error, isLoading } = useGetItemOrder(itemid);
  console.log(data);
  return (
    <div className={styles.outborder}>
      <div className={styles.border}>
        <div className={styles.buySellRecord}>訂單記錄</div>
        <div className={styles.longLine} />
        <table className={styles.grid}>
          <tr>
            <th>買家</th>
            <th>數量</th>
            <th>電話</th>
            <th>買家評分</th>
          </tr>

          {data && data.order ? (
            data.order.map((orderItem) => (
              <tr key={orderItem.id}>
                <td>{orderItem.user.name}</td>
                <td>{orderItem.quantity}</td>
                <td>{orderItem.user.phone}</td>
                <td>{orderItem.user.rating}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">沒有訂單資訊</td>
            </tr>
          )}
        </table>
      </div>
    </div>
  );
}
