import { ReactNode } from 'react';

export const DrawerCSSProvider = ({ children }: { children: ReactNode }) => {
  return (
    <div data-vaul-drawer-wrapper="" className="bg-white">
      <div className="relative flex min-h-screen flex-col bg-white">
        {children}
      </div>
    </div>
  );
};
