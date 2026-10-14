import type { AppProps } from 'next/app';
import { ThemeProvider, createTheme, ThemeOptions } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import React, { useEffect, useMemo } from 'react';
import { SnackbarProvider } from 'notistack';
import { light } from '../scss/MaterialTheme';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../apollo/client';
import { clearUserInfo, getJwtToken, updateUserInfo } from '../libs/auth';
import { appWithTranslation } from 'next-i18next';
import '../scss/app.scss';
import '../scss/pc/main.scss';
import '../scss/mobile/main.scss';

const App = ({ Component, pageProps }: AppProps) => {
	const theme = useMemo(() => createTheme(light as ThemeOptions), []);
	const client = useApollo(pageProps.initialApolloState ?? null);

	// Keep login/logout in sync across browser tabs.
	useEffect(() => {
		const onStorage = (event: StorageEvent) => {
			if (event.key !== 'accessToken') return;
			const jwt = getJwtToken();
			if (!jwt) {
				clearUserInfo();
				return;
			}
			try {
				updateUserInfo(jwt);
			} catch {
				clearUserInfo();
			}
		};
		window.addEventListener('storage', onStorage);
		return () => window.removeEventListener('storage', onStorage);
	}, []);

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<SnackbarProvider
				maxSnack={3}
				autoHideDuration={4000}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
			>
				<ApolloProvider client={client}>
					<Component {...pageProps} />
				</ApolloProvider>
			</SnackbarProvider>
		</ThemeProvider>
	);
};

export default appWithTranslation(App);
