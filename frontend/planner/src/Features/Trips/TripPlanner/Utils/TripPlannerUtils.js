export const sortActivities = (activities) => {
    if (!Array.isArray(activities)) return [];
    return [...activities].sort((a, b) => {
        const aTime = a?.startDate ? new Date(a.startDate).getTime() : 0;
        const bTime = b?.startDate ? new Date(b.startDate).getTime() : 0;
        return aTime - bTime;
    });
};

export const initialFormData = { title: '', description: '', startDate: null, endDate: null };
export const initialFormErrors = { title: '', startTime: '', endTime: '' };
