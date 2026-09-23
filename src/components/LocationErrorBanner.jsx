import React from 'react';

export default function LocationErrorBanner({ message }) {
  if (!message) return null;

  return (
    <div className="wg-item item-full">
      <div
        style={{
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid #ef4444',
          color: '#dc2626',
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '14px',
          lineHeight: '1.5',
        }}
      >
        <strong>Location Permission Required:</strong> {message}
      </div>
    </div>
  );
}