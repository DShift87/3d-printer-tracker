interface FilamentIconProps {
  className?: string;
}

export function FilamentIcon({ className = "" }: FilamentIconProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24"
      height="24"
      viewBox="0 0 24 24" 
      fill="none"
      className={className}
    >
      <g clipPath="url(#clip0_706_314)">
        <mask id="mask0_706_314" style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
          <path d="M24 0H0V24H24V0Z" fill="white"/>
        </mask>
        <g mask="url(#mask0_706_314)">
          <path 
            d="M11.9702 22C17.4931 22 21.9702 17.5228 21.9702 12C21.9702 6.47715 17.4931 2 11.9702 2C6.44737 2 1.97021 6.47715 1.97021 12C1.97021 17.5228 6.44737 22 11.9702 22Z" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            opacity="0.4" 
            d="M12 16.2295C14.3362 16.2295 16.23 14.3357 16.23 11.9995C16.23 9.66337 14.3362 7.76953 12 7.76953C9.66386 7.76953 7.77002 9.66337 7.77002 11.9995C7.77002 14.3357 9.66386 16.2295 12 16.2295Z" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeMiterlimit="10" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_706_314">
          <rect width="24" height="24" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}