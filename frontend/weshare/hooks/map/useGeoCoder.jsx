import { useState } from 'react';
import axios from 'axios';

const useGeoCoder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getLatLng = async (address) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
        params: {
          address,
          key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, // Replace with your Google API key
        }
      });
      const { lat, lng } = response.data.results[0].geometry.location;
      return { latitude: lat, longitude: lng };
    } catch (err) {
      setError(err.message || "Error fetching coordinates");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getLatLng, loading, error };
};

export default useGeoCoder;
