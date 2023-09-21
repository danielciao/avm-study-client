import { Image, List } from '@chakra-ui/react';
import React from 'react';
import bus from '../assets/bus.jpg';
import { AreaAttribute } from '../types';
import { Attribute } from './Attribute';
import { Card } from './Card';

interface TransportCardProps {
  attribute: AreaAttribute;
}

export const TransportCard: React.FC<TransportCardProps> = (props) => {
  const { attribute } = props;

  return (
    <Card
      image={<Image src={bus} alt="Image of London transport" width="100%" />}
      label="Amenities"
      title="Public Transport"
      paddingInline={3}
      paddingBlock={3}
    >
      <List spacing={2}>
        <Attribute
          label="Nearby Bus Stops"
          value={attribute.NPT_NearbyBusStops}
        />
        <Attribute
          label="Nearby Bus Tube/Tram Stops"
          value={attribute.NPT_NearbyTramMetroStops}
        />
        <Attribute
          label="Nearby Train Stops"
          value={attribute.NPT_NearbyRailStops}
        />
      </List>
    </Card>
  );
};
