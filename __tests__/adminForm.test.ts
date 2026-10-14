import {
	fromLocalDateTimeInput,
	splitImageLines,
	toLocalDateTimeInput,
	validateAdminForm,
	type AdminField,
} from '../libs/components/admin/common/adminForm';

describe('splitImageLines', () => {
	it('trims lines and drops blanks', () => {
		expect(splitImageLines(' https://a.jpg \n\n  https://b.jpg\n ')).toEqual(['https://a.jpg', 'https://b.jpg']);
	});
});

describe('validateAdminForm', () => {
	const fields: AdminField[] = [
		{ name: 'title', label: 'Title', type: 'text', required: true, maxLength: 5 },
		{ name: 'stars', label: 'Stars', type: 'number', required: true, min: 1, max: 5 },
		{ name: 'images', label: 'Images', type: 'images', required: true },
		{ name: 'note', label: 'Note', type: 'textarea' },
	];

	it('accepts a valid form', () => {
		expect(
			validateAdminForm(fields, {
				title: 'Hi',
				stars: '4',
				images: 'https://x.io/a.jpg\nuploads/tour/b.png',
				note: '',
			}),
		).toEqual({});
	});

	it('flags missing, out-of-range, too long and bad image values', () => {
		const errors = validateAdminForm(fields, { title: 'Too long', stars: '9', images: 'not a url', note: '' });
		expect(errors.title).toMatch(/Maximum 5/);
		expect(errors.stars).toBe('Maximum 5');
		expect(errors.images).toMatch(/Not a valid image URL/);
		expect(errors.note).toBeUndefined();
		expect(validateAdminForm(fields, { title: '', stars: 'abc', images: '', note: '' })).toEqual({
			title: 'Required',
			stars: 'Enter a number',
			images: 'Required',
		});
	});
});

describe('datetime-local conversion', () => {
	it('round-trips through the admin local time', () => {
		const iso = '2026-10-05T15:00:00.000Z';
		const local = toLocalDateTimeInput(iso);
		expect(local).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
		expect(fromLocalDateTimeInput(local)).toBe(iso);
	});

	it('returns an empty string for missing or invalid input', () => {
		expect(toLocalDateTimeInput(null)).toBe('');
		expect(toLocalDateTimeInput('nope')).toBe('');
	});
});

describe('validateAdminForm minLength', () => {
	it('mirrors the backend minimum length only when a value is present', () => {
		const fields: AdminField[] = [{ name: 'desc', label: 'Description', type: 'textarea', minLength: 5 }];
		expect(validateAdminForm(fields, { desc: 'abc' })).toEqual({ desc: 'At least 5 characters' });
		expect(validateAdminForm(fields, { desc: '' })).toEqual({});
	});
});
