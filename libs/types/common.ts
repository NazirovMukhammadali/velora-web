import type { ChangeEvent, SyntheticEvent } from 'react';

/**
 * Loose alias kept for backward compatibility with legacy Nestar components.
 *
 * @deprecated Prefer an explicit type for new code — e.g. the form-event aliases
 * (`InputChangeEvent`, `SelectChangeEvent`) or the GraphQL envelope helpers
 * (`ListEnvelope`, `MetaCounter`) defined below.
 */
export type T = any;

/** DOM change-event aliases for typed form handlers (replaces `e: any`). */
export type InputChangeEvent = ChangeEvent<HTMLInputElement>;
export type SelectChangeEvent = ChangeEvent<HTMLSelectElement>;
export type TextAreaChangeEvent = ChangeEvent<HTMLTextAreaElement>;
export type FormSubmitEvent = SyntheticEvent<HTMLFormElement>;

/** Pagination counter returned by Nestar list queries. */
export interface MetaCounter {
	total: number;
}

/** Standard envelope shape for paginated GraphQL list responses. */
export interface ListEnvelope<TNode> {
	list: TNode[];
	metaCounter: MetaCounter[];
}

export interface MeLiked {
	memberId: string;
	likeRefId: string;
	myFavorite: boolean;
}

export interface TotalCounter {
	total: number;
}
