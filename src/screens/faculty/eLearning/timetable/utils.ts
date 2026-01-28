export type ViewMode = 'today' | 'day' | 'week' | 'workweek' | 'month';

export interface DateRange {
    BDate: string; // ISO string
    EDate: string; // ISO string
}

/**
 * Get date range based on view mode and current date
 */
export const getDateRange = (viewMode: ViewMode, currentDate: Date): DateRange => {
    const date = new Date(currentDate);
    date.setHours(0, 0, 0, 0);

    let startDate: Date;
    let endDate: Date;

    switch (viewMode) {
        case 'today':
            startDate = new Date(date);
            endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);
            break;

        case 'day':
            startDate = new Date(date);
            endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);
            break;

        case 'week':
            // Start from Sunday of the week
            const dayOfWeek = date.getDay();
            startDate = new Date(date);
            startDate.setDate(date.getDate() - dayOfWeek);
            endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 6);
            endDate.setHours(23, 59, 59, 999);
            break;

        case 'workweek':
            // Monday to Friday
            const day = date.getDay();
            const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
            startDate = new Date(date.setDate(diff));
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 4); // Friday
            endDate.setHours(23, 59, 59, 999);
            break;

        case 'month':
            startDate = new Date(date.getFullYear(), date.getMonth(), 1);
            endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            endDate.setHours(23, 59, 59, 999);
            break;

        default:
            startDate = new Date(date);
            endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);
    }

    return {
        BDate: startDate.toISOString(),
        EDate: endDate.toISOString(),
    };
};

/**
 * Get calendar dates for month view
 */
export const getMonthCalendarDates = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay();

    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    const lastDate = lastDay.getDate();

    // Start from the Sunday of the week containing the first day
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDayOfWeek);

    // End at the Saturday of the week containing the last day
    const lastDayOfWeek = lastDay.getDay();
    const endDate = new Date(lastDay);
    endDate.setDate(lastDay.getDate() + (6 - lastDayOfWeek));

    const dates: Date[] = [];
    const current = new Date(startDate);

    while (current <= endDate) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }

    return dates;
};

/**
 * Get week dates for week view
 */
export const getWeekDates = (date: Date): Date[] => {
    const dayOfWeek = date.getDay();
    const startDate = new Date(date);
    startDate.setDate(date.getDate() - dayOfWeek);

    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
        const current = new Date(startDate);
        current.setDate(startDate.getDate() + i);
        dates.push(current);
    }

    return dates;
};

/**
 * Get work week dates (Monday to Friday)
 */
export const getWorkWeekDates = (date: Date): Date[] => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Monday
    const monday = new Date(date.setDate(diff));
    monday.setHours(0, 0, 0, 0);

    const dates: Date[] = [];
    for (let i = 0; i < 5; i++) {
        const current = new Date(monday);
        current.setDate(monday.getDate() + i);
        dates.push(current);
    }

    return dates;
};

/**
 * Format date to display string
 */
export const formatDateDisplay = (date: Date): string => {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
};

/**
 * Format time from ISO string
 */
export const formatTime = (isoString: string): string => {
    const date = new Date(isoString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
};

/**
 * Check if date is today
 */
export const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
};

/**
 * Check if date is in current month
 */
export const isCurrentMonth = (date: Date, currentMonth: Date): boolean => {
    return (
        date.getMonth() === currentMonth.getMonth() &&
        date.getFullYear() === currentMonth.getFullYear()
    );
};

/**
 * Get classes for a specific date
 */
export const getClassesForDate = (schedule: any[], date: Date): any[] => {
    if (!schedule || !Array.isArray(schedule)) return [];

    // Normalize the target date to midnight local time
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    const targetDateStr = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}-${String(targetDate.getDate()).padStart(2, '0')}`;

    const matches = schedule.filter((item) => {
        if (!item.LectureDate) return false;

        // Parse the lecture date and normalize to midnight local time
        const lectureDate = new Date(item.LectureDate);
        lectureDate.setHours(0, 0, 0, 0);
        const lectureDateStr = `${lectureDate.getFullYear()}-${String(lectureDate.getMonth() + 1).padStart(2, '0')}-${String(lectureDate.getDate()).padStart(2, '0')}`;

        const isMatch = lectureDateStr === targetDateStr;

        // Debug logging
        if (isMatch) {
            console.log(`✓ Match found: ${targetDateStr} = ${lectureDateStr}`, item.Paper);
        }

        return isMatch;
    });

    return matches;
};

/**
 * Navigate date based on view mode
 */
export const navigateDate = (
    currentDate: Date,
    viewMode: ViewMode,
    direction: 'prev' | 'next'
): Date => {
    const newDate = new Date(currentDate);
    const increment = direction === 'next' ? 1 : -1;

    switch (viewMode) {
        case 'today':
            newDate.setDate(newDate.getDate() + increment);
            break;
        case 'day':
            newDate.setDate(newDate.getDate() + increment);
            break;
        case 'week':
        case 'workweek':
            newDate.setDate(newDate.getDate() + (increment * 7));
            break;
        case 'month':
            newDate.setMonth(newDate.getMonth() + increment);
            break;
    }

    return newDate;
};

/**
 * Get color for a class subject
 */
export const getClassColor = (subject: string): string => {
    const colors = [
        '#5B7FFF', '#FF5A7A', '#FF9F43', '#26C281',
        '#A55EEA', '#00B8D4', '#FF6B9D', '#4ECDC4',
    ];
    if (!subject) return colors[0];
    let hash = 0;
    for (let i = 0; i < subject.length; i++) {
        hash = subject.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
};

/**
 * Sanitize filename for export
 */
export const sanitizeFilename = (name: string): string => {
    return name.replace(/[^a-zA-Z0-9]/g, '_');
};

/**
 * Format day header for week view
 */
export const formatDayHeader = (date: Date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return {
        dayName: days[date.getDay()],
        date: date.getDate(),
        month: months[date.getMonth()],
    };
};
