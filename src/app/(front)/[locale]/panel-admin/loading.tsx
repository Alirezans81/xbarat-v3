import { Spinner } from "@/components/ui/spinner";

export default function loading() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <Spinner className="w-12 h-12 text-primary" />
    </div>
  );
}
