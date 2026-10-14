/** Pure helpers behind the admin create / edit dialogs (kept React-free for unit tests). */

export type AdminFieldType = 'text' | 'number' | 'textarea' | 'select' | 'images' | 'datetime';

export type AdminField = {
	name: string;
	label: string;
	type: AdminFieldType;
	required?: boolean;
	options?: string[];
	min?: number;
	max?: number;
	minLength?: number;
	maxLength?: number;
	/** Half-width fields sit two per row on desktop. */
	half?: boolean;
	helper?: string;
};

export type AdminFormValues = Record<string, string>;

/** Image URLs are edited one per line. */
export const splitImageLines = (value: string): string[] =>
	value
		.split('\n')
		.map((line) => line.trim())
		.filter(Boolean);

export const validateAdminForm = (fields: AdminField[], values: AdminFormValues): Record<string, string> => {
	const errors: Record<string, string> = {};
	for (const field of fields) {
		const raw = (values[field.name] ?? '').trim();
		if (!raw) {
			if (field.required) errors[field.name] = 'Required';
			continue;
		}
		if (field.type === 'number') {
			const num = Number(raw);
			if (!Number.isFinite(num)) errors[field.name] = 'Enter a number';
			else if (field.min !== undefined && num < field.min) errors[field.name] = `Minimum ${field.min}`;
			else if (field.max !== undefined && num > field.max) errors[field.name] = `Maximum ${field.max}`;
		}
		if (field.type === 'images') {
			const bad = splitImageLines(raw).find((url) => !/^https?:\/\/\S+$/i.test(url) && !/^uploads\/\S+$/.test(url));
			if (bad) errors[field.name] = `Not a valid image URL: ${bad.slice(0, 60)}`;
		}
		if (field.minLength && raw.length < field.minLength) errors[field.name] = `At least ${field.minLength} characters`;
		if (field.maxLength && raw.length > field.maxLength) errors[field.name] = `Maximum ${field.maxLength} characters`;
	}
	return errors;
};

/** ISO timestamp → value for <input type="datetime-local"> in the admin's local time. */
export const toLocalDateTimeInput = (iso?: string | null): string => {
	if (!iso) return '';
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return '';
	const pad = (n: number) => String(n).padStart(2, '0');
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(
		date.getMinutes(),
	)}`;
};

/** <input type="datetime-local"> value (local time) → ISO timestamp. */
export const fromLocalDateTimeInput = (value: string): string => new Date(value).toISOString();
