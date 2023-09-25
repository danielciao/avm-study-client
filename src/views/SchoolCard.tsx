import { Image, List, Text } from '@chakra-ui/react';
import React from 'react';
import school from '../assets/school.jpg';
import { Attribute, Card } from '../components';
import { AreaAttribute } from '../types';

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
        <Attribute label="Nearby Academies" value={attribute.SCH_ACAD} />
        <Attribute
          label="Nearby Independent Schools"
          value={attribute.SCH_IND}
        />
        <Attribute label="Nearby Nurseries" value={attribute.SCH_NURSERY} />
        <Attribute
          label="Nearby Primary Schools"
          value={attribute.SCH_PRIMARY}
        />
        <Attribute
          label="Nearby Secondary Schools"
          value={attribute.SCH_SECONDARY}
        />
        <Attribute
          label="Nearby Outstanding Schools"
          value={
            <Text as={'span'} fontWeight={700} fontSize={16} color="green.400">
              {attribute.SCH_OUTSTANDING}
            </Text>
          }
        />
        <Attribute
          label="Nearby Good Schools"
          value={
            <Text as={'span'} fontWeight={700} fontSize={16} color="green.400">
              {attribute.SCH_GOOD}
            </Text>
          }
        />
        <Attribute
          label="Nearby Inadequate Schools"
          value={
            <Text as={'span'} fontWeight={700} fontSize={16} color="yellow.500">
              {attribute.SCH_INADEQUATE}
            </Text>
          }
        />
      </List>
    </Card>
  );
};
