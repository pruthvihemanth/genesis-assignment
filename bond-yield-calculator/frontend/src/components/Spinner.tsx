import React from 'react';

export function Spinner(): React.ReactElement {
  return (
    <div
      className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600"
      role="status"
      aria-label="Loading"
    />
  );
}
