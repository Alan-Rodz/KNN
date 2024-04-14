import { PropsWithChildren } from 'react';

import { ClientProviders } from './ClientProviders';

// == Layout ======================================================================
const RootLayout = async ({ children }: PropsWithChildren) =>
  <html lang='en'>
    <body>
      <ClientProviders>
        {children}
      </ClientProviders>
    </body>
  </html>;

// == Export ======================================================================
export default RootLayout;
