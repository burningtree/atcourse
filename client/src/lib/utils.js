export function timeDifference(targetDate) {
    const now = new Date();
    const diffMs = now - new Date(targetDate); // difference in milliseconds
    const diffMinutes = diffMs / (1000 * 60); // convert to minutes
    const diffHours = diffMinutes / 60; // convert to hours
    const diffDays = diffHours / 24; // convert to days

    if (diffMinutes < 1) {
        return 'now'
    } else if (diffMinutes < 60) {
        return `${Math.floor(diffMinutes)}m`; // Show minutes if under an hour
    } else if (diffHours < 23) {
        return `${Math.floor(diffHours)}h`; // Show hours if under 23 hours
    } else if (diffDays < 30) {
        return `${Math.floor(diffDays)}d`; // Show days if under a month
    } else {
        // Show the date in the format "Aug 10"
        const options = { month: 'short', day: 'numeric' };
        return new Date(targetDate).toLocaleDateString('en-US', options);
    }
}

export function timeFormat(date) {
    return new Date(date).toLocaleString('en-US');
}
