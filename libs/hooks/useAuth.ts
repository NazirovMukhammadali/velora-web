import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { getJwtToken, updateUserInfo } from '../auth';
import { clearJwtToken } from '../auth/token';
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
		if (!jwt) return;
		try {
			updateUserInfo(jwt);
		} catch {
			// Malformed token in storage — drop it so the user can sign in again.
			clearJwtToken();
		}
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
		// A token without a member id can never authorize; treat it like no token at all.
		if (jwt && !auth.user._id) clearJwtToken();
		if (!jwt || !auth.user._id) {
			const referrer = encodeURIComponent(router.asPath || '/');
			void router.replace(`/login?referrer=${referrer}`);
		}
	}, [auth.authReady, auth.user._id, router]);

	const isAuthorized = auth.authReady && Boolean(getJwtToken()) && Boolean(auth.user._id);

	return {
		...auth,
		isAuthorized,
	};
};

export default useAuth;
