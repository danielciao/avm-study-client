import {
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Heading,
  IconButton,
  Image,
  Skeleton,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react';
import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/700.css';
import { LatLngLiteral } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Fragment, useEffect, useState } from 'react';
import { FaCog } from 'react-icons/fa';
import {
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from 'react-leaflet';
import { animated, useSpring } from 'react-spring';
import touchscreen from './assets/cursor-touchscreen.png';
import houses from './assets/houses.jpg';
import { Card } from './components/Card';
import { EPCCard } from './components/EPCCard';
import { GreenSpaceAccessCard } from './components/GreenSpaceAccessCard';
import { IMDCard } from './components/IMDCard';
import { SchoolCard } from './components/SchoolCard';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { TransportCard } from './components/TransportCard';
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

  const [location, setLocation] = useState<LatLngLiteral | null>(null);
  const [selectedItem, setSelectedItem] = useState<EPCItem | null>(null);

  const tileAttribution = useColorModeValue(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    '&copy; <a href="https://www.mapbox.com/">Mapbox</a>',
  );
  const tileUrl = useColorModeValue(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    `https://api.mapbox.com/styles/v1/${VITE_MAPBOX_USERNAME}/${VITE_MAPBOX_STYLE_ID}/tiles/256/{z}/{x}/{y}@2x?access_token=${VITE_MAPBOX_ACCESS_TOKEN}`,
  );

  const { data: epcItems, isLoading: isEpcLoading } = useFetch<Array<EPCItem>>(
    location
      ? `http://localhost:3001/epc?lat=${location?.lat}&lon=${location?.lng}&top=10`
      : null,
    [location],
  );

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
    <>
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
        <DrawerContent
          overflowY="auto"
          display="flex"
          flexDirection="column"
          background={useColorModeValue('gray.100', 'gray.700')}
          backgroundImage={useColorModeValue(
            'linear-gradient(rgba(250, 250, 250, 0.1), rgba(150, 150, 150, 0.5))',
            'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.2))',
          )}
        >
          <Flex
            justify="space-between"
            align="center"
            padding={4}
            position="sticky"
            zIndex="sticky"
            top="0"
            background={useColorModeValue('#EEF1F5', '#191B24')}
          >
            <Box as={'header'}>
              <Heading
                lineHeight={1.1}
                fontSize={{ base: '2xl', sm: '3xl', lg: '4xl' }}
              >
                iPredict
              </Heading>
              <Text
                color={useColorModeValue('gray.800', 'gray.400')}
                fontWeight={300}
                fontSize={'xl'}
              >
                London AVM Experiment
              </Text>
            </Box>
            <DrawerCloseButton position="absolute" top={4} right={4} />
          </Flex>
          <Divider borderColor={useColorModeValue('gray.400', 'gray.700')} />
          <Flex
            align="center"
            justify="flex-end"
            paddingBlock={1}
            paddingInline={4}
            boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
            background="transparent"
          >
            <ThemeSwitcher />
          </Flex>
          <DrawerBody flex="1" padding={0} paddingBlockStart={4}>
            {location == null ? (
              <Card
                image={
                  <Image
                    src={touchscreen}
                    alt="Touch to select location"
                    boxSize={116}
                    paddingBlockStart={4}
                    paddingInlineStart={4}
                  />
                }
                title="Start with your location"
                label="Welcome!"
              >
                <Text color="gray.500">
                  Select a location on the map to view available addresses for
                  prediction. <strong>Click</strong> to drop a pin.
                  <strong>Left-click</strong> to remove the pin.
                </Text>
              </Card>
            ) : (
              <>
                <Card
                  image={
                    <Image
                      src={houses}
                      alt="Image of London houses"
                      width="100%"
                    />
                  }
                  label="Select an address"
                  paddingInline={3}
                  paddingBlockEnd={3}
                >
                  <Stack
                    spacing={1}
                    background={useColorModeValue('gray.50', 'gray.800')}
                    boxShadow="inset 0px 0px 10px rgba(0, 0, 0, 0.1)"
                    maxHeight={150}
                    overflow="auto"
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
                            isSelected={
                              item.EPC_UPRN === selectedItem?.EPC_UPRN
                            }
                          />
                        ))}
                  </Stack>
                </Card>

                {selectedItem && (
                  <>
                    <EPCCard item={selectedItem} />
                    {attributes &&
                      attributes.map((attribute, i) => (
                        <Fragment key={i}>
                          <TransportCard attribute={attribute} />
                          <SchoolCard attribute={attribute} />
                          <GreenSpaceAccessCard attribute={attribute} />
                          <IMDCard attribute={attribute} />
                        </Fragment>
                      ))}
                  </>
                )}
              </>
            )}
          </DrawerBody>

          {selectedItem && (
            <>
              <Box
                paddingBlock={4}
                paddingInline={8}
                boxShadow="0px -4px 10px rgba(0, 0, 0, 0.1)"
              >
                <Button colorScheme="green" w="100%">
                  See Predicted Price
                </Button>
              </Box>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
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
