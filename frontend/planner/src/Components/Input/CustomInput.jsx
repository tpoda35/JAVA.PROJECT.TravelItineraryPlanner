import React from "react";
import './CustomInput.css';

const CustomInput = ({
                         label,
                         value,
                         onChange,
                         placeholder = "",
                         type = "text",
                         inputClassName = "",
                         labelClassName = "",
                         errorClassName = "",
                         error = null,
                         disabled = false,
                         ...props
                     }) => {
    return (
        <>
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
            <div className={`custom-input-error-message-container ${errorClassName}`}>
                <p className="custom-input-error" style={{ visibility: error ? 'visible' : 'hidden' }}>
                    {error || ' '}
                </p>
            </div>
        </>
    );
};

export default CustomInput;