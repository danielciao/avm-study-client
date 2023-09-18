import {
  Box,
  ChakraProvider,
  Divider,
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Heading,
  IconButton,
  Skeleton,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react';
import '@fontsource/open-sans/700.css';
import '@fontsource/raleway/400.css';
import { LatLngLiteral } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { FaCog, FaMoon, FaSun } from 'react-icons/fa';
import {
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from 'react-leaflet';
import { animated, useSpring } from 'react-spring';
import { useCurrentLocation } from './hooks/useCurrentLocation';
import { useFetch } from './hooks/useFetch';
import { AreaAttribute, EPCItem } from './types';
import { debounce } from './utils';

const AnimatedCircleMarker = animated(CircleMarker);

const { VITE_MAPBOX_USERNAME, VITE_MAPBOX_STYLE_ID, VITE_MAPBOX_ACCESS_TOKEN } =
  import.meta.env;

function LocationMarker(props: {
  location: LatLngLiteral | null;
  setLocation: (location: LatLngLiteral | null) => void;
}) {
  const { location, setLocation } = props;

  const [springProps, setSpringProps] = useSpring(() => ({
    radius: 0,
    config: { tension: 50, friction: 10 },
  }));

  const debouncedSetLocation = debounce((latlng: LatLngLiteral) => {
    setLocation(latlng);
  }, 250);

  useEffect(() => {
    if (location) {
      setSpringProps({ radius: 0, immediate: true });
      setSpringProps({ radius: 100, immediate: false });
    } else {
      setSpringProps({ radius: 0 });
    }
  }, [location, setSpringProps]);

  const map = useMapEvents({
    click(e) {
      debouncedSetLocation(e.latlng);
    },
    contextmenu() {
      setLocation(null);
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
        <Popup>You are here</Popup>
      </Marker>
    </AnimatedCircleMarker>
  );
}

export const App = () => {
  const currentPosition = useCurrentLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');

  const { colorMode, toggleColorMode } = useColorMode();

  const [location, setLocation] = useState<LatLngLiteral | null>(null);

  const tileAttribution =
    colorMode === 'dark'
      ? '&copy; <a href="https://www.mapbox.com/">Mapbox</a>'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const tileUrl =
    colorMode === 'dark'
      ? `https://api.mapbox.com/styles/v1/${VITE_MAPBOX_USERNAME}/${VITE_MAPBOX_STYLE_ID}/tiles/256/{z}/{x}/{y}@2x?access_token=${VITE_MAPBOX_ACCESS_TOKEN}`
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  const { data: epcItems, isLoading: isEpcLoading } = useFetch<Array<EPCItem>>(
    location
      ? `http://localhost:3001/epc?lat=${location?.lat}&lon=${location?.lng}&top=10`
      : null,
    [location],
  );

  const [selectedItem, setSelectedItem] = useState<EPCItem | null>(null);
  const { data: attributes, isLoading: _isAttributeLoading } = useFetch<
    Array<AreaAttribute>
  >(
    selectedItem
      ? `http://localhost:3001/features?lat=${selectedItem.UPRN_LATITUDE}&lon=${selectedItem.UPRN_LONGITUDE}&top=1`
      : null,
    [selectedItem],
  );

  const handleItemClick = (item: EPCItem) => {
    setSelectedItem(item);
    // setLocation({
    //   lat: item.UPRN_LATITUDE, lng: item.UPRN_LONGITUDE
    // });
  };

  useEffect(() => {
    if (epcItems && epcItems.length > 0) {
      onOpen();
      setSelectedItem(null);
    }
  }, [epcItems]);

  return (
    <ChakraProvider>
      <Box pos="relative" h="100vh" zIndex={0}>
        <MapContainer
          center={location ?? currentPosition}
          zoom={12}
          style={{ minHeight: '100vh', minWidth: '100vw' }}
          maxZoom={20}
          attributionControl
          zoomControl
          doubleClickZoom
          scrollWheelZoom
          dragging
          easeLinearity={0.35}
        >
          <TileLayer attribution={tileAttribution} url={tileUrl} />
          <LocationMarker location={location} setLocation={setLocation} />
        </MapContainer>
      </Box>
      <IconButton
        aria-label="Settings"
        icon={<FaCog />}
        pos="absolute"
        top="12px"
        right="12px"
        onClick={onOpen}
        color={useColorModeValue('gray.800', 'white')}
      />
      <Drawer
        placement={isLargerThan768 ? 'right' : 'bottom'}
        onClose={onClose}
        isOpen={isOpen}
        size={isLargerThan768 ? 'sm' : 'full'}
      >
        <DrawerOverlay />
        <DrawerContent overflowY="auto" display="flex" flexDirection="column">
          <Flex
            justify="space-between"
            align="center"
            p={4}
            position="sticky"
            top="0"
            zIndex="sticky"
            background="inherit"
          >
            <Heading size="md">iPredict</Heading>
            <DrawerCloseButton position="relative" top={0} right={0} />
          </Flex>
          <Divider />
          <Flex
            align="center"
            justify="flex-end"
            paddingTop={2}
            paddingInline={4}
            position="sticky"
            top="16"
            zIndex="sticky"
            background="inherit"
          >
            {colorMode === 'dark' ? (
              <IconButton
                aria-label="Switch to light mode"
                icon={<FaSun />}
                onClick={toggleColorMode}
                variant="ghost"
                color={useColorModeValue('gray.800', 'white')}
                _focus={{ outline: 'none' }}
                _hover={{ color: useColorModeValue('gray.600', 'gray.200') }}
              />
            ) : (
              <IconButton
                aria-label="Switch to dark mode"
                icon={<FaMoon />}
                onClick={toggleColorMode}
                variant="ghost"
                color={useColorModeValue('gray.800', 'white')}
                _focus={{ outline: 'none' }}
              />
            )}
          </Flex>

          <Text
            fontSize={{ base: '16px', lg: '18px' }}
            color={useColorModeValue('yellow.500', 'yellow.300')}
            fontWeight={'500'}
            textTransform={'uppercase'}
            mb={'4'}
          >
            Features
          </Text>
          <Stack
            spacing={1}
            overflowY="auto"
            maxHeight="40%"
            minHeight="40%"
            flex="1"
            background={useColorModeValue('gray.50', 'gray.800')}
            boxShadow="inset 0px 0px 10px rgba(0, 0, 0, 0.1)"
          >
            {isEpcLoading
              ? Array.from({ length: 3 }).map((_, index) => (
                <Skeleton
                  key={index}
                  height="40px"
                  isLoaded={isEpcLoading}
                  flexShrink="0"
                >
                  <Box>Loading...</Box>
                </Skeleton>
              ))
              : epcItems?.map((item) => (
                <ListItem
                  key={item.EPC_UPRN}
                  item={item}
                  onClick={() => handleItemClick(item)}
                  isSelected={item.EPC_UPRN === selectedItem?.EPC_UPRN}
                />
              ))}
          </Stack>
          <Stack paddingBlock={2} paddingInline={4} spacing={1}>
            {attributes && (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Label</Th>
                    <Th>Value</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Object.entries(attributes.at(0) ?? []).map(
                    ([label, value]) => (
                      <Tr key={label}>
                        <Td>{label}</Td>
                        <Td>{value}</Td>
                      </Tr>
                    ),
                  )}
                </Tbody>
              </Table>
            )}
          </Stack>
        </DrawerContent>
      </Drawer>
    </ChakraProvider>
  );
};

const ListItem = (props: {
  item: EPCItem;
  onClick: () => void;
  isSelected: boolean;
}) => {
  const { item, onClick, isSelected } = props;

  return (
    <Skeleton isLoaded={!!item} fadeDuration={1} flexShrink="0" display="flex">
      <Box
        as="button"
        onClick={onClick}
        height={9}
        alignItems="center"
        paddingInline={2}
        flex={1}
        textAlign="start"
        borderRadius="none"
        border="none"
        fontSize={14}
        fontWeight={400}
        backgroundColor={isSelected ? 'blue.100' : 'transparent'} // Selected state
        _hover={{
          backgroundColor: 'gray.200', // Hover state
        }}
        _focus={{
          outline: 'none',
        }}
      >
        {item?.EPC_ADDRESS}
      </Box>
    </Skeleton>
  );
};
