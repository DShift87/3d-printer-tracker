interface FilamentIconProps {
  className?: string;
  active?: boolean;
}

export function FilamentIcon({ className = "", active = false }: FilamentIconProps) {
  if (active) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className={className}
      >
        <g clipPath="url(#clip0-fil-active)">
          <mask id="mask0-fil-active" style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
            <path d="M24 0H0V24H24V0Z" fill="white" />
          </mask>
          <g mask="url(#mask0-fil-active)">
            <path opacity="0.4" d="M11.9702 22C17.4931 22 21.9702 17.5228 21.9702 12C21.9702 6.47715 17.4931 2 11.9702 2C6.44737 2 1.97021 6.47715 1.97021 12C1.97021 17.5228 6.44737 22 11.9702 22Z" fill="currentColor" />
            <path d="M12 16.2295C14.3362 16.2295 16.23 14.3357 16.23 11.9995C16.23 9.66337 14.3362 7.76953 12 7.76953C9.66386 7.76953 7.77002 9.66337 7.77002 11.9995C7.77002 14.3357 9.66386 16.2295 12 16.2295Z" fill="currentColor" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0-fil-active">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <g clipPath="url(#clip0-fil-inactive)">
        <mask id="mask0-fil-inactive" style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
          <path d="M24 0H0V24H24V0Z" fill="white" />
        </mask>
        <g mask="url(#mask0-fil-inactive)">
          <path d="M11.97 22.75C6.04997 22.75 1.21997 17.93 1.21997 12C1.21997 6.07 6.04997 1.25 11.97 1.25C17.89 1.25 22.72 6.07 22.72 12C22.72 17.93 17.9 22.75 11.97 22.75ZM11.97 2.75C6.86997 2.75 2.71997 6.9 2.71997 12C2.71997 17.1 6.86997 21.25 11.97 21.25C17.07 21.25 21.22 17.1 21.22 12C21.22 6.9 17.07 2.75 11.97 2.75Z" fill="currentColor" />
          <path d="M12 16.9795C9.25002 16.9795 7.02002 14.7495 7.02002 11.9995C7.02002 9.24953 9.25002 7.01953 12 7.01953C14.75 7.01953 16.98 9.24953 16.98 11.9995C16.98 14.7495 14.75 16.9795 12 16.9795ZM12 8.51953C10.08 8.51953 8.52002 10.0795 8.52002 11.9995C8.52002 13.9195 10.08 15.4795 12 15.4795C13.92 15.4795 15.48 13.9195 15.48 11.9995C15.48 10.0795 13.92 8.51953 12 8.51953Z" fill="currentColor" />
        </g>
      </g>
      <defs>
        <clipPath id="clip0-fil-inactive">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
