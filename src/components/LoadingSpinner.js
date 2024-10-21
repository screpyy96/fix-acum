import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-purple-600 via-pink-500 to-red-500">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-blue-400 border-solid rounded-full animate-spin"></div>
        <div className="w-20 h-20 border-4 border-yellow-400 border-t-transparent border-solid rounded-full animate-spin absolute top-0 left-0"></div>
        <div className="w-20 h-20 border-4 border-green-400 border-t-transparent border-solid rounded-full animate-spin absolute top-0 left-0 [animation-delay:150ms]"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <svg className="animate-pulse" width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4V2M12 20V22M6.31412 6.31412L4.8999 4.8999M17.6859 17.6859L19.1001 19.1001M4 12H2M20 12H22M6.31412 17.6859L4.8999 19.1001M17.6859 6.31412L19.1001 4.8999" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
