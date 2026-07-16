import Head from 'next/head';
import { SITE_NAME } from '../../config/seo';

type SeoHeadProps = {
	title: string;
	description: string;
	/** When true, title is used as-is (already includes brand). */
	rawTitle?: boolean;
};

const SeoHead = ({ title, description, rawTitle = false }: SeoHeadProps) => {
	const pageTitle = rawTitle || title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

	return (
		<Head>
			<title>{pageTitle}</title>
			<meta name="title" content={pageTitle} />
			<meta name="description" content={description} />
			<meta property="og:title" content={pageTitle} />
			<meta property="og:description" content={description} />
			<meta property="og:type" content="website" />
		</Head>
	);
};

export default SeoHead;
