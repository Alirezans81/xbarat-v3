import { useEffect, useState } from "react";

export function useCurrentTime(interval = 1000) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, interval);

    return () => clearInterval(timer); // Cleanup on unmount
  }, [interval]);

  return time;
}
