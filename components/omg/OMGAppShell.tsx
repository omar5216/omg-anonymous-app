import { ReactNode } from 'react';
import { OMGBottomNav } from './OMGBottomNav';

type NavTab = 'home' | 'inbox' | 'settings';

interface OMGAppShellProps {
  children: ReactNode;
  activeTab?: NavTab;
  hideNav?: boolean;
}

export function OMGAppShell({ children, activeTab, hideNav }: OMGAppShellProps) {
  return (
    <div className="omg-grid-bg min-h-screen mx-auto flex flex-col" style={{ maxWidth: 430 }}>
      <div className="flex-1 overflow-y-auto pb-[88px]">
        {children}
      </div>
      {!hideNav && (
        <div className="fixed bottom-0 left-0 right-0 flex justify-center pointer-events-none z-50">
          <div className="w-full pointer-events-auto" style={{ maxWidth: 430 }}>
            <OMGBottomNav active={activeTab} />
          </div>
        </div>
      )}
    </div>
  );
}
