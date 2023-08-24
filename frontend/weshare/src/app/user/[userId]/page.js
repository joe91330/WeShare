/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/prop-types */

"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import ReactLoading from "react-loading";
import Navbar from "../../../../Components/navbar";
import Profile from "../../../../Components/profile";
import Itemcard from "../../../../Components/Itemcard";
import useGetProfile from "../../../../hooks/user/useGetProfile";
import useGetBuyItem from "../../../../hooks/Item/useGetBuyItem";
import "./userpage.css";

export default function UserProfile({ params }) {
  const { userId } = params;
  const { user, isLoading, mutateData } = useGetProfile(userId);
  const { data, isLoading1 } = useGetBuyItem();
  const [isActive, setActive] = useState(false);
  const authorId = Cookies.get("userId");

  const toggleActive = () => {
    setActive((prevState) => !prevState);
  };
  if (isLoading) {
    <ReactLoading color="#2D6047" />;
  }
  useEffect(() => {
    mutateData(); // 當 userId 改變時調用 mutateData
  }, [userId, mutateData]);
  const itemsToDisplay = isActive ? data?.items : user?.item;
  console.log(data);
  return (
    <div>
      <Navbar />
      <div className="mainblock">
        <div className="profileblock">
          <Profile params={userId} />
        </div>
        {userId === authorId && (
          <div className="rightblock">
            <div
              className={`toggle-button ${isActive ? "active" : ""}`}
              onClick={toggleActive}
              onKeyUp={toggleActive}
              tabIndex={0}
              role="button"
            >
              <div className="slider" />
              <span className="toggle-text buy-text">Sell</span>
              <span className="toggle-text sell-text">Buy</span>
            </div>
          </div>
        )}
        <div className="itemplace">
          {itemsToDisplay &&
            itemsToDisplay.map((item) => (
              <Itemcard
                key={item.id}
                image={item.image}
                title={item.title}
                cost={item.cost}
                id={item.id}
                isSoldOut={item.num_of_buyers === 0}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
