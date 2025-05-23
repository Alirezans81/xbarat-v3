import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full h-[100dvh] flex flex-col gap-4 justify-center items-center">
      <LoaderCircle color="primary" className="animate-spin" />
      <span className="text-3xl">Loading ...</span>
    </div>
  );
}
