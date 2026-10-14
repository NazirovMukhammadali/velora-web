import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { Stack, Box } from '@mui/material';
import { currentYear } from '../utils/date';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../sweetAlert';

const POPULAR_CITIES = ['Paris', 'Tokyo', 'Dubai', 'New York'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** No newsletter API yet — validate and acknowledge locally. */
const NewsletterForm = () => {
	const { t } = useTranslation('common');
	const [email, setEmail] = useState('');

	const onSubmit = (event: FormEvent) => {
		event.preventDefault();
		if (!EMAIL_RE.test(email.trim())) {
			sweetMixinErrorAlert('Please enter a valid email address.').then();
			return;
		}
		setEmail('');
		sweetTopSmallSuccessAlert('Thanks! We will keep you posted.', 1200).then();
	};

	return (
		<form onSubmit={onSubmit}>
			<input
				type="email"
				placeholder={t('Your email')}
				aria-label={'Newsletter email'}
				value={email}
				onChange={(e) => setEmail(e.target.value)}
			/>
			<button type="submit">{t('Subscribe')}</button>
		</form>
	);
};

const FooterBrand = () => (
	<Link href={'/'} className={'footer-brand'} aria-label={'Velora home'}>
		<img className={'footer-brand-mark'} src={'/img/logo/velora-mark.svg'} alt={''} aria-hidden />
		<span className={'footer-brand-name'}>VELORA</span>
	</Link>
);

const Footer = () => {
	const { t } = useTranslation('common');
	const device = useDeviceDetect();

	const linkClass = 'footer-link';

	if (device == 'mobile') {
		return (
			<Stack className={'footer-container'}>
				<Stack className={'main'}>
					<Stack className={'left'}>
						<Box component={'div'} className={'footer-box'}>
							<FooterBrand />
							<p className={'footer-tagline'}>{t('Compare flights, stays, and tours in one calm place.')}</p>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>{t('24/7 customer care')}</span>
							<p>+82 10 4867 2909</p>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>{t('Need help live')}</span>
							<p>+82 10 4867 2909</p>
							<Link href={'/cs'} className={linkClass}>
								{t('Support?')}
							</Link>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<p>{t('follow us on social media')}</p>
							<div className={'media-box'}>
								<FacebookOutlinedIcon />
								<TelegramIcon />
								<InstagramIcon />
								<TwitterIcon />
							</div>
						</Box>
					</Stack>
					<Stack className={'right'}>
						<Box component={'div'} className={'bottom'}>
							<div>
								<strong>{t('Explore')}</strong>
								<Link className={linkClass} href={'/tours'}>
									{t('Tour packages')}
								</Link>
								<Link className={linkClass} href={'/flights'}>
									{t('Flights')}
								</Link>
								<Link className={linkClass} href={'/hotels'}>
									{t('Hotels')}
								</Link>
								<Link className={linkClass} href={'/agent'}>
									{t('Travel experts')}
								</Link>
							</div>
							<div>
								<strong>{t('Quick links')}</strong>
								<Link className={linkClass} href={'/about'}>
									{t('About Velora')}
								</Link>
								<Link className={linkClass} href={'/login'}>
									{t('Sign in')}
								</Link>
								<Link className={linkClass} href={'/register'}>
									{t('Create account')}
								</Link>
								<Link className={linkClass} href={'/cs'}>
									{t('Help & contact')}
								</Link>
							</div>
							<div>
								<strong>{t('Popular cities')}</strong>
								{POPULAR_CITIES.map((city) => (
									<Link key={city} className={linkClass} href={`/tours?location=${encodeURIComponent(city)}`}>
										{city}
									</Link>
								))}
							</div>
						</Box>
					</Stack>
				</Stack>
				<Stack className={'second'}>
					<span>
						© Velora · {currentYear()} · {t('All rights reserved')}
					</span>
				</Stack>
			</Stack>
		);
	}

	return (
		<Stack className={'footer-container'}>
			<Stack className={'main'}>
				<Stack className={'left'}>
					<Box component={'div'} className={'footer-box'}>
						<FooterBrand />
						<p className={'footer-tagline'}>{t('Compare flights, stays, and tours in one calm place.')}</p>
					</Box>
					<Box component={'div'} className={'footer-box'}>
						<span>{t('24/7 customer care')}</span>
						<p>+82 10 4867 2909</p>
					</Box>
					<Box component={'div'} className={'footer-box'}>
						<span>{t('Need help live')}</span>
						<p>+82 10 4867 2909</p>
						<Link href={'/cs'} className={linkClass}>
							{t('Support?')}
						</Link>
					</Box>
					<Box component={'div'} className={'footer-box'}>
						<p>{t('follow us on social media')}</p>
						<div className={'media-box'}>
							<FacebookOutlinedIcon />
							<TelegramIcon />
							<InstagramIcon />
							<TwitterIcon />
						</div>
					</Box>
				</Stack>
				<Stack className={'right'}>
					<Box component={'div'} className={'top'}>
						<strong>{t('Keep yourself up to date')}</strong>
						<NewsletterForm />
					</Box>
					<Box component={'div'} className={'bottom'}>
						<div>
							<strong>{t('Explore')}</strong>
							<Link className={linkClass} href={'/tours'}>
								{t('Tour packages')}
							</Link>
							<Link className={linkClass} href={'/flights'}>
								{t('Flights')}
							</Link>
							<Link className={linkClass} href={'/hotels'}>
								{t('Hotels')}
							</Link>
							<Link className={linkClass} href={'/agent'}>
								{t('Travel experts')}
							</Link>
						</div>
						<div>
							<strong>{t('Quick links')}</strong>
							<Link className={linkClass} href={'/about'}>
								{t('About Velora')}
							</Link>
							<Link className={linkClass} href={'/login'}>
								{t('Sign in')}
							</Link>
							<Link className={linkClass} href={'/register'}>
								{t('Create account')}
							</Link>
							<Link className={linkClass} href={'/cs'}>
								{t('Help & contact')}
							</Link>
						</div>
						<div>
							<strong>{t('Popular cities')}</strong>
							{POPULAR_CITIES.map((city) => (
								<Link key={city} className={linkClass} href={`/tours?location=${encodeURIComponent(city)}`}>
									{city}
								</Link>
							))}
						</div>
					</Box>
				</Stack>
			</Stack>
			<Stack className={'second'}>
				<span>
					© Velora · {currentYear()} · {t('All rights reserved')}
				</span>
				<span className={'footer-legal'}>
					<Link href={'/about'} className={linkClass}>
						{t('Privacy')}
					</Link>
					·
					<Link href={'/about'} className={linkClass}>
						{t('Terms')}
					</Link>
					·
					<Link href={'/tours'} className={linkClass}>
						{t('Sitemap')}
					</Link>
				</span>
			</Stack>
		</Stack>
	);
};

export default Footer;
