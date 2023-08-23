/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/prop-types */

"use client";

import { useState } from "react";
import ReactLoading from 'react-loading';
import Navbar from "../../../../Components/navbar";
import Profile from "../../../../Components/profile";
import Itemcard from "../../../../Components/Itemcard";
import useGetProfile from "../../../../hooks/user/useGetProfile";
import "./userpage.css";

export default function UserProfile({ params }) {
  const { userId } = params;
  const { user, isLoading } = useGetProfile(userId);
  const [isActive, setActive] = useState(false);
  const toggleActive = () => {
    setActive((prevState) => !prevState);
  };
  if (isLoading) {
    <ReactLoading type={String} color='#2D6047'  />
  }
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
            <span className="toggle-text sell-text">Sell</span>
            <span className="toggle-text buy-text">Buy</span>
          </div>
        </div>
        <div className="itemplace">
          {user.item.map((item) => (
            <Itemcard
              key={item.id}
              image={item.image}
              title={item.title}
              cost={item.cost}
              id={item.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
