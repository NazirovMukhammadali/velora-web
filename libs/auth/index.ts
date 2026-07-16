import decodeJWT from "jwt-decode";
import { initializeApollo } from "../../apollo/client";
import { userVar } from "../../apollo/store";
import { CustomJwtPayload } from "../types/customJwtPayload";
import { sweetMixinErrorAlert } from "../sweetAlert";
import { LOGIN, SIGN_UP } from "../../apollo/user/mutation";

export type PublicSignupMemberType = "USER" | "AGENT";

export function getJwtToken(): any {
	if (typeof window !== "undefined") {
		return localStorage.getItem("accessToken") ?? "";
	}
}

export function setJwtToken(token: string) {
	localStorage.setItem("accessToken", token);
}

/**
 * Surface readable auth / signup validation failures to the user.
 * Prefer GraphQL messages from the API so validation rules stay clear.
 */
const reportAuthError = async (err: any): Promise<void> => {
	const graphQLMessages: string[] = (err?.graphQLErrors ?? [])
		.map((item: { message?: string }) => item?.message)
		.filter((message: string | undefined): message is string => Boolean(message));

	if (graphQLMessages.length > 0) {
		const graphQLMessage = graphQLMessages.join(" ");

		if (graphQLMessage.includes("login and password") || graphQLMessage.includes("Wrong password")) {
			await sweetMixinErrorAlert("Please check your password again");
			return;
		}
		if (graphQLMessage.toLowerCase().includes("blocked")) {
			await sweetMixinErrorAlert("User has been blocked!");
			return;
		}

		await sweetMixinErrorAlert(graphQLMessage);
		return;
	}

	if (err?.networkError) {
		await sweetMixinErrorAlert(
			"Cannot reach the server. Please make sure the backend is running."
		);
		return;
	}

	await sweetMixinErrorAlert("Something went wrong. Please try again.");
};

export const logIn = async (nick: string, password: string): Promise<void> => {
	const { jwtToken } = await requestJwtToken({ nick, password });

	if (jwtToken) {
		updateStorage({ jwtToken });
		updateUserInfo(jwtToken);
	}
};

const requestJwtToken = async ({
	nick,
	password,
}: {
	nick: string;
	password: string;
}): Promise<{ jwtToken: string }> => {
	const apolloClient = await initializeApollo();

	try {
		const result = await apolloClient.mutate({
			mutation: LOGIN,
			variables: { input: { memberNick: nick, memberPassword: password } },
			fetchPolicy: "network-only",
		});

		const { accessToken } = result?.data?.login;

		return { jwtToken: accessToken };
	} catch (err: any) {
		await reportAuthError(err);
		throw new Error("token error");
	}
};

export const signUp = async (
	nick: string,
	password: string,
	phone: string,
	type: PublicSignupMemberType
): Promise<void> => {
	if (type !== "USER" && type !== "AGENT") {
		await sweetMixinErrorAlert("Public signup allows only Traveler or Agent.");
		throw new Error("invalid signup member type");
	}

	const { jwtToken } = await requestSignUpJwtToken({
		nick,
		password,
		phone,
		type,
	});

	if (jwtToken) {
		updateStorage({ jwtToken });
		updateUserInfo(jwtToken);
	}
};

const requestSignUpJwtToken = async ({
	nick,
	password,
	phone,
	type,
}: {
	nick: string;
	password: string;
	phone: string;
	type: PublicSignupMemberType;
}): Promise<{ jwtToken: string }> => {
	const apolloClient = await initializeApollo();

	try {
		const result = await apolloClient.mutate({
			mutation: SIGN_UP,
			variables: {
				input: {
					memberNick: nick,
					memberPassword: password,
					memberPhone: phone,
					memberType: type,
				},
			},
			fetchPolicy: "network-only",
		});

		const { accessToken } = result?.data?.signup;

		return { jwtToken: accessToken };
	} catch (err: any) {
		await reportAuthError(err);
		throw new Error("token error");
	}
};

export const updateStorage = ({ jwtToken }: { jwtToken: any }) => {
	setJwtToken(jwtToken);
	window.localStorage.setItem("login", Date.now().toString());
};

export const updateUserInfo = (jwtToken: any) => {
	if (!jwtToken) return false;

	const claims = decodeJWT<CustomJwtPayload>(jwtToken);
	userVar({
		_id: claims._id ?? "",
		memberType: claims.memberType ?? "",
		memberStatus: claims.memberStatus ?? "",
		memberAuthType: claims.memberAuthType,
		memberPhone: claims.memberPhone ?? "",
		memberNick: claims.memberNick ?? "",
		memberFullName: claims.memberFullName ?? "",
		memberImage:
			claims.memberImage === null || claims.memberImage === undefined
				? "/img/profile/defaultUser.svg"
				: `${claims.memberImage}`,
		memberAddress: claims.memberAddress ?? "",
		memberDesc: claims.memberDesc ?? "",
		memberRank: claims.memberRank,
		memberArticles: claims.memberArticles,
		memberPoints: claims.memberPoints,
		memberLikes: claims.memberLikes,
		memberViews: claims.memberViews,
		memberWarnings: claims.memberWarnings,
		memberBlocks: claims.memberBlocks,
	});
};

export const logOut = () => {
	deleteStorage();
	deleteUserInfo();
	window.location.reload();
	// window.location.href = "/"
};

const deleteStorage = () => {
	localStorage.removeItem("accessToken");
	window.localStorage.setItem("logout", Date.now().toString());
};

const deleteUserInfo = () => {
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
};
