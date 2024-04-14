import { PropsWithChildren } from 'react';

// == Layout ======================================================================
const RootLayout = async ({ children }: PropsWithChildren) =>
  <html lang='en'>
    <body>
      {children}
    </body>
  </html>;

// == Export ======================================================================
export default RootLayout;
