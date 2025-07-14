export default function formatTime(timeString) {
    return new Date(timeString).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });
}