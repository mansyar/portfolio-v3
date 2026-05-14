import React, { useState, useEffect, useRef } from 'react';

interface BiosBootProps {
  onComplete: () => void;
}

const BRANDING_LINES = [
  'MANSYAR OS v1.0',
  'Copyright (C) 2026, Mansyar Corp.',
  '',
  'Checking System RAM... 640K OK',
  'Initializing PORTFOLIO.SYS...',
  'Loading Modules... [DONE]',
  'Detecting Viewport... 390x844 (MOBILE)',
  'Entering SAFE MODE...',
  '',
  'READY.',
];

const TOTAL_DURATION = 2000; // 2 seconds

const BiosBoot: React.FC<BiosBootProps> = ({ onComplete }) => {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [isSkipped, setIsSkipped] = useState(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setVisibleLines(BRANDING_LINES);
      setIsSkipped(true);
      onCompleteRef.current();
      return;
    }

    const lineDelay = TOTAL_DURATION / BRANDING_LINES.length;
    let timeoutId: NodeJS.Timeout;

    const showNextLine = (index: number) => {
      if (index < BRANDING_LINES.length) {
        setVisibleLines((prev) => [...prev, BRANDING_LINES[index]]);
        timeoutId = setTimeout(() => showNextLine(index + 1), lineDelay);
      } else {
        onCompleteRef.current();
      }
    };

    showNextLine(0);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className="font-mono text-[#00ff41] bg-black min-h-screen p-4 leading-relaxed uppercase"
    >
      {visibleLines.map((line, index) => (
        <div key={index} className="min-h-[1.5em]">
          {line || '\u00A0'}
          {index === visibleLines.length - 1 && !isSkipped && (
            <span className="inline-block w-2 h-4 bg-[#00ff41] ml-1 animate-pulse" />
          )}
        </div>
      ))}
    </div>
  );
};

export default BiosBoot;
