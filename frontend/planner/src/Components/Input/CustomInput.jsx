import React from "react";
import './CustomInput.css';

const CustomInput = ({
                         label,
                         value,
                         onChange,
                         placeholder = "",
                         type = "text",
                         className = "",
                         inputClassName = "",
                         labelClassName = "",
                         error = null,
                         disabled = false,
                         ...props
                     }) => {
    return (
        <div className={`custom-input-container ${className}`}>
            {label && (
                <label className={`custom-input-label ${labelClassName}`}>
                    {label}
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className={`custom-input ${inputClassName} ${error ? 'error' : ''}`}
                {...props}
            />
            {error && <p className="custom-input-error">{error}</p>}
        </div>
    );
};

export default CustomInput;