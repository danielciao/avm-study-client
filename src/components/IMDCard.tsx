import { Image, List, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import imd from '../assets/imd_2019.jpg';
import { AreaAttribute } from '../types';
import { Attribute } from './Attribute';
import { Card } from './Card';

const RatingDisplay: React.FC<{ rating: number }> = ({ rating }) => {
  let color;

  if (rating >= 9) {
    color = useColorModeValue('green.500', 'green.300');
  } else if (rating >= 6) {
    color = useColorModeValue('yellow.500', 'yellow.300');
  } else if (rating >= 3) {
    color = useColorModeValue('orange.500', 'orange.300');
  } else {
    color = useColorModeValue('red.500', 'red.300');
  }

  return (
    <Text as="span" fontWeight={700} fontSize={16} color={color}>
      {rating}
    </Text>
  );
};

interface IMDCardProps {
  attribute: AreaAttribute;
}

export const IMDCard: React.FC<IMDCardProps> = (props) => {
  const { attribute } = props;

  return (
    <Card
      image={<Image src={imd} alt="Image of IMD 2019 Analysis" width="100%" />}
      label="Statistics"
      title="The Index of Multiple Deprivation"
      paddingInline={3}
      paddingBlock={3}
    >
      <List spacing={2}>
        <Attribute
          label="Income"
          value={<RatingDisplay rating={attribute.IMD_IncDecile} />}
        />
        <Attribute
          label="Employment"
          value={<RatingDisplay rating={attribute.IMD_EmpDecile} />}
        />
        <Attribute
          label="Education"
          value={<RatingDisplay rating={attribute.IMD_EduDecile} />}
        />
        <Attribute
          label="Crime"
          value={<RatingDisplay rating={attribute.IMD_CrmDecile} />}
        />
        <Attribute
          label="Barriers to Housing and Services"
          value={<RatingDisplay rating={attribute.IMD_HouseBarDecile} />}
        />
        <Attribute
          label="Environment"
          value={<RatingDisplay rating={attribute.IMD_EnvDecile} />}
        />
      </List>
    </Card>
  );
};
