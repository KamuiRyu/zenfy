import { AlertCircleIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@ui/alert";
import { cn } from "@/lib/utils";

export function AlertDanger({
  title,
  description,
  className,
}: {
  title?: string;
  description?: React.ReactNode;
className?: string;
}) {
  return (
    <Alert variant="destructive" className={cn("border-destructive",className)}>
      <AlertCircleIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}
