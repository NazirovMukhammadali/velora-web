import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { getJwtToken, logIn, signUp } from '../../auth';
import { sanitizeReferrer } from '../../utils/referrer';

type VeloraAuthPageProps = {
	variant: 'login' | 'register';
};

const VeloraAuthPage = ({ variant }: VeloraAuthPageProps) => {
	const router = useRouter();
	const { t } = useTranslation('common');
	const [nick, setNick] = useState('');
	const [password, setPassword] = useState('');
	const [phone, setPhone] = useState('');
	const [memberType, setMemberType] = useState<'USER' | 'AGENT'>('USER');
	const referrer = sanitizeReferrer(router.query.referrer);
	const referrerQuery = referrer === '/' ? '' : `?referrer=${encodeURIComponent(referrer)}`;

	// Already signed in on arrival → skip the auth form (checked once, not after a fresh login).
	const arrivalCheckedRef = useRef(false);
	useEffect(() => {
		if (!router.isReady || arrivalCheckedRef.current) return;
		arrivalCheckedRef.current = true;
		if (getJwtToken()) void router.replace(referrer);
	}, [router, referrer]);

	const doLogin = useCallback(async () => {
		try {
			await logIn(nick.trim(), password);
			await router.push(referrer);
		} catch {
			/* alerts handled in auth */
		}
	}, [nick, password, router, referrer]);

	const doSignUp = useCallback(async () => {
		try {
			await signUp(nick.trim(), password, phone.trim(), memberType);
			await router.push(referrer);
		} catch {
			/* alerts handled in auth */
		}
	}, [nick, password, phone, memberType, router, referrer]);

	const loginDisabled = nick.trim() === '' || password === '';
	const registerDisabled = nick.trim() === '' || password === '' || phone.trim() === '';

	if (variant === 'login') {
		return (
			<div className={'join-page velora-auth'}>
				<div className={'velora-auth-card'}>
					<h1 className={'velora-auth-title'}>{t('Sign in to your account')}</h1>
					<p className={'velora-auth-sub'}>{t('Enter your credentials to access your account.')}</p>

					<div className={'velora-auth-fields'}>
						<input
							type={'text'}
							className={'velora-auth-input'}
							placeholder={t('Username')}
							autoComplete={'username'}
							value={nick}
							onChange={(e) => setNick(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') void doLogin();
							}}
						/>
						<input
							type={'password'}
							className={'velora-auth-input'}
							placeholder={t('Password')}
							autoComplete={'current-password'}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') void doLogin();
							}}
						/>
					</div>

					<div className={'velora-auth-row'}>
						<Link href={`/register${referrerQuery}`} className={'velora-auth-inline-link'}>
							{t('Register now')}
						</Link>
					</div>

					<button
						type={'button'}
						className={'velora-auth-submit'}
						disabled={loginDisabled}
						onClick={() => void doLogin()}
					>
						{t('Sign in')}
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className={'join-page velora-auth'}>
			<div className={'velora-auth-card'}>
				<h1 className={'velora-auth-title'}>{t('Register now!')}</h1>
				<p className={'velora-auth-sub'}>{t('Create a Velora account to save trips and book with experts.')}</p>

				<div className={'velora-auth-fields'}>
					<input
						type={'text'}
						className={'velora-auth-input'}
						placeholder={t('Enter your username')}
						autoComplete={'username'}
						value={nick}
						onChange={(e) => setNick(e.target.value)}
					/>
					<input
						type={'password'}
						className={'velora-auth-input'}
						placeholder={t('Password')}
						autoComplete={'new-password'}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<input
						type={'tel'}
						className={'velora-auth-input'}
						placeholder={t('Phone number')}
						autoComplete={'tel'}
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter') void doSignUp();
						}}
					/>
				</div>

				<div className={'velora-auth-type'}>
					<span>{t('Register as')}</span>
					<RadioGroup
						row
						className={'velora-auth-radio'}
						value={memberType}
						onChange={(e) => setMemberType(e.target.value as 'USER' | 'AGENT')}
					>
						<FormControlLabel
							value={'USER'}
							control={<Radio size={'small'} color={'primary'} />}
							label={t('Traveler')}
						/>
						<FormControlLabel value={'AGENT'} control={<Radio size={'small'} color={'primary'} />} label={t('Agent')} />
					</RadioGroup>
				</div>

				<div className={'velora-auth-row'}>
					<Link href={`/login${referrerQuery}`} className={'velora-auth-inline-link'}>
						{t('Log in')}
					</Link>
				</div>

				<button
					type={'button'}
					className={'velora-auth-submit'}
					disabled={registerDisabled}
					onClick={() => void doSignUp()}
				>
					{t('Sign up')}
				</button>
			</div>
		</div>
	);
};

export default VeloraAuthPage;
