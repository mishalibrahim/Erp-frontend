import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router-dom";
import { Home, RefreshCw, AlertTriangle, ServerCrash } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  const is404 = isRouteErrorResponse(error) && error.status === 404;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient blobs */}
      <div
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, hsl(from var(--primary) h s l / 1), transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full opacity-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, hsl(from var(--destructive) h s l / 1), transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="relative text-center max-w-lg mx-auto">
        {/* Icon */}
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-border bg-card shadow-xl">
          {is404 ? (
            <AlertTriangle className="h-12 w-12 text-amber-500" />
          ) : (
            <ServerCrash className="h-12 w-12 text-destructive" />
          )}
        </div>

        {/* Status code */}
        <p className="text-8xl font-black tracking-tighter text-foreground/10 select-none leading-none mb-2">
          {isRouteErrorResponse(error) ? error.status : "ERR"}
        </p>

        {/* Title */}
        <h1 className="text-2xl font-bold text-foreground mt-2">
          {is404 ? "Page not found" : "Something went wrong"}
        </h1>

        {/* Description */}
        <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
          {is404
            ? "The page you're looking for doesn't exist or has been moved."
            : "An unexpected error occurred. Our team has been notified."}
        </p>

        {/* Error detail (dev/non-404) */}
        {!is404 && (
          <div className="mt-6 rounded-xl border border-border bg-muted/30 px-4 py-3 text-left">
            <p className="text-xs font-mono text-muted-foreground break-all">
              {isRouteErrorResponse(error)
                ? error.statusText
                : error instanceof Error
                ? error.message
                : "Unknown error"}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            size="lg"
            className="w-full sm:w-auto rounded-xl font-semibold shadow-md"
            onClick={() => navigate("/")}
          >
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto rounded-xl font-semibold"
            onClick={() => navigate(-1)}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
