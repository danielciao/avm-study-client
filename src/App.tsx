import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useCurrentPosition } from "./hooks/useCurrentLocation";

const { VITE_MAPBOX_USERNAME, VITE_MAPBOX_STYLE_ID, VITE_MAPBOX_ACCESS_TOKEN } = import.meta.env;

export const App = () => {
  const position = useCurrentPosition();

  return (
    <MapContainer
      center={position}
      zoom={12}
      scrollWheelZoom={true}
      style={{ minHeight: "100vh", minWidth: "100vw" }}
    >
      <TileLayer
        attribution='Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
        url={`https://api.mapbox.com/styles/v1/${VITE_MAPBOX_USERNAME}/${VITE_MAPBOX_STYLE_ID}/tiles/256/{z}/{x}/{y}@2x?access_token=${VITE_MAPBOX_ACCESS_TOKEN}`}
      />
      <Marker position={position}>
        <Popup>
          Popup!
        </Popup>
      </Marker>
    </MapContainer>
  );
};
