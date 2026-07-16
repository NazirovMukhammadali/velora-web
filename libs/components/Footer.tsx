import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { Stack, Box } from '@mui/material';
import { currentYear } from '../utils/date';
import Link from 'next/link';

const FooterBrand = () => (
	<Link href={'/'} className={'footer-brand'} aria-label={'Velora home'}>
		<img className={'footer-brand-mark'} src={'/img/logo/velora-mark.svg'} alt={''} aria-hidden />
		<span className={'footer-brand-name'}>VELORA</span>
	</Link>
);

const Footer = () => {
	const device = useDeviceDetect();

	const linkClass = 'footer-link';

	if (device == 'mobile') {
		return (
			<Stack className={'footer-container'}>
				<Stack className={'main'}>
					<Stack className={'left'}>
						<Box component={'div'} className={'footer-box'}>
							<FooterBrand />
							<p className={'footer-tagline'}>Compare flights, stays, and tours in one calm place.</p>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>24/7 customer care</span>
							<p>+82 10 4867 2909</p>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>Need help live</span>
							<p>+82 10 4867 2909</p>
							<span>Support?</span>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<p>follow us on social media</p>
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
								<strong>Explore</strong>
								<Link className={linkClass} href={'/tours'}>
									Tour packages
								</Link>
								<Link className={linkClass} href={'/flights'}>
									Flights
								</Link>
								<Link className={linkClass} href={'/hotels'}>
									Hotels
								</Link>
								<Link className={linkClass} href={'/agent'}>
									Travel experts
								</Link>
							</div>
							<div>
								<strong>Quick links</strong>
								<Link className={linkClass} href={'/about'}>
									About Velora
								</Link>
								<Link className={linkClass} href={'/login'}>
									Sign in
								</Link>
								<Link className={linkClass} href={'/register'}>
									Create account
								</Link>
								<Link className={linkClass} href={'/cs'}>
									Help &amp; contact
								</Link>
							</div>
							<div>
								<strong>Popular cities</strong>
								<Link className={linkClass} href={'/tours'}>
									Paris
								</Link>
								<Link className={linkClass} href={'/tours'}>
									Tokyo
								</Link>
								<Link className={linkClass} href={'/tours'}>
									Dubai
								</Link>
								<Link className={linkClass} href={'/tours'}>
									New York
								</Link>
							</div>
						</Box>
					</Stack>
				</Stack>
				<Stack className={'second'}>
					<span>© Velora · {currentYear()} · All rights reserved</span>
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
						<p className={'footer-tagline'}>Compare flights, stays, and tours in one calm place.</p>
					</Box>
					<Box component={'div'} className={'footer-box'}>
						<span>24/7 customer care</span>
						<p>+82 10 4867 2909</p>
					</Box>
					<Box component={'div'} className={'footer-box'}>
						<span>Need help live</span>
						<p>+82 10 4867 2909</p>
						<span>Support?</span>
					</Box>
					<Box component={'div'} className={'footer-box'}>
						<p>follow us on social media</p>
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
						<strong>Keep yourself up to date</strong>
						<div>
							<input type="email" placeholder={'Your email'} aria-label={'Newsletter email'} />
							<span role={'button'} tabIndex={0}>
								Subscribe
							</span>
						</div>
					</Box>
					<Box component={'div'} className={'bottom'}>
						<div>
							<strong>Explore</strong>
							<Link className={linkClass} href={'/tours'}>
								Tour packages
							</Link>
							<Link className={linkClass} href={'/flights'}>
								Flights
							</Link>
							<Link className={linkClass} href={'/hotels'}>
								Hotels
							</Link>
							<Link className={linkClass} href={'/agent'}>
								Travel experts
							</Link>
						</div>
						<div>
							<strong>Quick links</strong>
							<Link className={linkClass} href={'/about'}>
								About Velora
							</Link>
							<Link className={linkClass} href={'/login'}>
								Sign in
							</Link>
							<Link className={linkClass} href={'/register'}>
								Create account
							</Link>
							<Link className={linkClass} href={'/cs'}>
								Help &amp; contact
							</Link>
						</div>
						<div>
							<strong>Popular cities</strong>
							<Link className={linkClass} href={'/tours'}>
								Paris
							</Link>
							<Link className={linkClass} href={'/tours'}>
								Tokyo
							</Link>
							<Link className={linkClass} href={'/tours'}>
								Dubai
							</Link>
							<Link className={linkClass} href={'/tours'}>
								New York
							</Link>
						</div>
					</Box>
				</Stack>
			</Stack>
			<Stack className={'second'}>
				<span>© Velora · {currentYear()} · All rights reserved</span>
				<span className={'footer-legal'}>
					<Link href={'/about'} className={linkClass}>
						Privacy
					</Link>
					·
					<Link href={'/about'} className={linkClass}>
						Terms
					</Link>
					·
					<Link href={'/tours'} className={linkClass}>
						Sitemap
					</Link>
				</span>
			</Stack>
		</Stack>
	);
};

export default Footer;
