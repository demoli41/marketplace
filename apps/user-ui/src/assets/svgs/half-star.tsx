import React from "react";

export const HalfStar = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 36 36"
    fill="currentColor"
    width="24"
    height="24"
    {...props}
  >
    <title>Half Star</title>
    <path d="M34 16.78a2.22 2.22 0 0 0-1.29-4l-9-.34a.23.23 0 0 1-.2-.15L20.4 3.89a2.22 2.22 0 0 0-4.17 0l-3.1 8.43a.23.23 0 0 1-.2.15l-9 .34a2.22 2.22 0 0 0-1.29 4l7.06 5.55a.22.22 0 0 1 .08.24L7.35 31.21a2.23 2.23 0 0 0 3.38 2.45l7.46-5a.22.22 0 0 1 .25 0l7.46 5a2.22 2.22 0 0 0 3.38-2.45l-2.45-8.64a.23.23 0 0 1 .08-.24ZM18 26.62V5.2l3.1 8.43a2.22 2.22 0 0 0 2.13 1.5l9 .34-7.06 5.55a2.21 2.21 0 0 0-.71 2.38l2.45 8.64-7.46-5a2.21 2.21 0 0 0-1.45-.42Z"/>
  </svg>
);

export const StarFilled = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 36 36"
    fill="currentColor"
    width="24"
    height="24"
    {...props}
  >
    <title>Star Filled</title>
    <path d="M18 3l4.24 9.53 10.2.38-7.7 6.04 2.65 10.06L18 24.4l-9.39 4.61 2.65-10.06-7.7-6.04 10.2-.38L18 3z" />
  </svg>
);

export const StarOutline = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 36 36"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinejoin="round"
    width="24"
    height="24"
    {...props}
  >
    <title>Star Outline</title>
    <path d="M18 3l4.24 9.53 10.2.38-7.7 6.04 2.65 10.06L18 24.4l-9.39 4.61 2.65-10.06-7.7-6.04 10.2-.38L18 3z" />
  </svg>
);
