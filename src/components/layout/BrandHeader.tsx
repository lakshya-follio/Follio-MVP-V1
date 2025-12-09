import React from 'react';

interface BrandHeaderProps {
  action?: React.ReactNode;
  subdued?: boolean;
  className?: string;
}

export const BrandHeader: React.FC<BrandHeaderProps> = ({ action, subdued = false, className }) => {
  return (
    <header
      className={[
        'w-full transition-all duration-300',
        subdued ? 'bg-surface/80 backdrop-blur-md border-b border-primary/5' : 'bg-transparent',
        className
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center">
            <span className="font-serif text-2xl font-bold tracking-tight text-primary">Follio.</span>
          </div>
        </div>
        {action && <div className="flex items-center gap-4 text-sm font-medium text-primary/80">{action}</div>}
      </div>
    </header>
  );
};

export default BrandHeader;
