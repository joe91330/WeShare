/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/prop-types */

"use client";

import { useState, useEffect } from "react";
import ReactLoading from "react-loading";
import Navbar from "../../../../Components/navbar";
import Profile from "../../../../Components/profile";
import Itemcard from "../../../../Components/Itemcard";
import useGetProfile from "../../../../hooks/user/useGetProfile";
import "./userpage.css";

export default function UserProfile({ params }) {
  const { userId } = params;
  const { user, isLoading, mutateData } = useGetProfile(userId);
  const [isActive, setActive] = useState(false);
  const toggleActive = () => {
    setActive((prevState) => !prevState);
  };
  if (isLoading) {
    <ReactLoading color="#2D6047" />;
  }
  useEffect(() => {
    mutateData(); // 當 userId 改變時調用 mutateData
  }, [userId, mutateData]);
  return (
    <div>
      <Navbar />
      <div className="mainblock">
        <div className="profileblock">
          <Profile params={userId} />
        </div>
        <div className="rightblock">
          <div
            className={`toggle-button ${isActive ? "active" : ""}`}
            onClick={toggleActive}
            onKeyUp={toggleActive}
            tabIndex={0}
            role="button"
          >
            <div className="slider" />
            <span className="toggle-text buy-text">Buy</span>
            <span className="toggle-text sell-text">Sell</span>
          </div>
        </div>
        <div className="itemplace">
          {user?.item.map(
            (
              item // 使用安全的選擇運算符來確保 user 存在
            ) => (
              <Itemcard
                key={item.id}
                image={item.image}
                title={item.title}
                cost={item.cost}
                id={item.id}
                isSoldOut={item.num_of_buyers === 0}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
