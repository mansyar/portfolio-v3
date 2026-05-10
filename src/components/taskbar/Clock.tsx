import { useState, useEffect } from 'react';

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

export default function Clock() {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 60000);
    return () => clearInterval(id);
  }, []);

  const hours = pad(time.getHours());
  const minutes = pad(time.getMinutes());

  return (
    <span className="xp-clock">
      {hours}:{minutes}
    </span>
  );
}
