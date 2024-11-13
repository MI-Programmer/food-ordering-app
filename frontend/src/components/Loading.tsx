import { Loader2 } from "lucide-react";

function Loading() {
  return (
    <div className="flex justify-center">
      <Loader2 className="size-10 animate-spin text-orange-500" />
    </div>
  );
}

export default Loading;
