import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import PackageDetailView from '../../libs/components/packages/PackageDetailView';
import { getPackage } from '../../libs/data/packages';
import { mapTourToPackage } from '../../libs/data/packageApi';
import { GET_TOUR_DETAIL } from '../../apollo/user/query';
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

	const type = isPackageType(typeRaw) ? typeRaw : null;
	const staticPkg = type ? getPackage(type, id) : undefined;

	// Fall back to the API only for tours that are not part of the static catalog.
	const { data: tourData, loading: tourLoading } = useQuery(GET_TOUR_DETAIL, {
		fetchPolicy: 'cache-and-network',
		errorPolicy: 'all',
		variables: { tourId: id },
		skip: !router.isReady || !id || type !== 'tours' || Boolean(staticPkg),
	});

	if (!router.isReady) {
		return (
			<Stack className={'pkg-detail-page container'} sx={{ py: 6 }}>
				<p>Loading…</p>
			</Stack>
		);
	}

	if (!type || !id) {
		return (
			<Stack className={'pkg-detail-page container'} sx={{ py: 6, alignItems: 'center' }}>
				<h2>Package not found</h2>
				<Link href="/">Back to home</Link>
			</Stack>
		);
	}

	const apiTour = tourData?.getTourDetail;
	const pkg = staticPkg ?? (apiTour ? mapTourToPackage(apiTour) : undefined);

	if (!pkg) {
		if (tourLoading) {
			return (
				<Stack className={'pkg-detail-page container'} sx={{ py: 6 }}>
					<p>Loading…</p>
				</Stack>
			);
		}
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
