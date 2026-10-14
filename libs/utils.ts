import numeral from 'numeral';
import { sweetMixinErrorAlert } from './sweetAlert';

type MutateFn = (options: { variables: { input: string } }) => Promise<unknown>;

const errorMessage = (err: unknown): string => (err instanceof Error ? err.message : 'Something went wrong');

export const formatterStr = (value: number | undefined): string => {
	return numeral(value).format('0,0') != '0' ? numeral(value).format('0,0') : '';
};

export const likeTargetBoardArticleHandler = async (likeTargetBoardArticle: MutateFn, id: string) => {
	try {
		await likeTargetBoardArticle({
			variables: {
				input: id,
			},
		});
	} catch (err: unknown) {
		await sweetMixinErrorAlert(errorMessage(err));
	}
};

export const likeTargetMemberHandler = async (likeTargetMember: MutateFn, id: string) => {
	try {
		await likeTargetMember({
			variables: {
				input: id,
			},
		});
	} catch (err: unknown) {
		await sweetMixinErrorAlert(errorMessage(err));
	}
};
