import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import PackageDetailView from '../../libs/components/packages/PackageDetailView';
import { getPackage } from '../../libs/data/packages';
import type { PackageType } from '../../libs/types/package';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const isPackageType = (value: string): value is PackageType =>
	value === 'tours' || value === 'hotels' || value === 'cars';

const PackageDetailPage: NextPage = () => {
	const router = useRouter();
	const typeRaw = typeof router.query.type === 'string' ? router.query.type : '';
	const id = typeof router.query.id === 'string' ? router.query.id : '';

	if (!router.isReady) {
		return (
			<Stack className={'pkg-detail-page container'} sx={{ py: 6 }}>
				<p>Loading…</p>
			</Stack>
		);
	}

	if (!isPackageType(typeRaw) || !id) {
		return (
			<Stack className={'pkg-detail-page container'} sx={{ py: 6, alignItems: 'center' }}>
				<h2>Package not found</h2>
				<Link href="/">Back to home</Link>
			</Stack>
		);
	}

	const pkg = getPackage(typeRaw, id);

	if (!pkg) {
		return (
			<Stack className={'pkg-detail-page container'} sx={{ py: 6, alignItems: 'center' }}>
				<h2>Package not found</h2>
				<Link href="/">Back to home</Link>
			</Stack>
		);
	}

	return (
		<Stack className={'pkg-detail-wrap'}>
			<PackageDetailView pkg={pkg} />
		</Stack>
	);
};

export default withLayoutBasic(PackageDetailPage);
