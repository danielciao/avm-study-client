import {
  Box,
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
import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo } from 'react';
import { FaCog } from 'react-icons/fa';
import { MapContainer, TileLayer } from 'react-leaflet';
import touchscreen from './assets/cursor-touchscreen.png';
import houses from './assets/houses.jpg';
import {
  Card,
  EPCListItem,
  LocationMarker,
  PredictButton,
  ThemeSwitcher,
} from './components';
import {
  INITIAL_MAP_ZOOM_LEVEL,
  MAX_MAP_ZOOM_LEVEL,
  MIN_MAP_ZOOM_LEVEL,
  useCurrentLocation,
  useFetch,
} from './hooks';
import { useAppDispatch, useAppState } from './state';
import { EPCItem } from './types';
import {
  EPCCard,
  GreenSpaceAccessCard,
  IMDCard,
  SchoolCard,
  TransportCard,
  UserInputCard,
} from './views';

const {
  VITE_MAPBOX_USERNAME,
  VITE_MAPBOX_STYLE_ID,
  VITE_MAPBOX_ACCESS_TOKEN,
  VITE_API_BASE_URL,
} = import.meta.env;

export const App = () => {
  const currentPosition = useCurrentLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');

  const { location, selectedItem } = useAppState();
  const dispatch = useAppDispatch();

  const tileUrl = useColorModeValue<string, string>(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    `https://api.mapbox.com/styles/v1/${VITE_MAPBOX_USERNAME}/${VITE_MAPBOX_STYLE_ID}/tiles/256/{z}/{x}/{y}@2x?access_token=${VITE_MAPBOX_ACCESS_TOKEN}`,
  );

  const tileAttribution = useColorModeValue<string, string>(
    '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
    '&copy; <a href="https://www.mapbox.com/">Mapbox</a>',
  );

  const { data: epcItems, isLoading: isEpcLoading } = useFetch<Array<EPCItem>>(
    location
      ? `${VITE_API_BASE_URL}/epc?lat=${location?.lat}&lon=${location?.lng}&top=10`
      : null,
    [location],
  );

  const sortedEpcItems = useMemo(
    () => epcItems?.sort((a, b) => a.EPC_ADDRESS.localeCompare(b.EPC_ADDRESS)),
    [epcItems],
  );

  const handleItemClick = async (item: EPCItem) => {
    try {
      const response = await fetch(
        `${VITE_API_BASE_URL}/features?lat=${item.UPRN_LATITUDE}&lon=${item.UPRN_LONGITUDE}&top=1`,
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const [attributes] = await response.json();
      dispatch({
        type: 'UPDATE_SELECTED_ITEM',
        payload: { ...item, ...attributes },
      });
    } catch (error: any) {
      dispatch({ type: 'UPDATE_SELECTED_ITEM', payload: null });
    }
  };

  useEffect(() => {
    if (epcItems && epcItems.length > 0) {
      dispatch({ type: 'UPDATE_SELECTED_ITEM', payload: null });
      onOpen();
    }
  }, [dispatch, onOpen, epcItems]);

  const startCard = (
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
        Select a location on the map to view available addresses for prediction.{' '}
        <strong>Click</strong> to drop a pin.
        <strong>Left-click</strong> to remove the pin.
      </Text>
    </Card>
  );

  const cardStack = (
    <>
      <Card
        image={<Image src={houses} alt="Image of London houses" width="100%" />}
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
            : sortedEpcItems?.map((item) => (
                <EPCListItem
                  key={item.EPC_UPRN}
                  item={item}
                  onClick={() => handleItemClick(item)}
                  isSelected={item.EPC_UPRN === selectedItem?.EPC_UPRN}
                />
              ))}
        </Stack>
      </Card>

      {selectedItem && (
        <>
          <EPCCard item={selectedItem} />
          <TransportCard attribute={selectedItem} />
          <SchoolCard attribute={selectedItem} />
          <GreenSpaceAccessCard attribute={selectedItem} />
          <IMDCard attribute={selectedItem} />
          <UserInputCard />
        </>
      )}
    </>
  );

  return (
    <>
      <Box pos="relative" h="100vh" zIndex={0}>
        <MapContainer
          style={{ minHeight: '100vh', minWidth: '100vw' }}
          minZoom={MIN_MAP_ZOOM_LEVEL}
          maxZoom={MAX_MAP_ZOOM_LEVEL}
          zoom={INITIAL_MAP_ZOOM_LEVEL}
          center={location ?? currentPosition}
          attributionControl
          zoomControl
          doubleClickZoom
          scrollWheelZoom
          dragging
          easeLinearity={0.35}
        >
          <TileLayer attribution={tileAttribution} url={tileUrl} />
          <LocationMarker>You are here!</LocationMarker>
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
            {location == null ? startCard : cardStack}
          </DrawerBody>

          {selectedItem && <PredictButton />}
        </DrawerContent>
      </Drawer>
    </>
  );
};
