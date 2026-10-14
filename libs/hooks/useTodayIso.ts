import { useEffect, useState } from 'react';
import { todayIso } from '../utils/bookingPanel';

/**
 * Local "today" (YYYY-MM-DD) for date-input `min`, resolved after mount so the
 * server-rendered markup never disagrees with the browser's timezone.
 */
const useTodayIso = (): string | undefined => {
	const [today, setToday] = useState<string>();
	useEffect(() => setToday(todayIso()), []);
	return today;
};

export default useTodayIso;
