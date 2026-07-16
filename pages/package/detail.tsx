import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import PackageDetailView from '../../libs/components/packages/PackageDetailView';
import { PackageDetailSkeleton } from '../../libs/components/common/PackageDetailSkeleton';
import SeoHead from '../../libs/components/common/SeoHead';
import { getPackage, formatPackagePrice } from '../../libs/data/packages';
import { mapHotelToPackage, mapRentcarToPackage, mapTourToPackage } from '../../libs/data/packageApi';
import { GET_HOTEL_DETAIL, GET_RENTCAR_DETAIL, GET_TOUR_DETAIL } from '../../apollo/user/query';
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

	// Fall back to the API only for items that are not part of the static catalog.
	const { data: tourData, loading: tourLoading } = useQuery(GET_TOUR_DETAIL, {
		fetchPolicy: 'cache-and-network',
		errorPolicy: 'all',
		variables: { tourId: id },
		skip: !router.isReady || !id || type !== 'tours' || Boolean(staticPkg),
	});

	const { data: hotelData, loading: hotelLoading } = useQuery(GET_HOTEL_DETAIL, {
		fetchPolicy: 'cache-and-network',
		errorPolicy: 'all',
		variables: { hotelId: id },
		skip: !router.isReady || !id || type !== 'hotels' || Boolean(staticPkg),
	});

	const { data: rentcarData, loading: rentcarLoading } = useQuery(GET_RENTCAR_DETAIL, {
		fetchPolicy: 'cache-and-network',
		errorPolicy: 'all',
		variables: { rentcarId: id },
		skip: !router.isReady || !id || type !== 'cars' || Boolean(staticPkg),
	});

	if (!router.isReady) {
		return (
			<Stack className={'pkg-detail-wrap'}>
				<PackageDetailSkeleton />
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
	const apiHotel = hotelData?.getHotelDetail;
	const apiRentcar = rentcarData?.getRentcarDetail;
	const pkg =
		staticPkg ??
		(apiTour ? mapTourToPackage(apiTour) : undefined) ??
		(apiHotel ? mapHotelToPackage(apiHotel) : undefined) ??
		(apiRentcar ? mapRentcarToPackage(apiRentcar) : undefined);

	if (!pkg) {
		if (tourLoading || hotelLoading || rentcarLoading) {
			return (
				<Stack className={'pkg-detail-wrap'}>
					<PackageDetailSkeleton />
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
		<>
			<SeoHead
				title={pkg.title}
				description={`Book ${pkg.title} in ${pkg.location}. From ${formatPackagePrice(pkg.priceAmount)} ${pkg.priceUnit}. View gallery, reviews, and reserve on Velora.`}
			/>
			<Stack className={'pkg-detail-wrap'}>
				<PackageDetailView pkg={pkg} />
			</Stack>
		</>
	);
};

export default withLayoutBasic(PackageDetailPage);
