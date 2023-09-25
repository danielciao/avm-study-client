import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/700.css';
import { LatLngLiteral } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { PropsWithChildren, useEffect } from 'react';
import { CircleMarker, Marker, Popup, useMapEvents } from 'react-leaflet';
import { animated, useSpring } from 'react-spring';
import { useMapMetersToPixels, usePreviousValue } from '../hooks';
import { useAppDispatch, useAppState } from '../state';
import { debounce } from '../utils';

const AREA_RADIUS = 804; // 0.5 miles, 10 minutes walking

const AnimatedCircleMarker = animated(CircleMarker);

export function LocationMarker(props: PropsWithChildren) {
  const { children } = props;

  const { location } = useAppState();
  const dispatch = useAppDispatch();

  const areaRadius = useMapMetersToPixels(AREA_RADIUS);
  const prevAreaRadius = usePreviousValue(areaRadius);

  const [springProps, api] = useSpring(() => ({
    from: { radius: 0 },
    config: { tension: 50, friction: 10 },
  }));

  const debouncedSetLocation = debounce(
    (nextLocation: LatLngLiteral | null) => {
      dispatch({ type: 'UPDATE_LOCATION', payload: nextLocation });

      if (nextLocation) {
        api.start({
          from: { radius: 0 },
          to: { radius: areaRadius },
        });
      }
    },
    250,
  );

  useEffect(() => {
    if (areaRadius !== prevAreaRadius) {
      api.start({
        from: { radius: prevAreaRadius },
        to: { radius: areaRadius },
      });
    }
  }, [api, areaRadius, prevAreaRadius]);

  const map = useMapEvents({
    click(e) {
      debouncedSetLocation(e.latlng);
    },
    contextmenu() {
      dispatch({ type: 'UPDATE_LOCATION', payload: null });
    },
    locationfound(e) {
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return location === null ? null : (
    <AnimatedCircleMarker
      center={location}
      pathOptions={{ color: 'green', weight: 0.5 }}
      radius={springProps.radius}
    >
      <Marker position={location}>
        <Popup>{children}</Popup>
      </Marker>
    </AnimatedCircleMarker>
  );
}
