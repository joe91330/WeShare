/* eslint-disable consistent-return */
/* eslint-disable @next/next/no-sync-scripts */
/* eslint-disable react/prop-types */

import Image from "next/image";
import { useState, useEffect, useRef} from "react";
import styles from "../styles/mapsearch.module.scss";

export default function Mapsearch({ onLocationSelect }) {
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [location, setLocation] = useState(null);
  const autoCompleteRef = useRef();
  const inputRef = useRef();
  const options = {
    componentRestrictions: { country: "TW" },
    bounds: location
      ? {
          east: location.lng + 0.01,
          west: location.lng - 0.01,
          south: location.lat - 0.01,
          north: location.lat + 0.01,
        }
      : undefined,
    strictBounds: false,
  };

  useEffect(() => {
    if (!showSearchBox) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }

    autoCompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      options
    );

    function handlePlaceSelect() {
      const addressObject = autoCompleteRef.current.getPlace();
      const address = addressObject.address_components;

      if (address) {
        setLocation({
            lat: addressObject.geometry.location.lat(),
            lng: addressObject.geometry.location.lng(),
        });
        
        if (onLocationSelect) { 
            onLocationSelect({
                lat: addressObject.geometry.location.lat(),
                lng: addressObject.geometry.location.lng(),
            });
        }
      }
    }

    // 監聽地點選擇事件
    autoCompleteRef.current.addListener("place_changed", handlePlaceSelect);

    // 清理: 移除監聽器以避免內存洩漏
    return () => {
      window.google.maps.event.clearInstanceListeners(autoCompleteRef.current);
    };
    
  }, [showSearchBox, onLocationSelect]);

  
  return (
    <div>
      <script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
      />
      <div
        className={
          styles.searchBoard + (showSearchBox ? ` ${styles.active}` : "")
        }
      >
        <button
          type="button"
          className={styles.searchPic}
          onClick={() => setShowSearchBox(!showSearchBox)}
        >
          <Image src="/mapsearch.png" alt="mapsearch" width={50} height={50} />
        </button>
        {showSearchBox && (
          <div>
            <input
              className={styles.searchbox}
              type="text"
              id="search-input"
              placeholder="搜尋"
              autoComplete="off"
              ref={inputRef}
            />
          </div>
        )}
      </div>
    </div>
  );
}
