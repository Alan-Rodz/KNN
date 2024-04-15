import { useBreakpointValue } from '@chakra-ui/react';

// ********************************************************************************
export const useIsMdOrBigger = () => useBreakpointValue({ base: false, md: true });
