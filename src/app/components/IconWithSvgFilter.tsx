import React, { useId } from "react";

/** Hex to 0-1 RGB for feColorMatrix */
function hexToRgbNorm(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace("#", "");
  if (h.length !== 6 || !/^[0-9A-Fa-f]{6}$/.test(h)) {
    return { r: 0.61, g: 0.64, b: 0.69 };
  }
  return {
    r: parseInt(h.slice(0, 2), 16) / 255,
    g: parseInt(h.slice(2, 4), 16) / 255,
    b: parseInt(h.slice(4, 6), 16) / 255,
  };
}

interface IconWithSvgFilterProps {
  color: string;
  children: React.ReactElement;
  /** Shadow opacity 0–1 (default 0.16 to match design) */
  shadowOpacity?: number;
}

/**
 * Wraps an icon so it uses an SVG filter for the drop shadow (feOffset, feGaussianBlur, feColorMatrix),
 * like the Figma export. Renders a hidden filter def and applies it to the icon via filter="url(#id)".
 */
export function IconWithSvgFilter({
  color,
  children,
  shadowOpacity = 0.16,
}: IconWithSvgFilterProps) {
  const id = useId().replace(/:/g, "");
  const filterId = `filter_d_${id}`;
  const { r, g, b } = hexToRgbNorm(color);

  return (
    <>
      <svg
        aria-hidden
        className="absolute w-0 h-0 overflow-hidden"
        style={{ position: "absolute", width: 0, height: 0 }}
      >
        <defs>
          <filter
            id={filterId}
            x="-80%"
            y="-80%"
            width="260%"
            height="260%"
            filterUnits="objectBoundingBox"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity={0} result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="6" />
            <feGaussianBlur stdDeviation="5" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values={`0 0 0 0 ${r} 0 0 0 0 ${g} 0 0 0 0 ${b} 0 0 0 ${shadowOpacity} 0`}
            />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
          </filter>
        </defs>
      </svg>
      <span className="shrink-0 inline-block overflow-visible [&>svg]:block" style={{ padding: "20px", margin: "-20px" }}>
        {children &&
          typeof children === "object" &&
          "type" in children &&
          React.cloneElement(children as React.ReactElement<{ style?: React.CSSProperties }>, {
            style: {
              ...(children as React.ReactElement<{ style?: React.CSSProperties }>).props?.style,
              filter: `url(#${filterId})`,
            },
          })}
      </span>
    </>
  );
}

