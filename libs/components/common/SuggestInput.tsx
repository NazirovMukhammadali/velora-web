import React, { useId, useMemo, useState } from 'react';
import { rankSuggestions, type Suggestion } from '../../utils/suggestions';

type SuggestInputProps = {
	id: string;
	value: string;
	placeholder?: string;
	suggestions: Suggestion[];
	onChange: (value: string) => void;
};

/** Text input with a keyboard-friendly suggestion dropdown (combobox pattern). */
const SuggestInput = ({ id, value, placeholder, suggestions, onChange }: SuggestInputProps) => {
	const listId = useId();
	const [open, setOpen] = useState(false);
	const [active, setActive] = useState(-1);

	const matches = useMemo(() => rankSuggestions(suggestions, value), [suggestions, value]);
	const visible = open && matches.length > 0;

	const pick = (option: Suggestion) => {
		onChange(option.value);
		setOpen(false);
		setActive(-1);
	};

	return (
		<div className="suggest-input">
			<input
				id={id}
				type="text"
				value={value}
				placeholder={placeholder}
				autoComplete="off"
				role="combobox"
				aria-expanded={visible}
				aria-controls={listId}
				aria-autocomplete="list"
				aria-activedescendant={visible && active >= 0 ? `${listId}-${active}` : undefined}
				onChange={(event) => {
					onChange(event.target.value);
					setOpen(true);
					setActive(-1);
				}}
				onFocus={() => setOpen(true)}
				onBlur={() => setOpen(false)}
				onKeyDown={(event) => {
					if (event.key === 'ArrowDown') {
						event.preventDefault();
						setOpen(true);
						setActive((prev) => Math.min(prev + 1, matches.length - 1));
					} else if (event.key === 'ArrowUp') {
						event.preventDefault();
						setActive((prev) => Math.max(prev - 1, 0));
					} else if (event.key === 'Enter' && visible && active >= 0) {
						event.preventDefault();
						pick(matches[active]);
					} else if (event.key === 'Escape') {
						setOpen(false);
					}
				}}
			/>
			{visible && (
				<ul className="suggest-input__list" id={listId} role="listbox">
					{matches.map((option, index) => (
						<li
							key={`${option.value}-${option.hint ?? ''}`}
							id={`${listId}-${index}`}
							role="option"
							aria-selected={index === active}
							className={index === active ? 'is-active' : undefined}
							// mousedown fires before the input's blur, so the pick is not lost.
							onMouseDown={(event) => {
								event.preventDefault();
								pick(option);
							}}
							onMouseEnter={() => setActive(index)}
						>
							<span className="suggest-input__value">{option.value}</span>
							{option.hint && <span className="suggest-input__hint">{option.hint}</span>}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default SuggestInput;
