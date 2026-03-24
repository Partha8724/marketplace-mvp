import * as React from "react";

export function Checkbox(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} type="checkbox" className="h-4 w-4 rounded border-stone-300 text-stone-900 focus:ring-stone-300" />;
}
