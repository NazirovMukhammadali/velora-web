import React, { useEffect, useRef, useState } from 'react';
import { useMutation } from '@apollo/client';
import { ArrowUp, Sparkle, Trash, X } from 'phosphor-react';
import { ASK_TRAVEL_ASSISTANT } from '../../apollo/user/mutation';
import RobotMark from './assistant/RobotMark';
import SourceCard from './assistant/SourceCard';
import type { AssistantMessage, AssistantReply } from '../types/assistant/assistant';
import { ASSISTANT_PROMPT_MAX, assistantErrorText, parseAssistantText, toHistory } from '../utils/assistant';

const STORAGE_KEY = 'velora-ai-chat';
const STARTER_PROMPTS = [
	'Hotels in Seoul under $150',
	'Tours in Samarkand',
	'Flights from Tashkent to Istanbul',
	'Show my bookings',
];

const newId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const loadMessages = (): AssistantMessage[] => {
	try {
		const raw = window.sessionStorage.getItem(STORAGE_KEY);
		const parsed = raw ? JSON.parse(raw) : [];
		return Array.isArray(parsed) ? parsed.slice(-30) : [];
	} catch {
		return [];
	}
};

/**
 * Velora AI travel assistant: floating robot button + chat panel wired to the
 * askTravelAssistant mutation. Conversation lives in sessionStorage (per tab) and the
 * last turns are sent back as history — the API itself is stateless.
 */
