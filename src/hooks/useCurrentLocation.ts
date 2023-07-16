import axios from 'axios';
import { LatLngLiteral } from 'leaflet';
import { useEffect, useState } from 'react';

export const useCurrentPosition = () => {
  const [position, setPosition] = useState<LatLngLiteral>({
    lat: 51.50245862247282,
    lng: -0.1415618433771047,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        setPosition({ lat, lng });
      },
      (blocked) => {
        if (blocked) {
          (async () => {
            try {
              const response = await axios.get('https://ipapi.co/json');
              const { latitude: lat, longitude: lng } = response.data;
              setPosition({ lat, lng });
            } catch (err) {
              console.error(err);
            }
          })();
        }
      }
    );
  }, []);

  return position;
};
