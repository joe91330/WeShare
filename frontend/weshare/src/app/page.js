/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable import/no-extraneous-dependencies */

"use client";

import { useState, useEffect } from "react";
import Cookie from "js-cookie";
import Navbar from "../../Components/navbar";
import Map from "../../Components/Map";
import Mapsearch from "../../Components/Mapsearch";
import Itemcard from "../../Components/Itemcard";
import useGetAllItems from "../../hooks/Item/useGetAllItem";

const GEOCODING_ENDPOINT = "https://maps.googleapis.com/maps/api/geocode/json";
function getLatLngFromAddress(address, apiKey) {
  const requestURL = `${GEOCODING_ENDPOINT}?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`;

  return fetch(requestURL)
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "OK") {
        const { location } = data.results[0].geometry;
        return location;
      }
      throw new Error(`Failed to geocode address. Status: ${data.status}`);
    });
}
export default function Home() {
  const [itemAddress, setItemAddress] = useState(null);
  const [itemLocations, setItemLocations] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [searchValue, setSearchValue] = useState('');
  const userLocationFromCookie = Cookie.get("userLocation")
    ? JSON.parse(Cookie.get("userLocation"))
    : null;
  const [focusedLocation, setFocusedLocation] = useState(
    userLocationFromCookie
  );
  const [zoom, setZoom] = useState(0); // 初始化為12或您的初始放大值
  const [hoveredItemId, setHoveredItemId] = useState(null);

  const handleFilterChange = (value) => {
    setSelectedFilter(value);
  };
  const handleSearchChange = (value) => {
    setSearchValue(value);
  };
  const { items, isLoading, error } = useGetAllItems({ keyword: searchValue ,tag:selectedFilter});
  useEffect(() => {
    if (items) {
      const newLocations = items.map((item) => ({
        lat: item.latitude,
        lng: item.longitude,
        id: item.id,
        title: item.title,
        cost: item.cost,
        image: item.image,
      }));

      setItemLocations(newLocations);
    }
  }, [items]);
  const focusOnItem = (itemId) => {
    const focusedItem = itemLocations.find((item) => item.id === itemId);
    if (focusedItem) {
      setFocusedLocation({ lat: focusedItem.lat, lng: focusedItem.lng });
    }
  };

  const clearAddress = () => {
    setItemAddress(null);
  };

  return (
    <div>
      <Navbar onSearchChange={setSearchValue} onFilterChange={setSelectedFilter} />
      <div className="main">
        <div className="mapsearch">
          <Mapsearch />
        </div>
        <Map
          address={itemAddress}
          itemLocations={itemLocations}
          onMapClick={clearAddress}
          selectedItemId={selectedItemId}
          focusedLocation={focusedLocation}
          setZoom={setZoom}
          hoveredItemId={hoveredItemId}
        />

        <div className="itemplace">
          {isLoading && <p>Loading items...</p>}
          {error && <p>Error fetching items: {error.message}</p>}
          {items &&
            items.map((item) => (
              <Itemcard
                key={item.id}
                image={item.image || "/1.png"}
                title={item.title}
                cost={item.cost}
                id={item.id}
                onPicClick={focusOnItem}
                onMouseOver={() => {
                  setHoveredItemId(item.id);
                }}
                onMouseOut={() => setHoveredItemId(null)}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
