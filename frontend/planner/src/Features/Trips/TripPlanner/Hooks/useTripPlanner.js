import {useApi} from "../../../../Hooks/useApi.js";
import {useEffect, useState} from "react";

export default function useTripPlanner(tripId) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activityDataErrors, setActivityDataErrors] = useState({
        name: '',
        startTime: '',
        endTime: ''
    });

    const [trip, setTrip] = useState(null);
    const [expandedDays, setExpandedDays] = useState(new Set());

    const [showAddActivityModal, setShowActivityModal] = useState(false);

    const [activeTripDay, setActiveTripDay] = useState(null);

    console.log(activeTripDay)

    // For reset
    const initialActivityData = {
        title: '',
        description: '',
        startDate: null,
        endDate: null
    };
    const [activityData, setActivityData] = useState(initialActivityData);

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
    }, []);

    const resetActivityData = () => {
        setActivityData(initialActivityData);
    }

    const toggleDay = (dayId) => {
        const newExpanded = new Set(expandedDays);
        if (newExpanded.has(dayId)) {
            newExpanded.delete(dayId);
        } else {
            newExpanded.add(dayId);
        }
        setExpandedDays(newExpanded);
    };

    const handleTimeChange = ([start, end]) => {
        if (!activeTripDay?.date) return;

        const applyFixedDate = (time) => {
            if (!time) return null;
            const fixed = new Date(activeTripDay.date);
            fixed.setHours(time.getHours());
            fixed.setMinutes(time.getMinutes());
            fixed.setSeconds(0);
            return fixed;
        };

        setActivityData((prev) => ({
            ...prev,
            startDate: applyFixedDate(start),
            endDate: applyFixedDate(end),
        }));
    };


    const onAddActivity = (tripDay) => {
        resetActivityData();
        setActiveTripDay(tripDay);
        setError(null);
        setShowActivityModal(true);
    };


    return {
        // State values
        error,
        loading,
        trip,
        expandedDays,
        showAddActivityModal,
        activityData,

        // State setters
        setError,
        setShowActivityModal,
        setActivityData,

        // Functions
        toggleDay,
        handleTimeChange,
        onAddActivity
    };
}