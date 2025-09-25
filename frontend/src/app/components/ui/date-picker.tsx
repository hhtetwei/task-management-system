
'use client';

import { forwardRef } from 'react';

type Props = {
  label?: string;
  value?: string | null;
  onChange?: (v: string | undefined) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
};

const DatePicker = forwardRef<HTMLInputElement, Props>(
  ({ label, value, onChange, error, required, placeholder, className }, ref) => {
    return (
      <div className={className}>
        {label && (
          <label className="mb-1 block text-sm font-medium text-gray-700">
            {label} {required ? <span className="text-red-600">*</span> : null}
          </label>
        )}

        <input
          ref={ref}
          type="date"
          className={[
            'w-full rounded-md border border-gray-300 px-3 py-2',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            error ? 'border-red-500' : '',
          ].join(' ')}
          value={value ?? ''}
          onChange={(e) => onChange?.(e.target.value || undefined)}
          placeholder={placeholder}
        />

        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';
export default DatePicker;
