import { useMemo } from "react";
import {
	ApolloClient,
	ApolloLink,
	InMemoryCache,
	split,
	from,
	NormalizedCacheObject,
	HttpLink,
} from "@apollo/client";
import createUploadLink from "apollo-upload-client/public/createUploadLink.js";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { onError } from "@apollo/client/link/error";
import { ServerError } from "@apollo/client/link/utils";
import { getJwtToken } from "../libs/auth/token";
import { userVar, socketVar } from "./store";
import { sweetErrorAlert } from "../libs/sweetAlert";
import { API_GRAPHQL_URL, API_WS_URL } from "../libs/config";

let apolloClient: ApolloClient<NormalizedCacheObject>;
let handlingUnauthorized = false;

function getHeaders(): Record<string, string> {
	const headers: Record<string, string> = {};
	const token = getJwtToken();
	if (token) headers.Authorization = `Bearer ${token}`;
	return headers;
}

/** Clear session on 401 without importing logOut (avoids circular auth ↔ apollo deps). */
function handleUnauthorized(): void {
	if (typeof window === "undefined" || handlingUnauthorized) return;
	handlingUnauthorized = true;

	localStorage.removeItem("accessToken");
	window.localStorage.setItem("logout", Date.now().toString());
	userVar({
		_id: "",
		memberType: "",
		memberStatus: "",
		memberAuthType: "",
		memberPhone: "",
		memberNick: "",
		memberFullName: "",
		memberImage: "",
		memberAddress: "",
		memberDesc: "",
		memberRank: 0,
		memberArticles: 0,
		memberPoints: 0,
		memberLikes: 0,
		memberViews: 0,
		memberWarnings: 0,
		memberBlocks: 0,
	});

	const path = window.location.pathname;
	if (!path.startsWith("/login") && !path.startsWith("/register")) {
		const referrer = encodeURIComponent(window.location.pathname + window.location.search);
		window.location.href = `/login?referrer=${referrer}`;
	} else {
		window.location.reload();
	}
}

class AppWebSocket {
	private socket: WebSocket;

	constructor(url: string) {
		this.socket = new WebSocket(`${url}?token=${getJwtToken()}`);
		socketVar(this.socket);
	}

	send(data: string | ArrayBuffer | SharedArrayBuffer | Blob | ArrayBufferView) {
		this.socket.send(data);
	}

	close() {
		this.socket.close();
	}
}

function createIsomorphicLink(): ApolloLink {
	if (typeof window === "undefined") {
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

	const wsLink = new WebSocketLink({
		uri: API_WS_URL,
		options: {
			reconnect: false,
			timeout: 30000,
			connectionParams: () => ({ headers: getHeaders() }),
		},
		webSocketImpl: AppWebSocket,
	});

	const errorLink = onError(({ graphQLErrors, networkError }) => {
		if (graphQLErrors) {
			graphQLErrors.forEach(({ message, path, extensions }) => {
				const operationName = Array.isArray(path) ? String(path[0] ?? "") : "";
				const authHandled =
					operationName === "signup" ||
					operationName === "login" ||
					operationName === "changePassword";

				const code = String(extensions?.code ?? "");
				if (code === "UNAUTHENTICATED" || message.toLowerCase().includes("not authenticated")) {
					handleUnauthorized();
					return;
				}

				if (!authHandled) sweetErrorAlert(message);
			});
		}

		const statusCode =
			networkError && "statusCode" in networkError
				? (networkError as ServerError).statusCode
				: undefined;

		if (statusCode === 401) {
			handleUnauthorized();
		}
	});

	const splitLink = split(
		({ query }) => {
			const definition = getMainDefinition(query);
			return definition.kind === "OperationDefinition" && definition.operation === "subscription";
		},
		wsLink,
		authLink.concat(uploadLink),
	);

	return from([errorLink, splitLink]);
}

function createApolloClient() {
	return new ApolloClient({
		ssrMode: typeof window === "undefined",
		link: createIsomorphicLink(),
		cache: new InMemoryCache(),
		resolvers: {},
	});
}

export function initializeApollo(initialState: NormalizedCacheObject | null = null) {
	const _apolloClient = apolloClient ?? createApolloClient();
	if (initialState) _apolloClient.cache.restore(initialState);
	if (typeof window === "undefined") return _apolloClient;
	if (!apolloClient) apolloClient = _apolloClient;
	return _apolloClient;
}

export function useApollo(initialState: NormalizedCacheObject | null) {
	return useMemo(() => initializeApollo(initialState), [initialState]);
}
