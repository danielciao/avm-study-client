import {
  Box,
  Button,
  Text,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/700.css';
import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo, useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { useAppState } from '../state';
import { Prediction, UserProvidedAttributes } from '../types';

const { VITE_API_BASE_URL } = import.meta.env;

const convertBorough = (borough: string) =>
  borough === 'Westminster' ? 'CITY OF WESTMINSTER' : borough.toUpperCase();

const areInputsValid = (
  attribute: Partial<UserProvidedAttributes> | null,
): attribute is UserProvidedAttributes => {
  return (
    Boolean(attribute?.PPD_PropertyType) &&
    Boolean(attribute?.PPD_Duration) &&
    Boolean(attribute?.EPC_FLOOR_LEVEL) &&
    attribute?.zoo_num_bed_min != null &&
    attribute?.zoo_num_bath_min != null &&
    attribute?.zoo_num_reception_min != null
  );
};

export const PredictButton = () => {
  const { selectedItem, providedAttributes } = useAppState();
  const [prediction, setPrediction] = useState<Prediction | null>(null);

  const isValid = useMemo(
    () => areInputsValid(providedAttributes),
    [providedAttributes],
  );

  useEffect(() => {
    setPrediction(null);
  }, [selectedItem]);

  const handleButtonClick = async () => {
    if (selectedItem && areInputsValid(providedAttributes)) {
      const today = new Date();

      const features = {
        ...selectedItem,
        ...providedAttributes,
        RATE_2Y_75BTL: 5.94,
        PPD_OldNew: providedAttributes.EPC_CONSTRUCTION_AGE < 5,
        PPD_TransferDate: today.getTime(),
        PPD_District: convertBorough(selectedItem.CPO_BOROUGH),
        ENG_BedroomRatio:
          providedAttributes.zoo_num_bed_min /
          selectedItem.EPC_NUMBER_HABITABLE_ROOMS,
        ENG_BathroomRatio:
          providedAttributes.zoo_num_bath_min /
          selectedItem.EPC_NUMBER_HABITABLE_ROOMS,
        zoo_garage: Boolean(providedAttributes.zoo_garage),
        zoo_auction: Boolean(providedAttributes.zoo_auction),
        zoo_shared_ownership: Boolean(providedAttributes.zoo_shared_ownership),
        zoo_duration: null,
      };

      try {
        const response = await fetch(`${VITE_API_BASE_URL}/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(features),
        });

        if (response.ok) {
          const result = await response.json();
          setPrediction(result.prediction);
        } else {
          console.error('Server responded with', response.status);
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    }
  };

  return (
    <Box
      paddingBlock={4}
      paddingInline={8}
      boxShadow="0px -4px 10px rgba(0, 0, 0, 0.1)"
    >
      <Button
        colorScheme="green"
        onClick={handleButtonClick}
        isDisabled={!isValid}
        w="100%"
      >
        {prediction != null ? (
          <ReadablePrediction prediction={prediction} />
        ) : isValid ? (
          'See Predicted Price'
        ) : (
          'Complete Additional Details'
        )}
      </Button>
    </Box>
  );
};

function ReadablePrediction(props: { prediction: Prediction }) {
  const { prediction } = props;

  const tooltipBackground = useColorModeValue('green.800', 'green.500');
  const tooltip = (
    <Box
      as="span"
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      lineHeight={1}
      gap={1}
    >
      <Text as="span">{`[${formatPrice(prediction.lower_bound)} - ${formatPrice(
        prediction.upper_bound,
      )}]`}</Text>
      <Text as="span">(80% Confidence)</Text>
    </Box>
  );

  return (
    <Box
      as="span"
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      lineHeight="1"
    >
      <Text as="span">{formatPrice(prediction.prediction)}&nbsp;</Text>
      <Tooltip
        label={tooltip}
        bg={tooltipBackground}
        fontSize="sm"
        px={4}
        paddingTop={2}
        paddingBottom={3}
        isOpen
        hasArrow
      >
        <span>
          <FaInfoCircle />
        </span>
      </Tooltip>
    </Box>
  );
}

function formatPrice(value: number) {
  return value.toLocaleString('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
