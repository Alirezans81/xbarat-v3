import { useCurrentTime } from "@/hooks/use-time";

export default function Timer() {
  const currentTime = useCurrentTime();

  return (
    <span className="text-foreground">{currentTime.toLocaleTimeString()}</span>
  );
}
