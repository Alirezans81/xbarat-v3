import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex flex-col justify-center items-center gap-8 py-36 container mx-auto px-5">
        <span className="capitalize text-6xl font-bold">
          when you are enough!
        </span>
        <Skeleton className={`lg:h-47.5 lg:w-210 rounded-xl`} />
      </div>
    </div>
  );
}
