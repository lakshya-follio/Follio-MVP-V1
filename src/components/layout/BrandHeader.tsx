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
        'sticky top-0 z-50 w-full transition-all duration-300',
        subdued
          ? 'bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm shadow-cyan-500/5'
          : 'bg-white/90 backdrop-blur-md border-b border-slate-200/60 shadow-sm',
        className
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-teal-500 to-indigo-500 text-xl font-bold text-white shadow-lg shadow-cyan-500/20 ring-1 ring-white/20">
            F
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-cyan-600">Follio</p>
            <p className="text-[15px] font-medium text-slate-600">Portfolio Experience Platform</p>
          </div>
        </div>
        {action && <div className="flex items-center gap-4 text-sm font-medium text-slate-600">{action}</div>}
      </div>
    </header>
  );
};

export default BrandHeader;
