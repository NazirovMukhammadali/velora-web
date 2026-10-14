import React, { useEffect, useMemo, useState } from 'react';
import { NextPage } from 'next';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack } from '@mui/material';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Member } from '../../libs/types/member/member';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { LIKE_TARGET_MEMBER } from '../../apollo/user/mutation';
import { GET_AGENTS } from '../../apollo/user/query';
import { T } from '../../libs/types/common';
import { Messages } from '../../libs/config';
import { sweetMixinErrorAlert } from '../../libs/sweetAlert';
import AgentListCard from '../../libs/components/agent/AgentListCard';
import CatalogPagination from '../../libs/components/common/CatalogPagination';
import {
	AGENT_SPECIALTIES,
	AgentSortKey,
	AgentSpecialty,
	SHOWCASE_AGENTS,
	filterShowcaseAgents,
	showcaseAgentToMember,
} from '../../libs/data/agents';
import { AGENT_INTRO_BG } from '../../libs/data/agentPage';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

/** Two rows of the 4-column grid. */
const AGENTS_PER_PAGE = 8;

const SORT_OPTIONS: { key: AgentSortKey; label: string }[] = [
	{ key: 'recent', label: 'Recently joined' },
	{ key: 'rating', label: 'Top rated' },
	{ key: 'tours', label: 'Most tours' },
	{ key: 'likes', label: 'Most liked' },
	{ key: 'name', label: 'Name A–Z' },
];

const parseInputQuery = (raw: unknown): any | null => {
	if (typeof raw !== 'string' || !raw) return null;
	try {
		const parsed = JSON.parse(raw);
		if (!parsed || typeof parsed !== 'object') return null;
		const page = Number(parsed.page);
		return {
			...parsed,
			page: Number.isInteger(page) && page > 0 ? page : 1,
			limit: AGENTS_PER_PAGE,
			search: parsed.search && typeof parsed.search === 'object' ? parsed.search : {},
		};
	} catch {
		return null;
	}
};

