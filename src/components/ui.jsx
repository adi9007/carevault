import { CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const icons = {
  success: <CheckCircle className="w-5 h-5 text-green-600" />,
  error: <AlertTriangle className="w-5 h-5 text-red-600" />,
  info: <Info className="w-5 h-5 text-blue-600" />,
  warning: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
};

const colors = {
  success: 'border-l-green-500 bg-green-50',
  error: 'border-l-red-500 bg-red-50',
  info: 'border-l-blue-500 bg-blue-50',
  warning: 'border-l-yellow-500 bg-yellow-50',
};

export function ToastContainer() {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`toast-enter flex items-start gap-3 p-4 rounded-lg shadow-lg border-l-4 pointer-events-auto ${colors[toast.type] || colors.info}`}
        >
          <div className="flex-shrink-0 mt-0.5">{icons[toast.type] || icons.info}</div>
          <p className="text-sm text-gray-800 flex-1">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 ml-1"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

export function Badge({ children, color = 'blue', size = 'sm' }) {
  const colorMap = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    purple: 'bg-purple-100 text-purple-700',
    teal: 'bg-teal-100 text-teal-700',
    gray: 'bg-gray-100 text-gray-700',
    orange: 'bg-orange-100 text-orange-700',
  };
  const sizeMap = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
  };
  return (
    <span className={`inline-flex items-center font-medium rounded-full ${colorMap[color] || colorMap.blue} ${sizeMap[size] || sizeMap.sm}`}>
      {children}
    </span>
  );
}

export function Button({ children, variant = 'primary', size = 'md', className = '', disabled = false, onClick, type = 'button', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-[#2476C7] hover:bg-[#1d63a8] text-white focus-visible:ring-[#2476C7] shadow-sm',
    navy: 'bg-[#163B65] hover:bg-[#0f2847] text-white focus-visible:ring-[#163B65] shadow-sm',
    teal: 'bg-[#16A6A1] hover:bg-[#12908b] text-white focus-visible:ring-[#16A6A1] shadow-sm',
    outline: 'border border-[#E2E8F0] bg-white hover:bg-[#F5F8FC] text-[#1F2937] focus-visible:ring-[#2476C7]',
    ghost: 'hover:bg-gray-100 text-[#64748B] hover:text-[#1F2937]',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus-visible:ring-red-500 shadow-sm',
    'outline-danger': 'border border-red-200 bg-white hover:bg-red-50 text-red-600',
  };
  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-base',
  };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Card({ children, className = '', padding = true }) {
  return (
    <div className={`bg-white rounded-xl border border-[#E2E8F0] shadow-sm ${padding ? 'p-6' : ''} ${className}`}>
      {children}
    </div>
  );
}

export function Input({ label, id, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-[#1F2937]">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full px-3 py-2.5 rounded-lg border text-sm text-[#1F2937] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2476C7] focus:border-transparent transition-all ${
          error ? 'border-red-400 bg-red-50' : 'border-[#E2E8F0] bg-white hover:border-[#94A3B8]'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function Select({ label, id, error, children, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-[#1F2937]">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`w-full px-3 py-2.5 rounded-lg border text-sm text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#2476C7] focus:border-transparent bg-white ${
          error ? 'border-red-400' : 'border-[#E2E8F0] hover:border-[#94A3B8]'
        } ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null;
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizes[size] || sizes.md} max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-6 border-b border-[#E2E8F0]">
          <h2 id="modal-title" className="text-lg font-semibold text-[#163B65]">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="w-16 h-16 rounded-full bg-[#F5F8FC] flex items-center justify-center mb-4">
        {Icon && <Icon className="w-8 h-8 text-[#94A3B8]" />}
      </div>
      <h3 className="text-base font-semibold text-[#1F2937] mb-2">{title}</h3>
      <p className="text-sm text-[#64748B] max-w-xs mb-6">{description}</p>
      {action}
    </div>
  );
}

export function LoadingSpinner({ size = 'md' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };
  return (
    <div className={`${sizes[size] || sizes.md} animate-spin rounded-full border-2 border-[#E2E8F0] border-t-[#2476C7]`} />
  );
}

export function SectionHeader({ title, description, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-[#163B65]">{title}</h1>
        {description && <p className="text-[#64748B] mt-1 text-sm">{description}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

export function StatusDot({ status }) {
  const colors = {
    'Active': 'bg-green-500',
    'Upcoming': 'bg-blue-500',
    'Completed': 'bg-gray-400',
    'Cancelled': 'bg-red-400',
    'Revoked': 'bg-red-400',
    'Expired': 'bg-gray-400',
  };
  return (
    <span className={`inline-block w-2 h-2 rounded-full ${colors[status] || 'bg-gray-400'}`} />
  );
}

export function DemoNotice({ message }) {
  return (
    <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-600" />
      <span>{message}</span>
    </div>
  );
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatTime(timeStr) {
  if (!timeStr) return '—';
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${m} ${ampm}`;
}

export function getAge(dob) {
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}
