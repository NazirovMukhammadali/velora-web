import { MemberAuthType, MemberStatus, MemberType } from '../enums/member.enum';
import type { Member } from '../types/member/member';

export type AgentSpecialty =
	| 'All'
	| 'City & Culture'
	| 'Mountains'
	| 'Beach & Islands'
	| 'Food & Wine'
	| 'Family';

export type ShowcaseAgent = {
	id: string;
	memberNick: string;
	memberFullName: string;
	memberImage: string;
	memberDesc: string;
	specialty: AgentSpecialty;
	location: string;
	rating: number;
	toursCount: number;
	memberLikes: number;
	memberViews: number;
	languages: string;
	isFeatured?: boolean;
	createdAt: string;
};

export const AGENT_SPECIALTIES: AgentSpecialty[] = [
	'All',
	'City & Culture',
	'Mountains',
	'Beach & Islands',
	'Food & Wine',
	'Family',
];

export const SHOWCASE_AGENTS: ShowcaseAgent[] = [
	{
		id: 'agent-adam',
		memberNick: 'adam.ferguson',
		memberFullName: 'Adam Ferguson',
		memberImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
		memberDesc: 'Alpine routes, glacier hikes, and photography-focused trekking groups.',
		specialty: 'Mountains',
		location: 'Zermatt, Switzerland',
		rating: 4.9,
		toursCount: 32,
		memberLikes: 412,
		memberViews: 2800,
		languages: 'English, German',
		isFeatured: true,
		createdAt: '2025-11-02T10:00:00Z',
	},
	{
		id: 'agent-sara',
		memberNick: 'sara.jameson',
		memberFullName: 'Sara Jameson',
		memberImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
		memberDesc: 'Museum skip-the-line tours, food walks, and hidden neighborhood gems.',
		specialty: 'City & Culture',
		location: 'Rome, Italy',
		rating: 4.8,
		toursCount: 28,
		memberLikes: 356,
		memberViews: 2100,
		languages: 'English, Italian',
		createdAt: '2025-10-18T10:00:00Z',
	},
	{
		id: 'agent-liam',
		memberNick: 'liam.obrien',
		memberFullName: 'Liam O.Brien',
		memberImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
		memberDesc: 'Island hopping, snorkeling days, and relaxed coastal itineraries.',
		specialty: 'Beach & Islands',
		location: 'Phuket, Thailand',
		rating: 4.9,
		toursCount: 40,
		memberLikes: 501,
		memberViews: 3200,
		languages: 'English',
		createdAt: '2025-12-01T10:00:00Z',
	},
	{
		id: 'agent-nora',
		memberNick: 'nora.park',
		memberFullName: 'Nora Park',
		memberImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&q=80',
		memberDesc: 'Kid-friendly pacing, stroller routes, and theme-park day planning.',
		specialty: 'Family',
		location: 'Orlando, USA',
		rating: 4.7,
		toursCount: 21,
		memberLikes: 198,
		memberViews: 1400,
		languages: 'English, Korean',
		createdAt: '2025-09-05T10:00:00Z',
	},
	{
		id: 'agent-carlos',
		memberNick: 'carlos.rivera',
		memberFullName: 'Carlos Rivera',
		memberImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80',
		memberDesc: 'Vineyard tastings, tapas trails, and sunset dinner experiences.',
		specialty: 'Food & Wine',
		location: 'Barcelona, Spain',
		rating: 4.9,
		toursCount: 35,
		memberLikes: 445,
		memberViews: 2650,
		languages: 'English, Spanish',
		createdAt: '2025-11-20T10:00:00Z',
	},
	{
		id: 'agent-mei',
		memberNick: 'mei.tanaka',
		memberFullName: 'Mei Tanaka',
		memberImage: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=600&q=80',
		memberDesc: 'Temple mornings, tea ceremonies, and quiet cultural immersion tours.',
		specialty: 'City & Culture',
		location: 'Kyoto, Japan',
		rating: 4.8,
		toursCount: 26,
		memberLikes: 310,
		memberViews: 1900,
		languages: 'English, Japanese',
		createdAt: '2025-10-30T10:00:00Z',
	},
	{
		id: 'agent-elena',
		memberNick: 'elena.voss',
		memberFullName: 'Elena Voss',
		memberImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
		memberDesc: 'Fjord cruises, northern lights hunts, and winter adventure planning.',
		specialty: 'Mountains',
		location: 'Bergen, Norway',
		rating: 4.9,
		toursCount: 29,
		memberLikes: 388,
		memberViews: 2400,
		languages: 'English, Norwegian',
		createdAt: '2025-11-12T10:00:00Z',
	},
	{
		id: 'agent-james',
		memberNick: 'james.okafor',
		memberFullName: 'James Okafor',
		memberImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
		memberDesc: 'Safari day trips, coastal drives, and boutique lodge recommendations.',
		specialty: 'Beach & Islands',
		location: 'Cape Town, South Africa',
		rating: 4.8,
		toursCount: 24,
		memberLikes: 275,
		memberViews: 1750,
		languages: 'English',
		createdAt: '2025-08-22T10:00:00Z',
	},
];

export const getShowcaseAgentById = (id: string): ShowcaseAgent | undefined =>
	SHOWCASE_AGENTS.find((agent) => agent.id === id);

export const isShowcaseAgentId = (id: string): boolean =>
	SHOWCASE_AGENTS.some((agent) => agent.id === id);

export const showcaseAgentToMember = (agent: ShowcaseAgent): Member =>
	({
		_id: agent.id,
		memberNick: agent.memberNick,
		memberFullName: agent.memberFullName,
		memberImage: agent.memberImage,
		memberDesc: agent.memberDesc,
		memberAddress: agent.location,
		memberLikes: agent.memberLikes,
		memberViews: agent.memberViews,
		memberProperties: agent.toursCount,
		memberRank: Math.round(agent.rating * 10),
		memberPoints: 0,
		memberArticles: 0,
		memberComments: 0,
		memberWarnings: 0,
		memberBlocks: 0,
		memberType: MemberType.AGENT,
		memberStatus: MemberStatus.ACTIVE,
		memberAuthType: MemberAuthType.PHONE,
		memberPhone: '',
		createdAt: new Date(agent.createdAt),
		updatedAt: new Date(agent.createdAt),
		meLiked: [],
	}) as Member;

export type AgentSortKey = 'recent' | 'rating' | 'tours' | 'likes' | 'name';

export const filterShowcaseAgents = (
	list: ShowcaseAgent[],
	opts: { search: string; specialty: AgentSpecialty; sort: AgentSortKey },
): ShowcaseAgent[] => {
	const q = opts.search.trim().toLowerCase();
	let result = list.filter((a) => {
		const matchSpecialty = opts.specialty === 'All' || a.specialty === opts.specialty;
		const matchSearch =
			!q ||
			a.memberFullName.toLowerCase().includes(q) ||
			a.memberNick.toLowerCase().includes(q) ||
			a.location.toLowerCase().includes(q) ||
			a.specialty.toLowerCase().includes(q);
		return matchSpecialty && matchSearch;
	});

	switch (opts.sort) {
		case 'rating':
			result = [...result].sort((a, b) => b.rating - a.rating);
			break;
		case 'tours':
			result = [...result].sort((a, b) => b.toursCount - a.toursCount);
			break;
		case 'likes':
			result = [...result].sort((a, b) => b.memberLikes - a.memberLikes);
			break;
		case 'name':
			result = [...result].sort((a, b) => a.memberFullName.localeCompare(b.memberFullName));
			break;
		default:
			result = [...result].sort(
				(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
			);
	}

	return result;
};
