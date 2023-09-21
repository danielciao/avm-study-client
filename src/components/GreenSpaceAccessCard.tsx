import { Image, List, Text } from '@chakra-ui/react';
import React from 'react';
import park from '../assets/park.jpg';
import { AreaAttribute } from '../types';
import { Attribute } from './Attribute';
import { Card } from './Card';

interface GreenSpaceAccessCardProps {
  attribute: AreaAttribute;
}

export const GreenSpaceAccessCard: React.FC<GreenSpaceAccessCardProps> = (
  props,
) => {
  const { attribute } = props;

  return (
    <Card
      image={<Image src={park} alt="Image of London Park" width="100%" />}
      label="Statistics"
      title="Green Space Access"
      paddingInline={3}
      paddingBlock={3}
    >
      <List spacing={2}>
        <Attribute
          label="House With Garden"
          value={attribute.PGN_HouseWithPOS}
        />
        <Attribute
          label="House With Garden Percentage"
          value={
            <Text as={'span'}>
              {(attribute.PGN_HouseWithPOSPct * 100).toFixed(2)}%
            </Text>
          }
        />
        <Attribute
          label="Total House Garden Area"
          value={<Text as={'span'}>{attribute.PGN_HouseTotalPOS} m&sup2;</Text>}
        />
        <Attribute label="Flat With Garden" value={attribute.PGN_FlatWithPOS} />
        <Attribute
          label="Flat With Garden Percentage"
          value={
            <Text as={'span'}>
              {(attribute.PGN_FlatWithPOSPct * 100).toFixed(2)}%
            </Text>
          }
        />
        <Attribute
          label="Total Flat Garden Area"
          value={<Text as={'span'}>{attribute.PGN_FlatTotalPOS} m&sup2;</Text>}
        />
      </List>
    </Card>
  );
};
