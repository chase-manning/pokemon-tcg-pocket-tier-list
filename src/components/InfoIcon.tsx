import React from "react";

interface InfoIconProps {
  size?: number;
}

const InfoIcon: React.FC<InfoIconProps> = ({ size = 32 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm.85 10.85h-1.7V6.5h1.7v4.35zm0-5.7h-1.7V3.8h1.7v1.35z" />
    </svg>
  );
};

export default InfoIcon;
