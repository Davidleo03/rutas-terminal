import React from 'react';

const LoadingSkeleton = ({ variant = 'dashboard' }) => {
  if (variant === 'table') {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded flex items-center px-4">
                <div className="h-4 bg-gray-200 rounded w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // default: dashboard style skeleton
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="animate-pulse p-4 bg-white rounded-lg shadow">
          <div className="h-6 bg-gray-200 rounded w-32 mb-3" />
          <div className="h-10 bg-gray-100 rounded w-full" />
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
