import { List, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { EPCItem, EPCRating } from '../types';
import { Attribute } from './Attribute';
import { Card } from './Card';

interface EPCCardProps {
  item: EPCItem;
}

const EPCRatingDisplay: React.FC<{ rating: EPCRating }> = (props) => {
  const { rating } = props;

  const colours = {
    A: useColorModeValue('#D5758C', '#8BC8A5'),
    B: useColorModeValue('#67B65F', '#92CC8E'),
    C: useColorModeValue('#A1D255', '#C0E28D'),
    D: useColorModeValue('#F0DB3F', '#F5EB75'),
    E: useColorModeValue('#E6AF6F', '#EDCAA0'),
    F: useColorModeValue('#D48639', '#E0B079'),
    G: useColorModeValue('#C62743', '#D5758C'),
  };

  return (
    <Text as={'span'} fontWeight={700} fontSize={24} color={colours[rating]}>
      {rating}
    </Text>
  );
};

export const EPCCard: React.FC<EPCCardProps> = (props) => {
  const { item } = props;

  return (
    <Card title="EPC Details" paddingInline={3} paddingBlock={3}>
      <List spacing={2}>
        <Attribute
          label="Current Rating"
          value={<EPCRatingDisplay rating={item.EPC_CURRENT_ENERGY_RATING} />}
        />
        <Attribute label="Property Type" value={item.EPC_PROPERTY_TYPE} />
        <Attribute label="Build Form" value={item.EPC_BUILT_FORM} />
        <Attribute
          label="Floor Area"
          value={<Text as={'span'}>{item.EPC_TOTAL_FLOOR_AREA} m&sup2;</Text>}
        />
        <Attribute
          label="Number of Rooms"
          value={item.EPC_NUMBER_HABITABLE_ROOMS}
        />
        <Attribute
          label="Construction Age Band"
          value={item.EPC_CONSTRUCTION_AGE_BAND}
        />
      </List>
    </Card>
  );
};
