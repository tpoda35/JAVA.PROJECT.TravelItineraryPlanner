export const getErrorMessage = (err, fallbackMessage = 'An error occurred') => {
    if (!navigator.onLine) {
        return 'No internet connection. Please check your network and try again.';
    }

    if (err.code === 'NETWORK_ERROR' || err.message === 'Network Error') {
        return 'Network error. Please check your connection and try again.';
    }

    if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        return 'Request timed out. Please try again.';
    }

    if (err.code === 'ERR_NETWORK' || !err.response) {
        return 'Cannot connect to server. Please try again later.';
    }

    if (err.response?.status === 429) {
        return 'Too many requests. Please wait a moment and try again.';
    }

    if (err.response?.status >= 500) {
        return 'Server error. Please try again later.';
    }

    if (err.response?.data?.message) {
        return err.response.data.message;
    }

    return fallbackMessage;
};
