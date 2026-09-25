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
      className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-8 text-center"
    >
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-muted text-foreground">
        <AlertCircle className="h-5 w-5" />
      </div>
      <h3 className="text-sm font-semibold text-foreground">
        Unable to load directory
      </h3>
      <p className="mt-1 text-xs text-muted-foreground max-w-md">
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
            <ArrowLeft className="h-3.5 w-3.5" />
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
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Try Again</span>
        </Button>
      </div>
    </div>
  );
}
