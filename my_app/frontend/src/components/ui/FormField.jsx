import React from 'react';
import { AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import './FormField.css';

function FormField({ 
  label, 
  id, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  error, 
  help, 
  required = false, 
  placeholder,
  as = 'input',
  children,
  ...props 
}) {
  const fieldId = id || name;
  const hasError = Boolean(error);
  
  const renderField = () => {
    const commonProps = {
      id: fieldId,
      name,
      value,
      onChange,
      required,
      placeholder,
      className: clsx('form-field-input', { 'form-field-error': hasError }),
      ...props
    };

    if (as === 'textarea') {
      return <textarea {...commonProps} />;
    } else if (as === 'select') {
      return (
        <select {...commonProps}>
          {children}
        </select>
      );
    } else {
      return <input type={type} {...commonProps} />;
    }
  };

  return (
    <div className="form-field">
      <label htmlFor={fieldId} className="form-field-label">
        {label}
        {required && <span className="form-field-required">*</span>}
      </label>
      {renderField()}
      {error && (
        <div className="form-field-error-message">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
      {help && !error && (
        <div className="form-field-help">
          {help}
        </div>
      )}
    </div>
  );
}

export default FormField;
