import React from 'react';

export const SkeletonProduct: React.FC = () => (
  <div className="animate-pulse bg-white rounded-lg shadow p-4 flex flex-col items-center gap-4">
    <div className="bg-gray-200 h-32 w-32 rounded mb-2" />
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-1" />
    <div className="h-3 bg-gray-200 rounded w-1/2 mb-1" />
    <div className="h-4 bg-gray-200 rounded w-1/3" />
    <div className="h-8 bg-gray-200 rounded w-full mt-2" />
  </div>
);
