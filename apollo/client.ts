import { useMemo } from 'react';
import { ApolloClient, ApolloLink, InMemoryCache, from, NormalizedCacheObject, HttpLink } from '@apollo/client';
import createUploadLink from 'apollo-upload-client/public/createUploadLink.js';
import { onError } from '@apollo/client/link/error';
import { ServerError } from '@apollo/client/link/utils';
import { getJwtToken } from '../libs/auth/token';
import { userVar } from './store';
import { sweetErrorAlert } from '../libs/sweetAlert';
import { API_GRAPHQL_URL } from '../libs/config';

let apolloClient: ApolloClient<NormalizedCacheObject>;

/** Operations whose callers report errors themselves (see libs/auth). */
const SELF_HANDLED_OPERATIONS = new Set(['Signup', 'Login']);

const SESSION_ERROR_PATTERNS = ['not authenticated', 'jwt expired', 'invalid token', 'jwt malformed'];

const isSessionErrorMessage = (message: string): boolean => {
	const lower = message.toLowerCase();
	return SESSION_ERROR_PATTERNS.some((pattern) => lower.includes(pattern));
};
let handlingUnauthorized = false;

function getHeaders(): Record<string, string> {
	const headers: Record<string, string> = {};
	const token = getJwtToken();
	if (token) headers.Authorization = `Bearer ${token}`;
	return headers;
}

/** Clear session on 401 without importing logOut (avoids circular auth ↔ apollo deps). */
function handleUnauthorized(): void {
	if (typeof window === 'undefined' || handlingUnauthorized) return;
	handlingUnauthorized = true;

	localStorage.removeItem('accessToken');
	window.localStorage.setItem('logout', Date.now().toString());
	userVar({
		_id: '',
		memberType: '',
		memberStatus: '',
		memberAuthType: '',
		memberPhone: '',
		memberNick: '',
		memberFullName: '',
		memberImage: '',
		memberAddress: '',
		memberDesc: '',
		memberRank: 0,
		memberArticles: 0,
		memberPoints: 0,
		memberLikes: 0,
		memberViews: 0,
		memberWarnings: 0,
		memberBlocks: 0,
	});

	const path = window.location.pathname;
	if (!path.startsWith('/login') && !path.startsWith('/register')) {
		const referrer = encodeURIComponent(window.location.pathname + window.location.search);
		window.location.href = `/login?referrer=${referrer}`;
	} else {
		window.location.reload();
	}
}

function createIsomorphicLink(): ApolloLink {
	if (typeof window === 'undefined') {
		return new HttpLink({ uri: API_GRAPHQL_URL });
	}

	const authLink = new ApolloLink((operation, forward) => {
		operation.setContext(({ headers = {} }) => ({
			headers: {
				...headers,
				...getHeaders(),
			},
		}));
		return forward(operation);
	});

	const uploadLink = createUploadLink({
		uri: API_GRAPHQL_URL,
	}) as unknown as ApolloLink;

	const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
		if (graphQLErrors) {
			// The API's formatError strips `path`/`extensions`, so rely on the client-side
			// operation name and an opt-out context flag for callers that show their own alert.
			const authHandled = SELF_HANDLED_OPERATIONS.has(operation.operationName);
			const silent = Boolean(operation.getContext()?.skipGlobalErrorAlert);

			graphQLErrors.forEach(({ message, extensions }) => {
				const code = String(extensions?.code ?? '');
				if (code === 'UNAUTHENTICATED' || isSessionErrorMessage(message)) {
					handleUnauthorized();
					return;
				}

				if (!authHandled && !silent) sweetErrorAlert(message);
			});
		}

		const statusCode =
			networkError && 'statusCode' in networkError ? (networkError as ServerError).statusCode : undefined;

		if (statusCode === 401) {
			handleUnauthorized();
		}
	});

	return from([errorLink, authLink, uploadLink]);
}

function createApolloClient() {
	return new ApolloClient({
		ssrMode: typeof window === 'undefined',
		link: createIsomorphicLink(),
		cache: new InMemoryCache(),
		resolvers: {},
	});
}

export function initializeApollo(initialState: NormalizedCacheObject | null = null) {
	const _apolloClient = apolloClient ?? createApolloClient();
	if (initialState) _apolloClient.cache.restore(initialState);
	if (typeof window === 'undefined') return _apolloClient;
	if (!apolloClient) apolloClient = _apolloClient;
	return _apolloClient;
}

export function useApollo(initialState: NormalizedCacheObject | null) {
	return useMemo(() => initializeApollo(initialState), [initialState]);
}
