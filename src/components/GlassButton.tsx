import React from 'react';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
}

const GlassButton: React.FC<GlassButtonProps> = ({
  label,
  variant = 'primary',
  className = '',
  disabled = false,
  ...props
}) => {
  // Variant styles for borders and backgrounds
  const variantClasses = variant === 'primary'
    ? 'border-amber-400/40 hover:border-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
    : variant === 'secondary'
      ? 'border-pink-400/45 hover:border-pink-400/65 shadow-[0_0_15px_rgba(236,72,153,0.1)]'
      : 'border-emerald-400/40 hover:border-emerald-400/60 shadow-[0_0_15px_rgba(16,185,129,0.1)]';

  // Text gradient classes
  const textGradientClass = variant === 'primary'
    ? 'bg-gradient-to-r from-yellow-300 via-amber-200 to-orange-300'
    : variant === 'secondary'
      ? 'bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300'
      : 'bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300';

  return (
    <button
      disabled={disabled}
      className={`
        relative overflow-hidden rounded-xl
        flex items-center justify-center uppercase font-bold
        transition-all duration-300 ease-out
        active:scale-[0.98] border
        bg-black/55 hover:bg-black/70 active:bg-black/80
        px-8 py-3.5 tracking-[0.12em] min-w-[180px]
        shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),_0_8px_24px_rgba(0,0,0,0.45)]
        hover:shadow-[inset_0_1.5px_3px_rgba(255,255,255,0.35),_0_12px_32px_rgba(0,0,0,0.55)]
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        ${variantClasses}
        ${className}
      `}
      style={{
        fontFamily: '"Josefin Sans", sans-serif',
        fontSize: (className.includes('text-[') || className.includes('text-xs') || className.includes('text-sm') || className.includes('text-base') || className.includes('text-lg') || className.includes('text-xl'))
          ? undefined 
          : '16px',
      }}
      {...props}
    >
      <span className={`relative z-10 bg-clip-text text-transparent ${textGradientClass}`}>
        {label}
      </span>
    </button>
  );
};

export default GlassButton;
