import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex flex-col justify-center items-center gap-8 py-12 md:py-16 lg:py-20 container mx-auto px-5">
        <span className="capitalize text-4xl sm:text-5xl xl:text-6xl font-bold text-center">
          You Are Enough!
        </span>
        <Skeleton
          className={`w-full h-43 md:h-49 lg:h-43 lg:w-210 rounded-xl`}
        />
        <div className="h-88 flex justify-center items-center">
          <Spinner className="w-10 h-10 text-primary mx-auto" />
        </div>
      </div>
    </div>
  );
}
