/* eslint-disable jsx-a11y/mouse-events-have-key-events */

/* eslint-disable react/prop-types */
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Itemcard.module.scss";

export default function Itemcard({
  id,
  image,
  title,
  cost,
  onPicClick,
  onMouseOver,
  onMouseOut,
  isSoldOut = false,
}) {
  return (
    <div>
      <div className={styles.ItemBoard}>
      {isSoldOut && <div className={styles.done}>已售完</div>}
        <button
          className={styles.ItemPic}
          onClick={onPicClick ? () => onPicClick(id) : undefined}
          onMouseOver={onMouseOver ? () => onMouseOver(id) : undefined}
          onMouseOut={onMouseOut || undefined}
          type="button"
        >
          <Image
            className={styles.Pic}
            src={`${image}`}
            alt="ItemPicture"
            width={244}
            height={230}
          />
        </button>
        <div className={styles.ItemDetail}>
          <div className={styles.ItemDetailName}>物品: {title}</div>
          <div className={styles.ItemDetailPrice}>價格: {cost}元/個</div>
        </div>
        
        <Link href={`/Item/${id}`}>
          <div className={styles.more}>更多</div>
        </Link>
      </div>
    </div>
  );
}
