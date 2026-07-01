import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle size={18} style={{ color: '#34d399' }} />,
    error: <AlertCircle size={18} style={{ color: '#f87171' }} />,
    info: <Info size={18} style={{ color: '#6366f1' }} />
  };

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        {icons[type] || icons.info}
        <span>{message}</span>
      </div>
      <button className="toast-close" onClick={onClose}>
        <X size={16} />
      </button>
    </div>
  );
}
