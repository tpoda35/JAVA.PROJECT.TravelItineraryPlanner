import {useApi} from "../../../../Hooks/useApi.js";
import {useEffect, useRef, useState} from "react";
import {getErrorMessage} from "../../../../Utils/getErrorMessage.js";
import {showErrorToast} from "../../../../Utils/Toastify/showErrorToast.js";

export default function useTripPlanner(tripId) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const errorRef = useRef('');
    const [formErrors, setFormErrors] = useState({
        title: '',
        startTime: '',
        endTime: ''
    });

    const [trip, setTrip] = useState(null);
    const [expandedDays, setExpandedDays] = useState(new Set());
    const [showAddActivityModal, setShowActivityModal] = useState(false);
    const [activeTripDay, setActiveTripDay] = useState(null);

    const initialFormData = {
        title: '',
        description: '',
        startDate: null,
        endDate: null
    };
    const [formData, setFormData] = useState(initialFormData);
    const api = useApi();

    useEffect(() => {
        let isMounted = true;
        (async () => {
            setLoading(true);
            try {
                const response = await api.get(`/trips/${tripId}`);
                if (isMounted) setTrip(response || null);
            } catch (error) {
                if (isMounted) setError("Failed to load trip.");
            } finally {
                setLoading(false);
            }
        })();
        return () => { isMounted = false; };
    }, [tripId]);

    const resetActivityData = () => {
        setFormData(initialFormData);
        setFormErrors({
            title: '',
            startTime: '',
            endTime: ''
        });
    };

    const toggleDay = (dayId) => {
        const newExpanded = new Set(expandedDays);
        if (newExpanded.has(dayId)) {
            newExpanded.delete(dayId);
        } else {
            newExpanded.add(dayId);
        }
        setExpandedDays(newExpanded);
    };

    const onAddActivity = (tripDay) => {
        resetActivityData();
        setActiveTripDay(tripDay);
        setError(null);
        setShowActivityModal(true);
    };

    const handleTimeChange = ([start, end]) => {
        if (!activeTripDay?.date) return;

        const applyFixedDate = (time) => {
            if (!time) return null;
            const fixed = new Date(activeTripDay.date);
            fixed.setHours(time.getHours(), time.getMinutes(), 0, 0);
            return fixed;
        };

        setFormData((prev) => ({
            ...prev,
            startDate: applyFixedDate(start),
            endDate: applyFixedDate(end),
        }));

        if (start && formErrors.startTime) {
            setFormErrors(prev => ({
                ...prev,
                startTime: ''
            }));
        }

        if (end && formErrors.endTime) {
            setFormErrors(prev => ({
                ...prev,
                endTime: ''
            }));
        }
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        let valid = true;

        const submitErrors = {
            title: '',
            startTime: '',
            endTime: ''
        };

        if (!formData.title.trim()) {
            submitErrors.title = 'Title field cannot be empty.';
            valid = false;
        } else if (formData.title.length > 100) {
            submitErrors.title = 'Title must be 100 characters or less.';
            valid = false;
        }

        if (!formData.startDate) {
            submitErrors.startTime = 'Start time cannot be empty.';
            valid = false;
        }

        if (!formData.endDate) {
            submitErrors.endTime = 'End time cannot be empty.';
            valid = false;
        }

        if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
            submitErrors.startTime = 'Start time must be before end time.';
            valid = false;
        }

        setFormErrors(submitErrors);

        if (!valid || !activeTripDay) return;

        const payload = {
            title: formData.title,
            description: formData.description,
            startTime: formData.startDate,
            endTime: formData.endDate,
            tripDayId: activeTripDay.id
        };

        console.log(payload);

        setLoading(true);
        try {
            console.log("Api call here.");
            setShowActivityModal(false);
            resetActivityData();
        } catch (err) {
            const errorMsg = getErrorMessage(err, 'Failed to create activity.');
            setError(errorMsg);
            errorRef.current = errorMsg;
            showErrorToast(errorRef.current);
        } finally {
            setLoading(false);
        }
    };

    return {
        error,
        loading,
        trip,
        expandedDays,
        showAddActivityModal,
        formData,
        formErrors,
        setError,
        setShowActivityModal,
        setFormData,
        toggleDay,
        handleTimeChange,
        handleInputChange,
        handleSubmit,
        onAddActivity,
        resetActivityData
    };
}
