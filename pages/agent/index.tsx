import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack, Pagination } from '@mui/material';
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
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import AgentListCard from '../../libs/components/agent/AgentListCard';
import {
	AGENT_SPECIALTIES,
	AgentSortKey,
	AgentSpecialty,
	SHOWCASE_AGENTS,
	filterShowcaseAgents,
	showcaseAgentToMember,
} from '../../libs/data/agents';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const AGENTS_PER_PAGE = 10;

const SORT_OPTIONS: { key: AgentSortKey; label: string }[] = [
	{ key: 'recent', label: 'Recently joined' },
	{ key: 'rating', label: 'Top rated' },
	{ key: 'tours', label: 'Most tours' },
	{ key: 'likes', label: 'Most liked' },
	{ key: 'name', label: 'Name A–Z' },
];

const AgentList: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [searchFilter, setSearchFilter] = useState<any>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);
	const [apiAgents, setApiAgents] = useState<Member[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [searchText, setSearchText] = useState<string>('');
	const [specialty, setSpecialty] = useState<AgentSpecialty>('All');
	const [sort, setSort] = useState<AgentSortKey>('recent');
	const [localLikes, setLocalLikes] = useState<string[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [fallbackPage, setFallbackPage] = useState(1);

	const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);

	const { loading: getAgentsLoading, error: getAgentsError, refetch: getAgentsRefetch } = useQuery(
		GET_AGENTS,
		{
			fetchPolicy: 'network-only',
			errorPolicy: 'all',
			variables: { input: searchFilter },
			notifyOnNetworkStatusChange: true,
			onCompleted: (data: T) => {
				setApiAgents(data?.getAgents?.list ?? []);
				setTotal(data?.getAgents?.metaCounter?.[0]?.total ?? 0);
			},
		},
	);

	const usingFallback = !getAgentsLoading && (Boolean(getAgentsError) || apiAgents.length === 0);

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

	const fallbackPageCount = Math.max(1, Math.ceil(displayAgents.length / AGENTS_PER_PAGE));

	const paginatedAgents = useMemo(() => {
		if (!usingFallback) return displayAgents;
		const start = (fallbackPage - 1) * AGENTS_PER_PAGE;
		return displayAgents.slice(start, start + AGENTS_PER_PAGE);
	}, [usingFallback, displayAgents, fallbackPage]);

	useEffect(() => {
		if (!router.query.input && searchFilter) {
			void router.replace(`/agent?input=${JSON.stringify(searchFilter)}`, undefined, { shallow: true });
		}
	}, []);

	useEffect(() => {
		setFallbackPage(1);
	}, [searchText, specialty, sort]);

	const applyApiSearch = () => {
		setSearchFilter({
			...searchFilter,
			page: 1,
			search: { ...searchFilter.search, text: searchText },
		});
		setCurrentPage(1);
	};

	const paginationChangeHandler = async (_: ChangeEvent<unknown>, value: number) => {
		if (usingFallback) {
			setFallbackPage(value);
			scrollToTop();
			return;
		}
		const next = { ...searchFilter, page: value };
		setSearchFilter(next);
		setCurrentPage(value);
		await router.push(`/agent?input=${JSON.stringify(next)}`, undefined, { shallow: true });
		scrollToTop();
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
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (device === 'mobile') {
		return <h1>AGENTS PAGE MOBILE</h1>;
	}

	const count = usingFallback ? displayAgents.length : total || displayAgents.length;
	const activePage = usingFallback ? fallbackPage : currentPage;
	const pageCount = usingFallback
		? fallbackPageCount
		: Math.max(1, Math.ceil(total / searchFilter.limit));
	const showPagination = usingFallback
		? displayAgents.length > AGENTS_PER_PAGE
		: total > searchFilter.limit;

	return (
		<Stack className={'agent-list-page'}>
			<Stack className={'container'}>
				<section className={'agent-page-hero'} aria-labelledby="agent-page-title">
					<div className={'agent-page-hero__inner'}>
						<span className={'agent-experts-eyebrow'}>Meet with guide</span>
						<h1 id="agent-page-title" className={'agent-experts-title'}>
							Find your perfect travel expert
						</h1>
						<p className={'agent-page-sub'}>
							Verified locals and certified agents — not tour packages. Compare specialties, ratings, and
							tour counts, then book directly with the expert you trust.
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
						Live agent directory is empty — showing curated Velora experts. Connect Nestar backend to load
						real agents.
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
										title={
											!usingFallback && item !== 'All' ? 'Available with demo experts' : undefined
										}
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
					<strong>{count}</strong> expert{count !== 1 ? 's' : ''} ·{' '}
					{SORT_OPTIONS.find((o) => o.key === sort)?.label}
				</p>

				<Stack className={'card-wrap agent-experts-grid'}>
					{getAgentsLoading ? (
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
								useExternalImage={usingFallback}
								likeCount={getAgentLikeCount(agent)}
								liked={
									usingFallback
										? localLikes.includes(agent._id)
										: Boolean(agent.meLiked?.[0]?.myFavorite)
								}
								onLike={() => likeMemberHandler(user, agent._id)}
							/>
						))
					)}
				</Stack>

				{displayAgents.length > 0 && showPagination && (
					<Stack className={'pagination'}>
						<Pagination
							page={activePage}
							count={pageCount}
							onChange={paginationChangeHandler}
							shape="circular"
							color="primary"
						/>
						<span>
							{usingFallback
								? `Showing ${(fallbackPage - 1) * AGENTS_PER_PAGE + 1}–${Math.min(
										fallbackPage * AGENTS_PER_PAGE,
										count,
									)} of ${count} experts`
								: `Total ${total} agent${total !== 1 ? 's' : ''} from server`}
						</span>
					</Stack>
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
		limit: 12,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withLayoutBasic(AgentList);
