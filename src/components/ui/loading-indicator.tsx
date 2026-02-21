import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/front/utils/tailwind";

type Props = {
  className?: string;
  label?: string;
};

const LoadingIndicator = ({ className, label = "Loading..." }: Props) => {
  return (
    <div className={cn("flex items-center gap-2 text-sm text-muted-foreground", className)}>
      <Spinner className="size-4" />
      <span>{label}</span>
    </div>
  );
};

export default LoadingIndicator;
