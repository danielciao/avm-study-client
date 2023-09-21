import { Image, List, Text } from '@chakra-ui/react';
import React from 'react';
import school from '../assets/school.jpg';
import { AreaAttribute } from '../types';
import { Attribute } from './Attribute';
import { Card } from './Card';

interface SchoolCardProps {
  attribute: AreaAttribute;
}

export const SchoolCard: React.FC<SchoolCardProps> = (props) => {
  const { attribute } = props;

  return (
    <Card
      image={<Image src={school} alt="Image of Dulwich College" width="100%" />}
      label="Amenities"
      title="Public Schools"
      paddingInline={3}
      paddingBlock={3}
    >
      <List spacing={2}>
        <Attribute
          label="Nearby Academies"
          value={attribute.SCH_NearbyAcademies}
        />
        <Attribute
          label="Nearby Independent Schools"
          value={attribute.SCH_NearbyIndependentSchools}
        />
        <Attribute
          label="Nearby Nurseries"
          value={attribute.SCH_NearbyNurserySchools}
        />
        <Attribute
          label="Nearby Primary Schools"
          value={attribute.SCH_NearbyPrimarySchools}
        />
        <Attribute
          label="Nearby Secondary Schools"
          value={attribute.SCH_NearbySecondarySchools}
        />
        <Attribute
          label="Nearby Outstanding Schools"
          value={
            <Text as={'span'} fontWeight={700} fontSize={16} color="green.400">
              {attribute.SCH_NearbyOutstandingSchools}
            </Text>
          }
        />
        <Attribute
          label="Nearby Good Schools"
          value={
            <Text as={'span'} fontWeight={700} fontSize={16} color="green.400">
              {attribute.SCH_NearbyGoodSchools}
            </Text>
          }
        />
        <Attribute
          label="Nearby Inadequate Schools"
          value={
            <Text as={'span'} fontWeight={700} fontSize={16} color="yellow.500">
              {attribute.SCH_NearbyInadequateSchools}
            </Text>
          }
        />
      </List>
    </Card>
  );
};
