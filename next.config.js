/** @type {import('next').NextConfig} */
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? process.env.REACT_APP_API_URL ?? 'http://127.0.0.1:3007';

let apiHostname = '127.0.0.1';
try {
	apiHostname = new URL(apiUrl).hostname;
} catch {
	// keep default
}

const remotePatterns = [
	{ protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
	{ protocol: 'http', hostname: '127.0.0.1', pathname: '/**' },
	{ protocol: 'http', hostname: 'localhost', pathname: '/**' },
];

if (apiHostname !== '127.0.0.1' && apiHostname !== 'localhost') {
	remotePatterns.push(
		{ protocol: 'https', hostname: apiHostname, pathname: '/**' },
		{ protocol: 'http', hostname: apiHostname, pathname: '/**' },
	);
}

const nextConfig = {
	reactStrictMode: true,
	eslint: {
		ignoreDuringBuilds: true,
	},
	images: {
		remotePatterns,
	},
	async redirects() {
		return [
			{ source: '/property', destination: '/tours', permanent: false },
			{ source: '/property/detail', destination: '/tours', permanent: false },
		];
	},
	env: {
		REACT_APP_API_URL: process.env.REACT_APP_API_URL ?? process.env.NEXT_PUBLIC_API_URL,
		REACT_APP_API_GRAPHQL_URL:
			process.env.REACT_APP_API_GRAPHQL_URL ?? process.env.NEXT_PUBLIC_API_GRAPHQL_URL,
		REACT_APP_API_WS: process.env.REACT_APP_API_WS ?? process.env.NEXT_PUBLIC_API_WS_URL,
	},
};

const { i18n } = require('./next-i18next.config');
nextConfig.i18n = i18n;

module.exports = nextConfig;
