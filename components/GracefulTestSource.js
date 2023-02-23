"use client";

import * as React from "react";

export default class GracefulTestSource extends React.Component {
  static getDerivedStateFromError(error) {
    return { error };
  }

  state = { error: null };

  render() {
    const { error } = this.state;
    const { children, path } = this.props;

    if (error !== null) {
      return (
        <details>
          <summary>
            Failed to fetch source for <code>{path.join("/")}</code>
          </summary>

          <pre>{String(error.stack)}</pre>
        </details>
      );
    }

    return (
      <React.Suspense fallback="Loading source code from GitHub">
        {children}
      </React.Suspense>
    );
  }
}
