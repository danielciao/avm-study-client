import {
  Checkbox,
  FormControl,
  FormLabel,
  Image,
  Radio,
  RadioGroup,
  Select,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import features from '../assets/property-features.jpg';
import { Card } from '../components';
import { useAppDispatch, useAppState } from '../state';

export const UserInputCard: React.FC = () => {
  const { providedAttributes } = useAppState();
  const dispatch = useAppDispatch();

  return (
    <Card
      image={<Image src={features} alt="Enter property details" width="100%" />}
      title="Additional Details"
    >
      <DropdownInput
        label="Property Type"
        items={[
          { label: 'Detached', value: 'D' },
          { label: 'Semi-Detached', value: 'S' },
          { label: 'Terraced', value: 'T' },
          { label: 'Flats/Maisonettes', value: 'F' },
          { label: 'Other', value: 'O' },
        ]}
        onChange={(payload) =>
          dispatch({ type: 'UPDATE_PROPERTY_TYPE', payload })
        }
      />
      <RadioInput
        label="Tenure"
        items={[
          { label: 'Freehold', value: 'F' },
          { label: 'Leasehold ', value: 'L' },
        ]}
        onChange={(payload) =>
          dispatch({ type: 'UPDATE_PROPERTY_DURATION', payload })
        }
      />
      <DropdownInput
        label="Property Level"
        items={[
          { label: 'Basement', value: 'basement' },
          { label: 'Ground Floor', value: 'ground' },
          { label: 'Lower Floor', value: 'low' },
          { label: 'Mid-Level', value: 'mid-low' },
          { label: 'Mid-to-High', value: 'mid-high' },
          { label: 'Higher Floor', value: 'high' },
          { label: 'Top Floor', value: 'top' },
        ]}
        onChange={(payload) =>
          dispatch({ type: 'UPDATE_FLOOR_LEVEL', payload })
        }
        marginBlockEnd={4}
      />
      <NumberInput
        label="Building Age"
        min={0}
        max={100}
        step={10}
        value={providedAttributes?.EPC_CONSTRUCTION_AGE}
        onChange={(payload) =>
          dispatch({ type: 'UPDATE_BUILDING_AGE', payload })
        }
      />
      <NumberInput
        label="Bedrooms"
        min={0}
        max={5}
        value={providedAttributes?.zoo_num_bed_min}
        onChange={(payload) => dispatch({ type: 'UPDATE_NUM_BED', payload })}
      />
      <NumberInput
        label="Bathrooms"
        min={0}
        max={5}
        value={providedAttributes?.zoo_num_bath_min}
        onChange={(payload) => dispatch({ type: 'UPDATE_NUM_BATH', payload })}
      />
      <NumberInput
        label="Receptions"
        min={0}
        max={3}
        value={providedAttributes?.zoo_num_reception_min}
        onChange={(payload) =>
          dispatch({ type: 'UPDATE_NUM_RECEPTION', payload })
        }
        marginBlockEnd={4}
      />
      <FormControl>
        <FormLabel fontSize={14} fontWeight={700}>
          Other Features:
        </FormLabel>
        <Stack direction="column">
          <Checkbox
            size="sm"
            colorScheme="green"
            onChange={(e) =>
              dispatch({
                type: 'UPDATE_GARAGE',
                payload: e.target.checked,
              })
            }
          >
            Has garage
          </Checkbox>
          <Checkbox
            size="sm"
            colorScheme="green"
            onChange={(e) =>
              dispatch({
                type: 'UPDATE_AUCTION',
                payload: e.target.checked,
              })
            }
          >
            Sell in auction
          </Checkbox>
          <Checkbox
            size="sm"
            colorScheme="green"
            onChange={(e) =>
              dispatch({
                type: 'UPDATE_SHARED_OWNERSHIP',
                payload: e.target.checked,
              })
            }
          >
            Shared ownership
          </Checkbox>
        </Stack>
      </FormControl>
    </Card>
  );
};

function NumberInput(props: {
  label: string;
  min: number;
  max: number;
  step?: number;
  value?: number;
  marginBlockEnd?: number;
  onChange: (value: number) => void;
}) {
  const { label, min, max, value, marginBlockEnd, onChange, step = 1 } = props;

  return (
    <FormControl marginBlockEnd={marginBlockEnd}>
      <FormLabel fontSize={14} fontWeight={700}>
        {label}:
      </FormLabel>
      <Slider
        flex={1}
        size="sm"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
      >
        <SliderTrack>
          <SliderFilledTrack
            background={useColorModeValue('green.500', 'green.400')}
          />
        </SliderTrack>
        <SliderThumb
          fontSize={14}
          fontWeight={700}
          boxSize="24px"
          children={value}
          color="green.700"
        />
      </Slider>
    </FormControl>
  );
}

function DropdownInput(props: {
  label: string;
  items: Array<{ label: string; value: string }>;
  marginBlockEnd?: number;
  onChange: (value: string) => void;
}) {
  const { label, items, marginBlockEnd, onChange } = props;

  return (
    <FormControl marginBlockEnd={marginBlockEnd}>
      <FormLabel fontSize={14} fontWeight={700}>
        {label}:
      </FormLabel>
      <Select
        focusBorderColor={useColorModeValue('green.500', 'green.400')}
        placeholder="Select option"
        colorScheme="green"
        size="sm"
        onChange={(e) => onChange(e.target.value)}
      >
        {items.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </Select>
    </FormControl>
  );
}

function RadioInput(props: {
  label: string;
  selectedValue?: string;
  items: Array<{ label: string; value: string }>;
  marginBlockEnd?: number;
  onChange: (value: string) => void;
}) {
  const { label, selectedValue, items, marginBlockEnd, onChange } = props;

  return (
    <FormControl marginBlockEnd={marginBlockEnd}>
      <FormLabel fontSize={14} fontWeight={700}>
        {label}:
      </FormLabel>
      <RadioGroup onChange={onChange} value={selectedValue}>
        <Stack direction="row">
          {items.map((item) => (
            <Radio
              key={item.value}
              colorScheme="green"
              size="sm"
              value={item.value}
            >
              {item.label}
            </Radio>
          ))}
        </Stack>
      </RadioGroup>
    </FormControl>
  );
}
