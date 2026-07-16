import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { getJwtToken, updateUserInfo } from '../auth';
import type { CustomJwtPayload } from '../types/customJwtPayload';

type UseAuthOptions = {
	/** Hydrate userVar from JWT on mount (use in layouts / navbar). Default false. */
	syncOnMount?: boolean;
};

export const useAuth = (options: UseAuthOptions = {}) => {
	const { syncOnMount = false } = options;
	const user = useReactiveVar(userVar);
	const [authReady, setAuthReady] = useState(false);
	const token = typeof window !== 'undefined' ? getJwtToken() ?? '' : '';
	const hasToken = Boolean(token);
	const isLoggedIn = Boolean(token && user._id);

	const syncUser = useCallback(() => {
		const jwt = getJwtToken();
		if (jwt) updateUserInfo(jwt);
	}, []);

	useEffect(() => {
		if (syncOnMount) syncUser();
		setAuthReady(true);
	}, [syncOnMount, syncUser]);

	return {
		user: user as CustomJwtPayload,
		token,
		hasToken,
		isLoggedIn,
		authReady,
		syncUser,
	};
};

/**
 * Protect account-only routes: wait for JWT hydration, then send guests to login.
 * Avoids redirecting logged-in users before userVar is synced from localStorage.
 */
export const useRequireAuth = () => {
	const router = useRouter();
	const auth = useAuth({ syncOnMount: true });

	useEffect(() => {
		if (!auth.authReady || !router.isReady) return;

		const jwt = getJwtToken();
		if (!jwt) {
			const referrer = encodeURIComponent(router.asPath || '/');
			void router.replace(`/login?referrer=${referrer}`);
		}
	}, [auth.authReady, router]);

	const isAuthorized = auth.authReady && Boolean(getJwtToken()) && Boolean(auth.user._id);

	return {
		...auth,
		isAuthorized,
	};
};

export default useAuth;
