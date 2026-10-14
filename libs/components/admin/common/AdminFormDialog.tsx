import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from '@mui/material';
import { humanize } from './StatusChip';
import { splitImageLines, validateAdminForm, type AdminField, type AdminFormValues } from './adminForm';

export type { AdminField, AdminFieldType, AdminFormValues } from './adminForm';
export { splitImageLines } from './adminForm';

type AdminFormDialogProps = {
	open: boolean;
	title: string;
	fields: AdminField[];
	initialValues: AdminFormValues;
	saving?: boolean;
	onClose: () => void;
	onSubmit: (values: AdminFormValues) => void;
	/** Cross-field rules (field name → message) checked after the per-field ones. */
	validate?: (values: AdminFormValues) => Record<string, string>;
};

const AdminFormDialog = ({
	open,
	title,
	fields,
	initialValues,
	saving,
	onClose,
	onSubmit,
	validate,
}: AdminFormDialogProps) => {
	const [values, setValues] = useState<AdminFormValues>(initialValues);
	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		if (open) {
			setValues(initialValues);
			setErrors({});
		}
	}, [open, initialValues]);

	const setValue = (name: string, value: string) => {
		setValues((prev) => ({ ...prev, [name]: value }));
		setErrors((prev) => {
			if (!prev[name]) return prev;
			const { [name]: _removed, ...rest } = prev;
			return rest;
		});
	};

	const submit = () => {
		const nextErrors = { ...(validate?.(values) ?? {}), ...validateAdminForm(fields, values) };
		setErrors(nextErrors);
		if (Object.keys(nextErrors).length === 0) onSubmit(values);
	};

	return (
		<Dialog open={open} onClose={() => !saving && onClose()} fullWidth maxWidth="md" className="va-dialog">
			<DialogTitle>{title}</DialogTitle>
			<DialogContent>
				<div className="va-form">
					{fields.map((field) => {
						const value = values[field.name] ?? '';
						const common = {
							label: field.label,
							value,
							required: field.required,
							error: Boolean(errors[field.name]),
							helperText: errors[field.name] ?? field.helper,
							className: field.half ? 'va-form__half' : 'va-form__full',
							onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
								setValue(field.name, e.target.value),
						};

						if (field.type === 'select') {
							return (
								<TextField key={field.name} {...common} select>
									{(field.options ?? []).map((option) => (
										<MenuItem key={option} value={option}>
											{humanize(option)}
										</MenuItem>
									))}
								</TextField>
							);
						}

						if (field.type === 'images') {
							const urls = splitImageLines(value);
							return (
								<div key={field.name} className="va-form__full va-form__images">
									<TextField
										{...common}
										className=""
										fullWidth
										multiline
										minRows={3}
										placeholder="https://images.unsplash.com/…"
										helperText={
											errors[field.name] ?? field.helper ?? 'One image URL per line. The first image is the cover.'
										}
									/>
									{urls.length > 0 && (
										<div className="va-form__thumbs">
											{urls.slice(0, 8).map((url, index) => (
												// eslint-disable-next-line @next/next/no-img-element -- arbitrary admin-entered hosts
												<img key={`${url}-${index}`} src={url} alt="" loading="lazy" />
											))}
										</div>
									)}
								</div>
							);
						}

						return (
							<TextField
								key={field.name}
								{...common}
								type={field.type === 'number' ? 'number' : field.type === 'datetime' ? 'datetime-local' : 'text'}
								multiline={field.type === 'textarea'}
								minRows={field.type === 'textarea' ? 4 : undefined}
								InputLabelProps={field.type === 'datetime' ? { shrink: true } : undefined}
								inputProps={{ min: field.min, max: field.max, maxLength: field.maxLength }}
							/>
						);
					})}
				</div>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} disabled={saving} color="inherit">
					Cancel
				</Button>
				<Button variant="contained" onClick={submit} disabled={saving}>
					{saving ? 'Saving…' : 'Save'}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default AdminFormDialog;
