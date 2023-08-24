/* eslint-disable react/prop-types */
// import PropTypes from "prop-types";

"use client";

import Navbar from "../../../../Components/navbar";
import Lookfororder from "../../../../Components/lookfor";
import styles from "./page.module.scss";

export default function lookfororder({ params }) {
  const { itemid } = params;
  console.log(itemid)
  return (
    <div className={styles.layout}>
      <Navbar />
      <Lookfororder itemid={itemid} />
    </div>
  );
}
