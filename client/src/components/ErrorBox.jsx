import React from 'react';

const ErrorBox = ({ title = 'Ocurrió un error', message = '', onRetry = null, details = null }) => {
  return (
    <div className="p-4 max-w-xl mx-auto">
      <div className="bg-white border border-red-200 rounded-lg shadow-sm p-4 flex items-start gap-4">
        <div className="flex-shrink-0">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="font-semibold text-gray-800">{title}</div>
          {message && <div className="mt-1 text-sm text-gray-600">{message}</div>}
          {details && (
            <pre className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded overflow-auto">{JSON.stringify(details, null, 2)}</pre>
          )}
        </div>
        <div className="flex items-center">
          {onRetry && (
            <button onClick={onRetry} className="px-3 py-1 rounded bg-red-600 text-white text-sm hover:bg-red-700">Reintentar</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorBox;
