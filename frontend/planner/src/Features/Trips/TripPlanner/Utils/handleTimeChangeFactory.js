export function handleTimeChangeFactory(activeTripDay, handleDateChange) {
    return (start, end) => {
        if (!activeTripDay?.date) return;

        const applyFixedDate = (time) => {
            if (!time) return null;
            const fixed = new Date(activeTripDay.date);
            fixed.setHours(time.getHours(), time.getMinutes(), 0, 0);
            return fixed;
        };

        handleDateChange("startDate", applyFixedDate(start));
        handleDateChange("endDate", applyFixedDate(end));
    };
}
