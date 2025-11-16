import React from 'react';

function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(' ');
}

export const OrbitingCircles: React.FC<{
  className?: string;
  children: React.ReactNode;
  reverse?: boolean;
  radius?: number;
  speed?: number;
}> = ({ className, children, reverse = false, radius = 100, speed = 20 }) => {
  const childrenArray = React.Children.toArray(children);
  const containerSize = radius * 2;

  const orbitStyle = {
    animation: `orbit ${speed}s linear infinite`,
    animationDirection: reverse ? 'reverse' : 'normal',
    width: `${containerSize}px`,
    height: `${containerSize}px`,
  } as React.CSSProperties;

  return (
    <>
      <div
        className={cn(
          'relative flex items-center justify-center',
          className
        )}
        style={orbitStyle}
      >
        {childrenArray.map((child, i) => {
          const angle = (i / childrenArray.length) * 360;
          
          const xPos = `calc(50% + ${radius * Math.cos(angle * (Math.PI / 180))}px - 50%)`;
          const yPos = `calc(50% + ${radius * Math.sin(angle * (Math.PI / 180))}px - 50%)`;

          const childStyle: React.CSSProperties = {
            position: 'absolute',
            top: yPos,
            left: xPos,
            animation: `orbit-reverse ${speed}s linear infinite`,
            animationDirection: reverse ? 'reverse' : 'normal',
          };
          
          return (
            <div key={i} style={childStyle}>
              {child}
            </div>
          );
        })}
      </div>
       <style>{`
        @keyframes orbit {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes orbit-reverse {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
      `}</style>
    </>
  );
};
