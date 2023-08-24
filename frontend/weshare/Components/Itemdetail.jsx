/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/prop-types */
import Image from "next/image";
import { useState } from "react";
import Swal from "sweetalert2";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import Cookies from "js-cookie";
import useGetItem from "../hooks/Item/useGetItem";
import useCreateOrder from "../hooks/Order/useCreateOrder";
import styles from "../styles/itemdetail.module.scss";

export default function Itemdetail({ params }) {
  const itemId = params;
  const { item, isLoading, isError } = useGetItem(itemId);
  const itemTitle = item?.title ?? "";
  const itemBuyerLimit = item?.buyers_limit ?? "";
  const itemImage = item?.image ?? "/user.png";
  const itemIntroduction = item?.introduction ?? "";
  const itemcost = item?.cost ?? "";
  const itemtag = item?.tag ?? "";
  const itemLoaction = item?.location ?? "";
  const itemCreateat = item?.created_at ?? "";
  const itemSellerId = item?.user.id ?? "";
  const itemSellerName = item?.user.name ?? "";
  const itemSellerRating = item?.user.rating ?? "尚未評價";
  const itemSellerPhone = item?.user.phone ?? "";
  const itemSellerImage = item?.user.image ?? "";
  const itemNumOfBuyers = item?.num_of_buyers ?? "";
  const [quantity, setQuantity] = useState(1);
  const { isLoading1, error, order, createOrder, success } = useCreateOrder();
  const authorId = Cookies.get("userId");
  const handleOrder = async () => {
    await createOrder(itemId, quantity);
    if (success) {
      Swal.fire("成功", "訂單成功建立!", "success");
    } else if (error) {
      Swal.fire(
        "錯誤",
        error, // Displaying the error message returned by useCreateOrder hook
        "error"
      );
    }
  };
  const handleIncrement = () => {
    if (quantity < itemNumOfBuyers) setQuantity(quantity + 1);
  };
  const handleDecrement = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };
  return (
    <div>
      <div className={styles.ItemBoard}>
        <div className={styles.rightblock}>
          {isLoading ? (
            <Skeleton className={styles.Pic} width={400} height={400} />
          ) : (
            <Image
              className={styles.Pic}
              src={itemImage}
              alt="ItemPicture"
              width={400}
              height={400}
            />
          )}
        </div>
        <div className={styles.leftblock}>
          <div className={styles.div1}>
            <div className={styles.itemname}>{itemTitle}</div>
            <div className={styles.dateAndTag}>
              <div className={styles.createdate}>{itemCreateat}</div>
              <div className={styles.tags}>{itemtag}</div>
            </div>
          </div>
          <div className={styles.line} />
          <div className={styles.div2}>
            <div className={styles.title}>描述:</div>
            <p className={styles.describe}>{itemIntroduction}</p>
            <div className={styles.title}>
              地點:
              <div className={styles.location}>{itemLoaction}</div>
            </div>
            <div className={styles.title}>
              價格:
              <div className={styles.price}>{itemcost}/1個</div>
            </div>
            <div className={styles.title}>
              剩餘數量:
              <div className={styles.price}>{itemNumOfBuyers}個</div>
            </div>
          </div>

          {/* 條件渲染計數器 */}
          {`${itemSellerId}` !== authorId && (
            <div className={styles.counter}>
              <div className={styles.counterboard}>
                <button
                  type="button"
                  className={styles.plusminus}
                  onClick={handleDecrement}
                >
                  -
                </button>
                <div className={styles.countermiddle}>{quantity}</div>
                <button
                  type="button"
                  className={styles.plusminus}
                  onClick={handleIncrement}
                >
                  +
                </button>
              </div>
            </div>
          )}

          <div className={styles.div3}>
            <div className={styles.seller}>
              <Image
                className={styles.sellerPic}
                src={itemSellerImage}
                alt="SellerPicture"
                width={68}
                height={68}
              />
              <div className={styles.sellerinfo}>
                <div className={styles.sellername}>
                  <Link className={styles.Link} href={`/user/${itemSellerId}`}>
                    {itemSellerName}
                  </Link>
                  &nbsp;&nbsp;
                  <Image
                    className={styles.Pic}
                    src="/star.png"
                    alt="rateicon"
                    width={15}
                    height={15}
                  />
                  &nbsp; {itemSellerRating}
                </div>
                <div className={styles.sellerphone}>{itemSellerPhone}</div>
              </div>
            </div>

            {/* 條件渲染按鈕 */}
            {`${itemSellerId}` !== authorId && (
              <div className={styles.twobtn}>
                <Link className={styles.Link} href={`/chat/${itemSellerId }`}>
                  <button type="button" className={styles.btn}>
                    聯絡買家
                  </button>
                </Link>
                <button
                  type="button"
                  className={styles.btn}
                  onClick={handleOrder}
                >
                  確定下單
                </button>
              </div>
            )}
            {`${itemSellerId}` === authorId && (
              <div className={styles.twobtn}>
                <Link className={styles.Link} href={`/ordermanage/${itemSellerId}`}>
                  <button type="button" className={styles.btn}>
                    查看訂單
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
