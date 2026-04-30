import { NextPage } from 'next';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import VeloraAuthPage from '../../libs/components/account/VeloraAuthPage';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

/** Legacy URL; same experience as `/login`. */
const Join: NextPage = () => <VeloraAuthPage variant={'login'} />;

export default withLayoutBasic(Join);
