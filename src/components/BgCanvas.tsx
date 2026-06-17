import React from 'react';

interface Props {
  bgUrl: string;
}

const BgCanvas: React.FC<Props> = ({ bgUrl }) => (
  <div className="absolute inset-0 z-0 overflow-hidden bg-neutral-950">
    {/* Main wallpaper - brighter and more saturated for visual excellence */}
    <div
      className="absolute inset-0 transition-all duration-[2000ms] ease-in-out"
      style={{
        backgroundImage: `url("${encodeURI(bgUrl)}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'saturate(1.25)',
        transform: 'scale(1.02)',
      }}
    />
  </div>
);

export default BgCanvas;
