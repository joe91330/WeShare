/* eslint-disable react/prop-types */

"use client";

import Navbar from "../../../../Components/navbar";
import Itemdetail from "../../../../Components/Itemdetail";

export default function ItemProfile({ params }) {
  const { itemId } = params;
  console.log(itemId);
  return (
    <div>
      <Navbar />
      <div className="itemdetail">
        <Itemdetail params={itemId} />
      </div>
    </div>
  );
}