const AgentList: NextPage = ({ initialInput, ...props }: any) => {
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [searchFilter, setSearchFilter] = useState<any>(initialInput);
	const [filterReady, setFilterReady] = useState(false);
	const [apiAgents, setApiAgents] = useState<Member[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [searchText, setSearchText] = useState<string>('');
	const [specialty, setSpecialty] = useState<AgentSpecialty>('All');
	const [sort, setSort] = useState<AgentSortKey>('recent');
	const [localLikes, setLocalLikes] = useState<string[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [fallbackPage, setFallbackPage] = useState(1);

	const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);

	const {
		loading: getAgentsLoading,
		error: getAgentsError,
		refetch: getAgentsRefetch,
	} = useQuery(GET_AGENTS, {
		fetchPolicy: 'network-only',
		errorPolicy: 'all',
		variables: { input: searchFilter },
		skip: !filterReady,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setApiAgents(data?.getAgents?.list ?? []);
			setTotal(data?.getAgents?.metaCounter?.[0]?.total ?? 0);
		},
	});

	// Demo experts only stand in for an empty/unreachable directory, never for an empty search result.
	const hasApiSearch = Boolean(searchFilter?.search?.text?.trim());
	const usingFallback =
		filterReady && !getAgentsLoading && (Boolean(getAgentsError) || (apiAgents.length === 0 && !hasApiSearch));

	const showcaseFiltered = useMemo(
		() =>
			filterShowcaseAgents(SHOWCASE_AGENTS, {
				search: searchText,
				specialty,
				sort,
			}),
		[searchText, specialty, sort],
	);

	const displayAgents: Member[] = useMemo(() => {
		if (!usingFallback) return apiAgents;
		return showcaseFiltered.map(showcaseAgentToMember);
	}, [usingFallback, apiAgents, showcaseFiltered]);

	const paginatedAgents = useMemo(() => {
		if (!usingFallback) return displayAgents;
		const start = (fallbackPage - 1) * AGENTS_PER_PAGE;
		return displayAgents.slice(start, start + AGENTS_PER_PAGE);
	}, [usingFallback, displayAgents, fallbackPage]);

	// Hydrate filters from ?input= once the router is ready (shared links / refresh keep their page).
	useEffect(() => {
		if (!router.isReady || filterReady) return;
		const parsed = parseInputQuery(router.query.input);
		if (parsed) {
			setSearchFilter(parsed);
			setCurrentPage(parsed.page ?? 1);
			setSearchText(parsed.search?.text ?? '');
		} else {
			void router.replace(`/agent?input=${JSON.stringify(initialInput)}`, undefined, { shallow: true });
		}
		setFilterReady(true);
	}, [router, filterReady, initialInput]);

	useEffect(() => {
		setFallbackPage(1);
	}, [searchText, specialty, sort]);

	const applyApiSearch = () => {
		const next = {
			...searchFilter,
			page: 1,
			search: { ...searchFilter.search, text: searchText.trim() },
		};
		setSearchFilter(next);
		setCurrentPage(1);
		void router.replace(`/agent?input=${JSON.stringify(next)}`, undefined, { shallow: true });
	};

	const paginationChangeHandler = async (value: number) => {
		if (usingFallback) {
			setFallbackPage(value);
			return;
		}
		const next = { ...searchFilter, page: value };
		setSearchFilter(next);
		setCurrentPage(value);
		await router.push(`/agent?input=${JSON.stringify(next)}`, undefined, { shallow: true, scroll: false });
	};

	const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

	const getAgentLikeCount = (agent: Member) => {
		const base = agent.memberLikes ?? 0;
		if (!usingFallback) return base;
		return localLikes.includes(agent._id) ? base + 1 : base;
	};

	const likeMemberHandler = async (user: T, id: string) => {
		if (usingFallback) {
			setLocalLikes((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
			return;
		}
		try {
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);
			await likeTargetMember({ variables: { input: id } });
			await getAgentsRefetch({ input: searchFilter });
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const count = usingFallback ? displayAgents.length : total || displayAgents.length;
	const activePage = usingFallback ? fallbackPage : currentPage;

	return (
		<Stack className={'agent-list-page'} sx={{ '--agent-intro-bg': `url(${AGENT_INTRO_BG})` } as React.CSSProperties}>
			<Stack className={'container'}>
				<section className={'agent-page-hero'} aria-labelledby="agent-page-title">
					<div className={'agent-page-hero__inner'}>
						<span className={'agent-experts-eyebrow'}>Certified experts</span>
						<h1 id="agent-page-title" className={'agent-experts-title'}>
							Find your perfect travel guide
						</h1>
						<p className={'agent-page-sub'}>
							Browse verified agents by destination and specialty. Compare tour counts and ratings, then book packages
							directly with the expert you trust.
						</p>
						<div className={'agent-page-stats'}>
							<div>
								<strong>{count}</strong>
								<span>Experts</span>
							</div>
							<div>
								<strong>4.8</strong>
								<span>Avg rating</span>
							</div>
							<div>
								<strong>24/7</strong>
								<span>Velora support</span>
							</div>
						</div>
					</div>
				</section>

				{usingFallback && (
					<p className={'agent-demo-note'}>
						Our live agent directory is being updated — meanwhile, meet our curated Velora experts.
					</p>
				)}

				<Stack className={'agent-toolbar'}>
					<div className={'agent-toolbar-search'}>
						<input
							type="text"
							placeholder={'Search by name, city, or specialty…'}
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter' && !usingFallback) applyApiSearch();
							}}
						/>
						<button type="button" onClick={() => !usingFallback && applyApiSearch()}>
							Search
						</button>
					</div>

					<div className={'agent-toolbar-filters'}>
						<div className={'agent-specialty-row'}>
							<span>Specialty</span>
							<div className={'agent-specialty-pills'}>
								{AGENT_SPECIALTIES.map((item) => (
									<button
										key={item}
										type="button"
										className={specialty === item ? 'active' : ''}
										onClick={() => setSpecialty(item)}
										disabled={!usingFallback && item !== 'All'}
										title={!usingFallback && item !== 'All' ? 'Available with demo experts' : undefined}
									>
										{item}
									</button>
								))}
							</div>
						</div>

						<div className={'agent-toolbar-sort'}>
							<label htmlFor="agent-sort">Sort by</label>
							<select
								id="agent-sort"
								value={sort}
								onChange={(e) => setSort(e.target.value as AgentSortKey)}
								disabled={!usingFallback}
							>
								{SORT_OPTIONS.map((opt) => (
									<option key={opt.key} value={opt.key}>
										{opt.label}
									</option>
								))}
							</select>
						</div>
					</div>
				</Stack>

				<p className={'agent-results-line'}>
					<strong>{count}</strong> expert{count !== 1 ? 's' : ''} · {SORT_OPTIONS.find((o) => o.key === sort)?.label}
				</p>

				<Stack className={'card-wrap agent-experts-grid'}>
					{getAgentsLoading && displayAgents.length === 0 ? (
						<div className={'agent-loading'}>Loading experts…</div>
					) : displayAgents.length === 0 ? (
						<div className={'no-data'}>
							<img src="/img/icons/icoAlert.svg" alt="" />
							<p>No experts match your filters.</p>
						</div>
					) : (
						paginatedAgents.map((agent: Member) => (
							<AgentListCard
								key={agent._id}
								agent={agent}
								likeCount={getAgentLikeCount(agent)}
								liked={usingFallback ? localLikes.includes(agent._id) : Boolean(agent.meLiked?.[0]?.myFavorite)}
								onLike={() => likeMemberHandler(user, agent._id)}
							/>
						))
					)}
				</Stack>

				{displayAgents.length > 0 && (
					<CatalogPagination
						page={activePage}
						pageSize={AGENTS_PER_PAGE}
						total={count}
						label="experts"
						onChange={(value) => void paginationChangeHandler(value)}
					/>
				)}

				<button type="button" className="agent-back-top" onClick={scrollToTop} aria-label="Back to top">
					<KeyboardArrowUpRoundedIcon fontSize="small" />
				</button>
			</Stack>
		</Stack>
	);
};

AgentList.defaultProps = {
	initialInput: {
		page: 1,
		limit: AGENTS_PER_PAGE,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withLayoutBasic(AgentList);
