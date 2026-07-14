import type { SVGProps } from "react";

const base = (props: SVGProps<SVGSVGElement>) => ({
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...props,
});

export const CompassIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base(props)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M15 9l-2 6-6 2 2-6 6-2z" />
  </svg>
);

export const InboxIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base(props)}>
    <path d="M4 12h4l2 3h4l2-3h4" />
    <path d="M5.5 6h13l1.8 6.2a2 2 0 0 1 .1.6V18a2 2 0 0 1-2 2H4.6a2 2 0 0 1-2-2v-5.2c0-.2 0-.4.1-.6L4.5 6z" />
  </svg>
);

export const ImageStackIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base(props)}>
    <rect x="4" y="4" width="13" height="13" rx="2" />
    <path d="M8 13l2.2-2.6a1.2 1.2 0 0 1 1.8 0L14 13" />
    <circle cx="8.5" cy="8" r="1.2" />
    <path d="M20 8v9a2 2 0 0 1-2 2H9" />
  </svg>
);

export const UserIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base(props)}>
    <circle cx="12" cy="8" r="3.4" />
    <path d="M5 20c1.4-3.6 4.2-5.4 7-5.4S17.6 16.4 19 20" />
  </svg>
);

export const LogoutIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base(props)}>
    <path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" />
    <path d="M15 8l4 4-4 4" />
    <path d="M19 12H9" />
  </svg>
);

export const SparkIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base(props)}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6" />
  </svg>
);

export const TrophyIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base(props)}>
    <path d="M7 4h10v5a5 5 0 0 1-10 0V4z" />
    <path d="M7 5H4v1a4 4 0 0 0 4 4" />
    <path d="M17 5h3v1a4 4 0 0 1-4 4" />
    <path d="M12 14v3" />
    <path d="M9 20h6" />
    <path d="M10 17h4v3h-4z" />
  </svg>
);

export const MegaphoneIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base(props)}>
    <path d="M3 11v2a2 2 0 0 0 2 2h1l2 5" />
    <path d="M6 15h3l8.5 4V5L9 9H6a3 3 0 0 0 0 6z" />
    <path d="M18.5 9.5a3.5 3.5 0 0 1 0 5" />
  </svg>
);

export const CheckIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base(props)} strokeWidth={2}>
    <path d="M5 12l5 5 9-10" />
  </svg>
);

export const XIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base(props)}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const IdCardIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base(props)}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <circle cx="8.5" cy="11" r="1.8" />
    <path d="M5.5 16c.6-1.6 1.9-2.4 3-2.4s2.4.8 3 2.4" />
    <path d="M14.5 9.5h4" />
    <path d="M14.5 12.5h4" />
  </svg>
);
