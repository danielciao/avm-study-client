import L from 'leaflet';
import 'leaflet-geometryutil';
import { useMemo, useState } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';

export const MIN_MAP_ZOOM_LEVEL = 10;
export const MAX_MAP_ZOOM_LEVEL = 19;
export const INITIAL_MAP_ZOOM_LEVEL = 12;

export const useMapMetersToPixels = (meters: number) => {
  const [zoom, setZoom] = useState(INITIAL_MAP_ZOOM_LEVEL);

  const map = useMap();
  const mapEvents = useMapEvents({
    zoomend: () => setZoom(mapEvents.getZoom()),
  });

  return useMemo(() => {
    const l2 = L.GeometryUtil.destination(map.getCenter(), 90, meters);

    const p1 = map.project(map.getCenter(), zoom);
    const p2 = map.project(l2, zoom);

    return p1.distanceTo(p2);
  }, [map, meters, zoom]);
};
