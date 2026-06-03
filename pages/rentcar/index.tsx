import { NextPage } from 'next';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import PackageCard from '../../libs/components/packages/PackageCard';
import { getPackagesByType } from '../../libs/data/packages';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const RentcarPage: NextPage = () => {
	const cars = getPackagesByType('cars');

	return (
		<Stack className={'tours-page'}>
			<Stack className={'container'} sx={{ py: 4 }}>
				<h2 style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>Popular Cars</h2>
				<p style={{ marginTop: 8, color: '#6b7280' }}>Compare rental options and book directly from each package page.</p>
			</Stack>
			<Stack className={'tours-page-cards tour-packages-section'}>
				<div className={'tour-grid'}>
					{cars.map((pkg) => (
						<PackageCard key={pkg.id} pkg={pkg} />
					))}
				</div>
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(RentcarPage);
