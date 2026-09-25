import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";

interface ErrorAlertProps {
  message: string;
  onRetry: () => void;
  onGoBack?: () => void;
}

export function ErrorAlert({ message, onRetry, onGoBack }: ErrorAlertProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center"
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/15 text-destructive">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-foreground">
        Unable to load directory
      </h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-md">
        {message}
      </p>
      <div className="mt-5 flex items-center gap-2">
        {onGoBack && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onGoBack}
            className="gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go to Root</span>
          </Button>
        )}
        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={onRetry}
          className="gap-1.5"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Try Again</span>
        </Button>
      </div>
    </div>
  );
}
