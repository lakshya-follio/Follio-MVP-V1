import React from 'react';
import logo from '../../assets/follio-logo.png';

interface BrandHeaderProps {
  action?: React.ReactNode;
  subdued?: boolean;
  className?: string;
}

export const BrandHeader: React.FC<BrandHeaderProps> = ({ action, subdued = false, className }) => {
  return (
    <header
      className={[
        'w-full transition-all duration-300 z-50',
        subdued ? 'bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0' : 'bg-transparent absolute top-0 left-0',
        className
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Follio" className="h-10 w-auto object-contain" />
        </div>
      </div>
      {action && <div className="flex items-center gap-4 text-sm font-medium text-slate-600">{action}</div>}
    </div>
    </header >
  );
};

export default BrandHeader;
