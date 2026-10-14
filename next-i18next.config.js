module.exports = {
	i18n: {
		defaultLocale: 'en',
		locales: ['en', 'kr', 'ru'],
		localeDetection: false,
	},
	trailingSlash: true,
	// Re-read public/locales on every request in dev so translation edits show without a restart.
	reloadOnPrerender: process.env.NODE_ENV === 'development',
};
