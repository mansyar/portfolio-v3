import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { $forceDesktop } from '@/stores/desktop';
import BiosBoot from './BiosBoot';
import TerminalNav from './TerminalNav';

const SafeModeManager: React.FC = () => {
  const [bootComplete, setBootComplete] = useState(false);
  const forceDesktop = useStore($forceDesktop);

  useEffect(() => {
    // If force desktop is enabled, we don't want to show Safe Mode components
    // although visibility is primarily controlled via CSS in index.astro
  }, [forceDesktop]);

  if (forceDesktop) return null;

  return (
    <div className="h-full w-full">
      {!bootComplete ? (
        <BiosBoot onComplete={() => setBootComplete(true)} />
      ) : (
        <TerminalNav onRestart={() => setBootComplete(false)} />
      )}
    </div>
  );
};

export default SafeModeManager;