const Chat = () => {
	const [open, setOpen] = useState(false);
	const [messages, setMessages] = useState<AssistantMessage[]>([]);
	const [input, setInput] = useState('');
	const listRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLTextAreaElement>(null);

	const [askAssistant, { loading }] = useMutation<{ askTravelAssistant: AssistantReply }>(ASK_TRAVEL_ASSISTANT, {
		context: { skipGlobalErrorAlert: true },
	});

	/** LIFECYCLES **/
	useEffect(() => setMessages(loadMessages()), []);

	useEffect(() => {
		try {
			window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30)));
		} catch {
			/* storage unavailable (private mode) — keep the chat in memory only */
		}
	}, [messages]);

	useEffect(() => {
		listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
	}, [messages, loading, open]);

	useEffect(() => {
		if (open) inputRef.current?.focus();
	}, [open]);

	// Close on Escape.
	useEffect(() => {
		if (!open) return;
		const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false);
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [open]);

	/** HANDLERS **/
	const send = async (raw: string) => {
		const text = raw.trim().slice(0, ASSISTANT_PROMPT_MAX);
		if (text.length < 2 || loading) return;

		const history = toHistory(messages);
		setMessages((prev) => [...prev, { id: newId(), role: 'user', text }]);
		setInput('');

		try {
			const { data } = await askAssistant({ variables: { input: { prompt: text, history } } });
			const reply = data?.askTravelAssistant;
			if (!reply) throw new Error('empty reply');
			setMessages((prev) => [
				...prev,
				{
					id: newId(),
					role: 'assistant',
					text: reply.answer,
					aiPowered: reply.aiPowered,
					category: reply.category,
					sources: reply.sources ?? [],
					suggestions: reply.suggestions ?? [],
				},
			]);
		} catch (err) {
			setMessages((prev) => [...prev, { id: newId(), role: 'assistant', text: assistantErrorText(err), error: true }]);
		}
	};

	const lastAssistant = [...messages].reverse().find((m) => m.role === 'assistant');
	const suggestions =
		!loading && lastAssistant?.role === 'assistant' && !lastAssistant.error ? lastAssistant.suggestions ?? [] : [];
	const lastIsAi = lastAssistant?.role === 'assistant' && lastAssistant.aiPowered;

	return (
		<div className={`ai-assistant ${open ? 'is-open' : ''}`}>
			<section
				className="ai-panel"
				role="dialog"
				aria-label="Velora AI assistant"
				aria-hidden={!open}
				{...(!open ? { inert: '' } : {})}
			>
				<header className="ai-panel__head">
					<span className="ai-panel__avatar">
						<RobotMark size={30} />
					</span>
					<div className="ai-panel__title">
						<strong>Velora AI</strong>
						<small>
							<span className={`ai-dot ${lastAssistant && !lastIsAi ? 'is-faq' : ''}`} />
							{lastAssistant && !lastIsAi ? 'Quick-help mode' : 'Travel assistant · online'}
						</small>
					</div>
					{messages.length > 0 && (
						<button
							type="button"
							className="ai-icon-btn"
							aria-label="Clear conversation"
							title="Clear conversation"
							onClick={() => setMessages([])}
						>
							<Trash size={18} />
						</button>
					)}
					<button type="button" className="ai-icon-btn" aria-label="Close assistant" onClick={() => setOpen(false)}>
						<X size={18} />
					</button>
				</header>

				<div className="ai-panel__list" ref={listRef} aria-live="polite">
					{messages.length === 0 && (
						<div className="ai-welcome">
							<RobotMark size={56} className="ai-welcome__robot" />
							<h3>Hi! I&apos;m your Velora travel assistant.</h3>
							<p>Ask me about tours, hotels, rental cars or flights — I&apos;ll search live prices for you.</p>
						</div>
					)}

					{messages.map((message) =>
						message.role === 'user' ? (
							<div key={message.id} className="ai-msg ai-msg--user">
								<p>{message.text}</p>
							</div>
						) : (
							<div
								key={message.id}
								className={`ai-msg ai-msg--bot ${message.error ? 'is-error' : ''} ${
									message.sources?.length ? 'has-sources' : ''
								}`}
							>
								{!message.error && (
									<span className={`ai-badge ${message.aiPowered ? 'ai-badge--ai' : 'ai-badge--faq'}`}>
										{message.aiPowered ? (
											<>
												<Sparkle size={12} weight="fill" /> AI answer
											</>
										) : (
											'Quick help · FAQ'
										)}
									</span>
								)}
								<p>
									{parseAssistantText(message.text).map((segment, index) =>
										segment.bold ? <strong key={index}>{segment.text}</strong> : segment.text,
									)}
								</p>
								{message.sources && message.sources.length > 0 && (
									<div className="ai-sources">
										{message.sources.map((source) => (
											<SourceCard key={source.url} source={source} onOpen={() => setOpen(false)} />
										))}
									</div>
								)}
							</div>
						),
					)}

					{loading && (
						<div className="ai-msg ai-msg--bot ai-typing" aria-label="Assistant is typing">
							<span />
							<span />
							<span />
						</div>
					)}
				</div>

				{(messages.length === 0 ? STARTER_PROMPTS : suggestions).length > 0 && (
					<div className="ai-chips">
						{(messages.length === 0 ? STARTER_PROMPTS : suggestions).map((prompt) => (
							<button key={prompt} type="button" onClick={() => void send(prompt)} disabled={loading}>
								{prompt}
							</button>
						))}
					</div>
				)}

				<form
					className="ai-composer"
					onSubmit={(event) => {
						event.preventDefault();
						void send(input);
					}}
				>
					<textarea
						ref={inputRef}
						rows={1}
						value={input}
						maxLength={ASSISTANT_PROMPT_MAX}
						placeholder="Ask about trips, prices, bookings…"
						aria-label="Message"
						onChange={(event) => setInput(event.target.value)}
						onKeyDown={(event) => {
							if (event.key === 'Enter' && !event.shiftKey) {
								event.preventDefault();
								void send(input);
							}
						}}
					/>
					<button type="submit" className="ai-send" aria-label="Send" disabled={loading || input.trim().length < 2}>
						<ArrowUp size={18} weight="bold" />
					</button>
				</form>
				{input.length > ASSISTANT_PROMPT_MAX * 0.8 && (
					<span className="ai-counter">
						{input.length}/{ASSISTANT_PROMPT_MAX}
					</span>
				)}
			</section>

			<button
				type="button"
				className="ai-fab"
				aria-label={open ? 'Close Velora AI assistant' : 'Open Velora AI assistant'}
				aria-expanded={open}
				onClick={() => setOpen((prev) => !prev)}
			>
				<span className="ai-fab__ring" aria-hidden="true" />
				{open ? <X size={24} weight="bold" color="#ffffff" /> : <RobotMark size={36} className="ai-fab__robot" />}
				{!open && <span className="ai-fab__label">Ask AI</span>}
			</button>
		</div>
	);
};

export default Chat;
