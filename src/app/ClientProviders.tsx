'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { FC, PropsWithChildren } from 'react';

// ********************************************************************************
// == Component ===================================================================
export const ClientProviders: FC<PropsWithChildren> = ({ children }) =>
  <ChakraProvider>
    {children}
  </ChakraProvider>;
