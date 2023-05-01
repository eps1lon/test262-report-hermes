"use client";
import * as React from "react";
import { ErrorBoundary } from "react-error-boundary";

function ErrorFallback({ error, path }: { error: Error; path: string[] }) {
  return (
    <details>
      <summary>
        Failed to fetch source for <code>{path.join("/")}</code>
      </summary>

      <pre>{String(error.stack)}</pre>
    </details>
  );
}

export default function GracefulTestSource({
  children,
  path,
}: {
  children: React.ReactNode;
  path: string[];
}) {
  return (
    <ErrorBoundary
      fallbackRender={(props) => <ErrorFallback {...props} path={path} />}
    >
      <React.Suspense fallback="Loading source code from GitHub">
        {children}
      </React.Suspense>
    </ErrorBoundary>
  );
}
