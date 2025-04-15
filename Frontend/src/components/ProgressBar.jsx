import { Box, Progress, Text } from '@chakra-ui/react';

const ProgressBar = ({ value }) => {
  // Ensure value is between 0 and 100
  const clampedValue = Math.min(Math.max(0, value), 100);
  
  // Determine color based on progress
  let colorScheme = 'blue';
  if (clampedValue >= 100) {
    colorScheme = 'green';
  } else if (clampedValue >= 75) {
    colorScheme = 'teal';
  } else if (clampedValue >= 50) {
    colorScheme = 'cyan';
  }
  
  return (
    <Box width="100%">
      <Progress 
        value={clampedValue} 
        size="sm" 
        colorScheme={colorScheme} 
        borderRadius="full"
      />
    </Box>
  );
};
export default ProgressBar;