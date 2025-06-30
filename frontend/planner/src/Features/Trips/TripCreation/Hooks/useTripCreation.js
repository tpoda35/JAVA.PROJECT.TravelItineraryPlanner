import { useState } from 'react';
import {useApi} from "../../../../Hooks/useApi.js";
import {useNavigate} from "react-router-dom";

export default function useTripCreation(folderId) {
    const [formData, setFormData] = useState({
        name: '',
        destination: '',
        destinationCoords: null,
        startDate: null,
        endDate: null,
    });

    const [errors, setErrors] = useState({
        name: '',
        destination: '',
        dates: ''
    });

    const { loading, error, post } = useApi();
    const navigate = useNavigate();

    const [isChecked, setIsChecked] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleDateChange = (dates) => {
        const [start, end] = dates;
        setFormData(prev => ({
            ...prev,
            startDate: start,
            endDate: end
        }));

        if (errors.dates) {
            setErrors(prev => ({
                ...prev,
                dates: ''
            }));
        }
    };

    const handleLocationSelect = ({ coords, name }) => {
        setFormData(prev => ({
            ...prev,
            destination: name,
            destinationCoords: coords
        }));

        if (errors.destination) {
            setErrors(prev => ({
                ...prev,
                destination: ''
            }));
        }
    };

    const handleCheckboxChange = (e) => {
        setIsChecked(e.target.checked);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        let valid = true;
        const newErrors = {
            name: '',
            destination: '',
            dates: ''
        };

        if (!formData.name.trim()) {
            newErrors.name = 'Name field cannot be empty.';
            valid = false;
        } else if (formData.name.length > 100) {
            newErrors.name = 'Name must be 100 characters or less.';
            valid = false;
        }

        if (!formData.destination.trim()) {
            newErrors.destination = 'Destination field cannot be empty.';
            valid = false;
        } else if (formData.destination.length > 150) {
            newErrors.destination = 'Destination must be 150 characters or less.';
            valid = false;
        }

        if (!formData.startDate || !formData.endDate) {
            newErrors.dates = 'Both start and end dates are required.';
            valid = false;
        } else if (formData.startDate > formData.endDate) {
            newErrors.dates = 'End date must be after start date.';
            valid = false;
        }

        setErrors(newErrors);

        if (!valid) {
            return;
        }

        console.log('Submitting:', formData);

        const payload = {
            name: formData.name,
            destination: formData.destination,
            startDate: formData.startDate,
            endDate: formData.endDate,
            folderId: Number(folderId),
            cooperativeEditingEnabled: isChecked
        }

        try {
            const response = await post('/trips', payload);

            console.log('Trip created:', response);
            navigate('/trip-manager')
        } catch (err) {
            console.error('Trip creation failed:', err.message);
        }
    };

    return {
        formData,
        errors,
        handleInputChange,
        handleDateChange,
        handleLocationSelect,
        handleCheckboxChange,
        handleSubmit,
        loading,
        apiError : error
    };
}
