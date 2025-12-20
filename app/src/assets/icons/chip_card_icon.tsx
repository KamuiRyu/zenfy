import React from "react";

export default function ChipCardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      role="img"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
      {...props}
    >
      <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      <rect x="6.2" y="8" width="3.6" height="2" rx="0.5" fill="currentColor" />
      <rect x="6.2" y="11" width="3.6" height="2" rx="0.5" fill="currentColor" />
      <rect x="6.2" y="14" width="3.6" height="2" rx="0.5" fill="currentColor" />
      <rect x="14.2" y="8" width="3.6" height="2" rx="0.5" fill="currentColor" />
      <rect x="14.2" y="11" width="3.6" height="2" rx="0.5" fill="currentColor" />
      <rect x="14.2" y="14" width="3.6" height="2" rx="0.5" fill="currentColor" />
    </svg>
  );
}
