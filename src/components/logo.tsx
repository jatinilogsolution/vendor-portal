import React, { forwardRef } from "react";

type LogoProps = {
  size?: number | string;       // px number or CSS size string like "2rem"
  color?: string;               // any CSS color, defaults to "currentColor"
  className?: string;           // extra classes
  title?: string;               // accessible title
  ariaHidden?: boolean;         // hide from screen readers
  strokeWidth?: number;         // line thickness
};

export const Logo = forwardRef<SVGSVGElement, LogoProps>(function Logo(
  {
    size = 40,
    color = "currentColor",
    className = "",
    title = "App logo",
    ariaHidden = false,
    strokeWidth = 1.5,
  },
  ref
) {
  const width = typeof size === "number" ? `${size}px` : size;
  const height = width;

  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      width={width}
      height={height}
      stroke={color}
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden={ariaHidden}
      role={ariaHidden ? undefined : "img"}
    >
      {title && !ariaHidden ? <title>{title}</title> : null}
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975
           m11.963 0a9 9 0 1 0-11.963 0
           m11.963 0A8.966 8.966 0 0 1 12 21
           a8.966 8.966 0 0 1-5.982-2.275
           M15 9.75a3 3 0 1 1-6 0
           3 3 0 0 1 6 0Z"
      />
    </svg>
  );
});
