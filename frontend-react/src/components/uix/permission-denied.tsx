import React from "react";

const PermissionDenied: React.FC = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#e53e3e" strokeWidth="2" fill="#fff"/>
            <line x1="8" y1="8" x2="16" y2="16" stroke="#e53e3e" strokeWidth="2" strokeLinecap="round"/>
            <line x1="16" y1="8" x2="8" y2="16" stroke="#e53e3e" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <h1 className="text-red-600 mt-6 text-2xl font-semibold">Permission Denied</h1>
        <p className="text-gray-700 mt-2 text-center max-w-xs">
            You do not have the necessary permissions to access this page.
        </p>
    </div>
);

export default PermissionDenied;
