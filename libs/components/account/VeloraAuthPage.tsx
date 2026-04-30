import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Checkbox, FormControlLabel, FormGroup, Radio, RadioGroup } from '@mui/material';
import { logIn, signUp } from '../../auth';
import { sweetMixinErrorAlert } from '../../sweetAlert';

type VeloraAuthPageProps = {
	variant: 'login' | 'register';
};

const VeloraAuthPage = ({ variant }: VeloraAuthPageProps) => {
	const router = useRouter();
	const [nick, setNick] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [phone, setPhone] = useState('');
	const [memberType, setMemberType] = useState<'USER' | 'AGENT'>('USER');

	const doLogin = useCallback(async () => {
		try {
			await logIn(nick.trim(), password);
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch {
			/* alerts handled in auth */
		}
	}, [nick, password, router]);

	const doSignUp = useCallback(async () => {
		if (password !== confirmPassword) {
			await sweetMixinErrorAlert('Passwords do not match');
			return;
		}
		try {
			await signUp(nick.trim(), password, phone.trim(), memberType);
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch {
			/* alerts handled in auth */
		}
	}, [nick, password, confirmPassword, phone, memberType, router]);

	const loginDisabled = nick.trim() === '' || password === '';
	const registerDisabled =
		nick.trim() === '' || password === '' || phone.trim() === '' || confirmPassword === '';

	if (variant === 'login') {
		return (
			<div className={'join-page velora-auth'}>
				<div className={'velora-auth-card'}>
					<h1 className={'velora-auth-title'}>Sign in to your account</h1>
					<p className={'velora-auth-sub'}>Enter your credentials to access your account.</p>

					<div className={'velora-auth-fields'}>
						<input
							type={'text'}
							className={'velora-auth-input'}
							placeholder={'E-mail or username'}
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
							placeholder={'Password'}
							autoComplete={'current-password'}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') void doLogin();
							}}
						/>
					</div>

					<div className={'velora-auth-row'}>
						<FormGroup>
							<FormControlLabel control={<Checkbox size={'small'} defaultChecked />} label={'Remember me'} />
						</FormGroup>
						<Link href={'/register'} className={'velora-auth-inline-link'}>
							Register now
						</Link>
					</div>

					<button type={'button'} className={'velora-auth-submit'} disabled={loginDisabled} onClick={() => void doLogin()}>
						Sign in
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className={'join-page velora-auth'}>
			<div className={'velora-auth-card'}>
				<h1 className={'velora-auth-title'}>Register now!</h1>
				<p className={'velora-auth-sub'}>Create a Velora account to save trips and book with experts.</p>

				<div className={'velora-auth-fields'}>
					<input
						type={'text'}
						className={'velora-auth-input'}
						placeholder={'Enter your username'}
						autoComplete={'username'}
						value={nick}
						onChange={(e) => setNick(e.target.value)}
					/>
					<input
						type={'email'}
						className={'velora-auth-input'}
						placeholder={'Enter your email'}
						autoComplete={'email'}
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<input
						type={'password'}
						className={'velora-auth-input'}
						placeholder={'Password'}
						autoComplete={'new-password'}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<input
						type={'password'}
						className={'velora-auth-input'}
						placeholder={'Confirm password'}
						autoComplete={'new-password'}
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>
					<input
						type={'tel'}
						className={'velora-auth-input'}
						placeholder={'Phone number'}
						autoComplete={'tel'}
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter') void doSignUp();
						}}
					/>
				</div>

				<div className={'velora-auth-type'}>
					<span>Register as</span>
					<RadioGroup
						row
						className={'velora-auth-radio'}
						value={memberType}
						onChange={(e) => setMemberType(e.target.value as 'USER' | 'AGENT')}
					>
						<FormControlLabel value={'USER'} control={<Radio size={'small'} color={'primary'} />} label={'Traveler'} />
						<FormControlLabel value={'AGENT'} control={<Radio size={'small'} color={'primary'} />} label={'Agent'} />
					</RadioGroup>
				</div>

				<div className={'velora-auth-row'}>
					<FormGroup>
						<FormControlLabel control={<Checkbox size={'small'} />} label={'Remember me'} />
					</FormGroup>
					<Link href={'/login'} className={'velora-auth-inline-link'}>
						Log in
					</Link>
				</div>

				<button
					type={'button'}
					className={'velora-auth-submit'}
					disabled={registerDisabled}
					onClick={() => void doSignUp()}
				>
					Sign up
				</button>
			</div>
		</div>
	);
};

export default VeloraAuthPage;
