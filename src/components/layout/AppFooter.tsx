import React from 'react';

export const AppFooter: React.FC = () => {
  return (
    <footer className="border-t border-primary/5 bg-secondary py-16">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 text-sm text-primary/60 sm:flex-row">
        <div className="font-medium">© {new Date().getFullYear()} Follio. All rights reserved.</div>
        <div className="flex items-center gap-8 font-medium">
          <button className="transition hover:text-primary hover:underline hover:underline-offset-4">Terms</button>
          <button className="transition hover:text-primary hover:underline hover:underline-offset-4">Privacy</button>
          <button className="transition hover:text-primary hover:underline hover:underline-offset-4">Support</button>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
