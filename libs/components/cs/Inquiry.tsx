import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Box, Button, CircularProgress, Stack, TextField } from '@mui/material';
import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { CREATE_INQUIRY } from '../../../apollo/user/mutation';
import { GET_MY_INQUIRIES } from '../../../apollo/user/query';
import { useAuth } from '../../hooks/useAuth';
import { Notice } from '../../types/notice/notice';
import { formatDate } from '../../utils/date';
import { Messages } from '../../config';
import { sweetErrorHandling, sweetMixinSuccessAlert } from '../../sweetAlert';

const Inquiry = () => {
	const router = useRouter();
	const { isLoggedIn, authReady } = useAuth({ syncOnMount: true });
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [formError, setFormError] = useState('');

	const {
		data,
		loading,
		error,
		refetch,
	} = useQuery(GET_MY_INQUIRIES, {
		skip: !authReady || !isLoggedIn,
		fetchPolicy: 'network-only',
		variables: {
			input: {
				page: 1,
				limit: 20,
				sort: 'createdAt',
				direction: 'DESC',
				search: {},
			},
		},
		notifyOnNetworkStatusChange: true,
	});

	const [createInquiry, { loading: submitting }] = useMutation(CREATE_INQUIRY);

	const inquiries: Notice[] = data?.getMyInquiries?.list ?? [];

	const goLogin = () => {
		router.push(`/login?referrer=${encodeURIComponent('/cs?tab=inquiry')}`);
	};

	const onSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setFormError('');

		if (!isLoggedIn) {
			goLogin();
			return;
		}

		const trimmedTitle = title.trim();
		const trimmedContent = content.trim();
		if (trimmedTitle.length < 3 || trimmedContent.length < 3) {
			setFormError('Please enter a subject and message (at least 3 characters each).');
			return;
		}

		try {
			await createInquiry({
				variables: {
					input: {
						noticeTitle: trimmedTitle,
						noticeContent: trimmedContent,
					},
				},
			});
			setTitle('');
			setContent('');
			await refetch();
			await sweetMixinSuccessAlert('Your inquiry was sent.');
		} catch (err) {
			await sweetErrorHandling(err);
		}
	};

	if (!authReady) {
		return (
			<Stack className="inquiry-content" alignItems="center" py={6}>
				<CircularProgress size={28} />
			</Stack>
		);
	}

	if (!isLoggedIn) {
		return (
			<Stack className="inquiry-content cs-state" alignItems="center" py={6} gap={2}>
				<span className="title">Inquiry</span>
				<p>Sign in to send a travel support inquiry and view your messages.</p>
				<Button variant="contained" onClick={goLogin}>
					Login to continue
				</Button>
			</Stack>
		);
	}

	return (
		<Stack className="inquiry-content">
			<span className="title">Inquiry</span>
			<p className="inquiry-lead">Ask about bookings, itineraries, or travel documents. Our team will follow up.</p>

			<Box component="form" className="inquiry-form" onSubmit={onSubmit}>
				<TextField
					fullWidth
					label="Subject"
					value={title}
					onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
					inputProps={{ maxLength: 120 }}
					disabled={submitting}
				/>
				<TextField
					fullWidth
					multiline
					minRows={4}
					label="Message"
					value={content}
					onChange={(e: ChangeEvent<HTMLInputElement>) => setContent(e.target.value)}
					inputProps={{ maxLength: 5000 }}
					disabled={submitting}
				/>
				{formError ? <p className="inquiry-form__error">{formError}</p> : null}
				<Button type="submit" variant="contained" disabled={submitting}>
					{submitting ? 'Sending…' : 'Send inquiry'}
				</Button>
			</Box>

			<span className="inquiry-list-title">My inquiries</span>

			{loading && !data ? (
				<Stack className="cs-state" alignItems="center" py={4}>
					<CircularProgress size={24} />
					<p>Loading your inquiries…</p>
				</Stack>
			) : null}

			{error ? (
				<Stack className="cs-state cs-state--error" alignItems="center" py={4} gap={1}>
					<p>{Messages.error1}</p>
					<button type="button" className="cs-retry" onClick={() => refetch()}>
						Try again
					</button>
				</Stack>
			) : null}

			{!loading && !error && inquiries.length === 0 ? (
				<Stack className="cs-state" alignItems="center" py={4}>
					<p>You have not sent any inquiries yet.</p>
				</Stack>
			) : null}

			{!error && inquiries.length > 0 ? (
				<Stack className="inquiry-list" gap={1.5}>
					{inquiries.map((item) => (
						<Box component="article" className="inquiry-card" key={item._id}>
							<div className="inquiry-card__head">
								<strong>{item.noticeTitle}</strong>
								<span>{formatDate(item.createdAt, 'dd.MM.yyyy')}</span>
							</div>
							<p>{item.noticeContent}</p>
						</Box>
					))}
				</Stack>
			) : null}
		</Stack>
	);
};

export default Inquiry;
