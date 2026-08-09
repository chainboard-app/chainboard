import { ReactNode } from 'react';

interface ResponsiveGridProps {
  children: ReactNode;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: string;
  className?: string;
}

export function ResponsiveGrid({
  children,
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = '1rem',
  className = '',
}: ResponsiveGridProps) {
  const gridStyle = {
    display: 'grid',
    gap,
    gridTemplateColumns: `repeat(${cols.mobile}, 1fr)`,
    '@media (min-width: 768px)': {
      gridTemplateColumns: `repeat(${cols.tablelet || cols.mobile}, 1fr)`,
    },
    '@media (min-width: 1024px)': {
      gridTemplateColumns: `repeat(${cols.desktop || cols.tablelet || cols.mobile}, 1fr)`,
    },
  };

  return (
    <div className={`responsive-grid ${className}`} style={gridStyle}>
      {children}
    </div>
  );
}
