import React from 'react';
import { useStore } from '@nanostores/react';
import { $forceDesktop } from '@/stores/desktop';

interface ModeContainerProps {
  children: React.ReactNode;
}

const ModeContainer: React.FC<ModeContainerProps> = ({ children }) => {
  const forceDesktop = useStore($forceDesktop);

  return (
    <div className={`group h-full w-full ${forceDesktop ? 'force-desktop' : ''}`}>{children}</div>
  );
};

export default ModeContainer;
