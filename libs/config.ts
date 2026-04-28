const DEFAULT_API_URL = "http://127.0.0.1:3007";
const DEFAULT_GRAPHQL_URL = `${DEFAULT_API_URL}/graphql`;
const DEFAULT_WS_URL = "ws://127.0.0.1:3007/graphql";

const resolveEnv = (...values: Array<string | undefined>) => {
	for (const value of values) {
		if (value && value.trim().length > 0) return value;
	}
	return undefined;
};

export const API_BASE_URL =
	resolveEnv(process.env.NEXT_PUBLIC_API_URL, process.env.REACT_APP_API_URL) ??
	DEFAULT_API_URL;

export const API_GRAPHQL_URL =
	resolveEnv(
		process.env.NEXT_PUBLIC_API_GRAPHQL_URL,
		process.env.REACT_APP_API_GRAPHQL_URL
	) ?? DEFAULT_GRAPHQL_URL;

export const API_WS_URL =
	resolveEnv(process.env.NEXT_PUBLIC_API_WS_URL, process.env.REACT_APP_API_WS) ??
	DEFAULT_WS_URL;

// Backward-compatible alias used across legacy components.
export const REACT_APP_API_URL = API_BASE_URL;

export const availableOptions = ['propertyBarter', 'propertyRent'];

const thisYear = new Date().getFullYear();

export const propertyYears: any = [];

for (let i = 1970; i <= thisYear; i++) {
	propertyYears.push(String(i));
}

export const propertySquare = [0, 25, 50, 75, 100, 125, 150, 200, 300, 500];

export const Messages = {
	error1: 'Something went wrong!',
	error2: 'Please login first!',
	error3: 'Please fulfill all inputs!',
	error4: 'Message is empty!',
	error5: 'Only images with jpeg, jpg, png format allowed!',
};

export const topPropertyRank = 2;
