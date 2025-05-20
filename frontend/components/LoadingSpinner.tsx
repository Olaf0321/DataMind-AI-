import React from 'react';

const LoadingSpinner: React.FC = () => (
  <div className="fixed inset-0 flex items-center bg-black/40 justify-center bg-opacity-20 backdrop-blur-sm z-50">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
  </div>
);

export default LoadingSpinner;
