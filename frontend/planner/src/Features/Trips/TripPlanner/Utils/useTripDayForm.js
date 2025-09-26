import { useState, useCallback } from "react";

// Generic hook for trip day forms
export function useTripDayForm(initialFormData, validationFn) {
    const [formData, setFormData] = useState(initialFormData);
    const [formErrors, setFormErrors] = useState({});

    // Reset form and errors
    const resetForm = useCallback(() => {
        setFormData(initialFormData);
        setFormErrors({});
    }, [initialFormData]);

    // Handle text input change
    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear error for this field
        if (formErrors[name]) {
            setFormErrors((prev) => ({ ...prev, [name]: "" }));
        }
    }, [formErrors]);

    // Handle date/time changes
    const handleDateChange = useCallback((field, date) => {
        setFormData((prev) => ({ ...prev, [field]: date }));

        // Clear error for this field
        if (formErrors[field]) {
            setFormErrors((prev) => ({ ...prev, [field]: "" }));
        }
    }, [formErrors]);

    // Validate form using the provided validation function
    const validateForm = useCallback(() => {
        if (!validationFn) return {};
        const errors = validationFn(formData);
        setFormErrors(errors);
        return errors;
    }, [formData, validationFn]);

    return {
        formData,
        setFormData,
        formErrors,
        setFormErrors,
        handleInputChange,
        handleDateChange,
        validateForm,
        resetForm
    };
}
