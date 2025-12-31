import { Spinner } from "@/components/ui/spinner";

export default function loading() {
  return (
    <div className="w-full py-70 flex justify-center items-center">
      <Spinner className="w-16 h-16 text-primary" />
    </div>
  );
}
