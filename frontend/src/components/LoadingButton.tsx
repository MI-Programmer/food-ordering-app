import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

function LoadingButton() {
  return (
    <Button disabled>
      <Loader2 className="mr-2 size-4 animate-spin" />
      Loading
    </Button>
  );
}

export default LoadingButton;
