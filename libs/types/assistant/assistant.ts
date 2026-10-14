export type AssistantSourceType = 'hotel' | 'tour' | 'rentcar' | 'flight';

export type AssistantSource = {
	type: AssistantSourceType | string;
	title: string;
	url: string;
	priceUsd: number;
	image?: string | null;
};

export type AssistantReply = {
	answer: string;
	category: string;
	aiPowered: boolean;
	suggestions: string[];
	sources: AssistantSource[];
};

export type AssistantMessage =
	| { id: string; role: 'user'; text: string }
	| ({ id: string; role: 'assistant'; text: string; error?: boolean } & Partial<Omit<AssistantReply, 'answer'>>);
