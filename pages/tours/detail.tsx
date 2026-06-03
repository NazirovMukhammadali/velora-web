import type { GetServerSideProps } from 'next';

/** Legacy tours detail → unified package detail */
export const getServerSideProps: GetServerSideProps = async (context) => {
	const id = typeof context.query.id === 'string' ? context.query.id : '';
	const destination = id ? `/package/detail?type=tours&id=${encodeURIComponent(id)}` : '/tours';
	return { redirect: { destination, permanent: false } };
};

export default function ToursDetailRedirect() {
	return null;
}
