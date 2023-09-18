import axios from 'axios';
import { LatLngLiteral } from 'leaflet';
import { useEffect, useState } from 'react';

const LONDON: LatLngLiteral = {
  lat: 51.50245862247282,
  lng: -0.1415618433771047,
};

export const useCurrentLocation = () => {
  const [location, setLocation] = useState<LatLngLiteral>(LONDON);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        setLocation({ lat, lng });
      },
      (blocked) => {
        if (blocked) {
          (async () => {
            try {
              const response = await axios.get('https://ipapi.co/json');
              const { latitude: lat, longitude: lng } = response.data;
              setLocation({ lat, lng });
            } catch (err) {
              console.error(err);
            }
          })();
        }
      },
    );
  }, []);

  return location;
};
