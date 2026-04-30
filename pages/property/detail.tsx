import type { GetServerSideProps } from 'next';

/** Legacy property detail removed; travel catalog lives under /tours. */
export const getServerSideProps: GetServerSideProps = async () => ({
	redirect: { destination: '/tours', permanent: false },
});

export default function PropertyDetailRedirect() {
	return null;
}
