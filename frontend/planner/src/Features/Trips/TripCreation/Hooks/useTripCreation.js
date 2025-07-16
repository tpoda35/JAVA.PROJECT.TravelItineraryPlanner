import {useState} from 'react';
import {useApi} from "../../../../Hooks/useApi.js";
import {useNavigate} from "react-router-dom";
import {getErrorMessage} from "../../../../Utils/getErrorMessage.js"
import {showErrorToast} from "../../../../Utils/Toastify/showErrorToast.js";

export default function useTripCreation(folderId) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [isGeocoding, setIsGeocoding] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        destination: '',
        destinationCoords: null,
        startDate: null,
        endDate: null,
        cooperativeEditingEnabled: false
    });

    const [formErrors, setFormErrors] = useState({
        name: '',
        destination: '',
        dates: ''
    });

    const { post } = useApi();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (formErrors[name]) {
            setFormErrors(prev => ({
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

        if (formErrors.dates) {
            setFormErrors(prev => ({
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

        if (formErrors.destination) {
            setFormErrors(prev => ({
                ...prev,
                destination: ''
            }));
        }
    };

    const handleCheckboxChange = (e) => {
        const checked = e.target.checked;
        setFormData(prev => ({
            ...prev,
            cooperativeEditingEnabled: checked
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        let valid = true;
        const submitErrors = {
            name: '',
            destination: '',
            dates: ''
        };

        if (!formData.name.trim()) {
            submitErrors.name = 'Name field cannot be empty.';
            valid = false;
        } else if (formData.name.length > 100) {
            submitErrors.name = 'Name must be 100 characters or less.';
            valid = false;
        }

        if (!formData.destination.trim()) {
            submitErrors.destination = 'Destination field cannot be empty.';
            valid = false;
        } else if (formData.destination.length > 150) {
            submitErrors.destination = 'Destination must be 150 characters or less.';
            valid = false;
        }

        if (!formData.startDate || !formData.endDate) {
            submitErrors.dates = 'Both start and end dates are required.';
            valid = false;
        } else if (formData.startDate > formData.endDate) {
            submitErrors.dates = 'End date must be after start date.';
            valid = false;
        }

        setFormErrors(submitErrors);

        if (!valid) {
            return;
        }

        const payload = {
            name: formData.name,
            destination: formData.destination,
            startDate: formData.startDate,
            endDate: formData.endDate,
            folderId: Number(folderId),
            cooperativeEditingEnabled: formData.cooperativeEditingEnabled

        }

        setLoading(true);
        try {
            const response = await post('/trips', payload);

            navigate('/trip-manager')
        } catch (err) {
            const errorMsg = getErrorMessage(err, 'Failed to create trip.');
            setError(errorMsg);

            showErrorToast(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        formErrors,
        loading,
        error,
        isGeocoding, setIsGeocoding,
        handleInputChange,
        handleDateChange,
        handleLocationSelect,
        handleCheckboxChange,
        handleSubmit
    };
}
