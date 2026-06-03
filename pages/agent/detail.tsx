import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import ReviewCard from '../../libs/components/agent/ReviewCard';
import { Box, Button, Pagination, Stack, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import { Member } from '../../libs/types/member/member';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { userVar } from '../../apollo/store';
import { CommentInput, CommentsInquiry } from '../../libs/types/comment/comment.input';
import { Comment } from '../../libs/types/comment/comment';
import { CommentGroup } from '../../libs/enums/comment.enum';
import { Messages, REACT_APP_API_URL } from '../../libs/config';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { CREATE_COMMENT, CREATE_TOUR_BOOKING } from '../../apollo/user/mutation';
import { GET_AGENT_TOURS, GET_COMMENTS, GET_MEMBER } from '../../apollo/user/query';
import { T } from '../../libs/types/common';
import { Message } from '../../libs/enums/common.enum';
import { getShowcaseAgentById, showcaseAgentToMember } from '../../libs/data/agents';


export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const AgentDetail: NextPage = ({ initialInput, initialComment, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const agentId = typeof router.query.agentId === 'string' ? router.query.agentId : null;
	const [apiAgent, setApiAgent] = useState<Member | null>(null);
	const [tourInquiry, setTourInquiry] = useState<any>(initialInput);
	const [agentTours, setAgentTours] = useState<any[]>([]);
	const [tourTotal, setTourTotal] = useState<number>(0);
	const [commentInquiry, setCommentInquiry] = useState<CommentsInquiry>(initialComment);
	const [agentComments, setAgentComments] = useState<Comment[]>([]);
	const [commentTotal, setCommentTotal] = useState<number>(0);
	const [insertCommentData, setInsertCommentData] = useState<CommentInput>({
		commentGroup: CommentGroup.MEMBER,
		commentContent: '',
		commentRefId: '',
	});

	const showcaseAgent = useMemo(
		() => (agentId ? getShowcaseAgentById(agentId) : undefined),
		[agentId],
	);

	const showcaseMember = useMemo(
		() => (showcaseAgent ? showcaseAgentToMember(showcaseAgent) : null),
		[showcaseAgent],
	);

	const usingShowcase = Boolean(showcaseMember);
	const agent = showcaseMember ?? apiAgent;

	/** APOLLO REQUESTS — skipped for curated demo experts (no backend fetch) **/
	const [createComment] = useMutation(CREATE_COMMENT);
	const [createTourBooking] = useMutation(CREATE_TOUR_BOOKING);

	const { data: memberData, loading: memberLoading } = useQuery(GET_MEMBER, {
		fetchPolicy: 'network-only',
		errorPolicy: 'all',
		variables: { input: agentId },
		skip: !agentId || usingShowcase,
		notifyOnNetworkStatusChange: true,
	});

	useEffect(() => {
		if (!memberData?.getMember || usingShowcase) return;
		const member = memberData.getMember as Member;
		setApiAgent(member);
		setCommentInquiry((prev) => ({
			...prev,
			search: { commentRefId: member._id },
		}));
		setInsertCommentData((prev) => ({
			...prev,
			commentRefId: member._id,
		}));
	}, [memberData, usingShowcase]);

	useEffect(() => {
		if (!showcaseMember) return;
		setCommentInquiry((prev) => ({
			...prev,
			search: { commentRefId: showcaseMember._id },
		}));
		setInsertCommentData((prev) => ({
			...prev,
			commentRefId: showcaseMember._id,
		}));
	}, [showcaseMember]);

	useQuery(GET_AGENT_TOURS, {
		fetchPolicy: 'network-only',
		errorPolicy: 'all',
		variables: {
			agentId,
			input: tourInquiry,
		},
		skip: !agentId || usingShowcase,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAgentTours(data?.getAgentTours?.list ?? []);
			setTourTotal(data?.getAgentTours?.metaCounter[0]?.total ?? 0);
		},
	});

	const { refetch: refetchComments } = useQuery(GET_COMMENTS, {
		fetchPolicy: 'network-only',
		errorPolicy: 'all',
		variables: {
			input: commentInquiry,
		},
		skip: usingShowcase || !commentInquiry.search.commentRefId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAgentComments(data?.getComments?.list);
			setCommentTotal(data?.getComments?.metaCounter?.[0]?.total ?? 0);
		},
	});

	/** HANDLERS **/
	const redirectToMemberPageHandler = async (memberId: string) => {
		try {
			if (memberId === user?._id)
				await router.push(`/mypage?memberId=${memberId}`);
			else await router.push(`/member?memberId=${memberId}`);
		} catch (error) {
			await sweetErrorHandling(error);
		}
	};

	const propertyPaginationChangeHandler = async (
		event: ChangeEvent<unknown>,
		value: number
	) => {
		tourInquiry.page = value;
		setTourInquiry({ ...tourInquiry });
	};

	const commentPaginationChangeHandler = async (
		event: ChangeEvent<unknown>,
		value: number
	) => {
		commentInquiry.page = value;
		setCommentInquiry({ ...commentInquiry });
	};

	const createCommentHandler = async () => {
		try {
			if (usingShowcase) throw new Error('Reviews are available when the Nestar backend is connected.');
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			if (user._id === agentId) throw new Error('Cannot write a review for yourself');
			await createComment({ variables: { input: insertCommentData } });
			setInsertCommentData({ ...insertCommentData, commentContent: '' });
			await refetchComments();
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const createBookingHandler = async (tourId: string) => {
		try {
			if (!user._id) throw new Error(Messages.error2);
			await createTourBooking({ variables: { input: { tourId } } });
			await sweetTopSmallSuccessAlert("success", 800);
			await router.push('/bookings');
		} catch (err: any) {
			console.log("ERROR, createBookingHandler:", err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (device === 'mobile') {
		return <div>AGENT DETAIL PAGE MOBILE</div>;
	}

	const agentImage = usingShowcase
		? agent?.memberImage || '/img/profile/defaultUser.svg'
		: agent?.memberImage
			? `${REACT_APP_API_URL}/${agent.memberImage}`
			: '/img/profile/defaultUser.svg';

	if ((!router.isReady || (memberLoading && !usingShowcase)) && !agent) {
		return (
			<Stack className={'agent-detail-page'}>
				<Stack className={'container'}>
					<p style={{ padding: '48px 0', textAlign: 'center', color: '#6b7280' }}>Loading expert…</p>
				</Stack>
			</Stack>
		);
	}

	if (!agent) {
		return (
			<Stack className={'agent-detail-page'}>
				<Stack className={'container'}>
					<div className={'no-data'}>
						<img src="/img/icons/icoAlert.svg" alt="" />
						<p>Expert not found.</p>
					</div>
				</Stack>
			</Stack>
		);
	}

	return (
			<Stack className={'agent-detail-page'}>
				<Stack className={'container'}>
					{usingShowcase && (
						<p className={'agent-demo-note'} style={{ marginBottom: 20 }}>
							Demo expert profile — connect Nestar backend for live agent data and tours.
						</p>
					)}
					<Stack className={'agent-info'}>
						<img src={agentImage} alt={agent.memberFullName ?? agent.memberNick ?? 'Agent'} />
						<Box component={'div'} className={'info'} onClick={() => redirectToMemberPageHandler(agent?._id as string)}>
							<strong>{agent?.memberFullName ?? agent?.memberNick}</strong>
							<div>
								<img src="/img/icons/call.svg" alt="" />
								<span>{agent?.memberPhone}</span>
							</div>
						</Box>
					</Stack>
					<Stack className={'agent-home-list'}>
						<Stack className={'card-wrap'}>
							{agentTours.map((tour: any) => {
								return (
									<div className={'wrap-main'} key={tour?._id}>
										<Stack
											sx={{
												border: '1px solid #e5e7eb',
												borderRadius: '12px',
												padding: '16px',
												gap: '12px',
												backgroundColor: '#fff',
											}}
										>
											<img
												src={tour?.tourImages?.[0] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'}
												alt={tour?.tourTitle || 'Tour'}
												style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '10px' }}
											/>
											<Typography variant="h6">{tour?.tourTitle}</Typography>
											<Typography variant="body2">
												{tour?.tourLocation} | {tour?.tourDays}D/{tour?.tourNights ?? 0}N
											</Typography>
											<Typography variant="body1" sx={{ fontWeight: 700 }}>
												${tour?.tourPrice}
											</Typography>
											<Button variant="contained" onClick={() => createBookingHandler(tour?._id)}>
												Book Tour
											</Button>
										</Stack>
									</div>
								);
							})}
						</Stack>
						<Stack className={'pagination'}>
							{tourTotal ? (
								<>
									<Stack className="pagination-box">
										<Pagination
											page={tourInquiry.page}
											count={Math.ceil(tourTotal / tourInquiry.limit) || 1}
											onChange={propertyPaginationChangeHandler}
											shape="circular"
											color="primary"
										/>
									</Stack>
									<span>
										Total {tourTotal} tour package{tourTotal > 1 ? 's' : ''} available
									</span>
								</>
							) : (
								<div className={'no-data'}>
									<img src="/img/icons/icoAlert.svg" alt="" />
									<p>No tour packages found!</p>
								</div>
							)}
						</Stack>
					</Stack>
					<Stack className={'review-box'}>
						<Stack className={'main-intro'}>
							<span>Reviews</span>
							<p>we are glad to see you again</p>
						</Stack>
						{commentTotal !== 0 && (
							<Stack className={'review-wrap'}>
								<Box component={'div'} className={'title-box'}>
									<StarIcon />
									<span>
										{commentTotal} review{commentTotal > 1 ? 's' : ''}
									</span>
								</Box>
								{agentComments?.map((comment: Comment) => {
									return <ReviewCard comment={comment} key={comment?._id} />;
								})}
								<Box component={'div'} className={'pagination-box'}>
									<Pagination
										page={commentInquiry.page}
										count={Math.ceil(commentTotal / commentInquiry.limit) || 1}
										onChange={commentPaginationChangeHandler}
										shape="circular"
										color="primary"
									/>
								</Box>
							</Stack>
						)}

						<Stack className={'leave-review-config'}>
							<Typography className={'main-title'}>Leave A Review</Typography>
							<Typography className={'review-title'}>Review</Typography>
							<textarea
								onChange={({ target: { value } }: any) => {
									setInsertCommentData({ ...insertCommentData, commentContent: value });
								}}
								value={insertCommentData.commentContent}
							></textarea>
							<Box className={'submit-btn'} component={'div'}>
								<Button
									className={'submit-review'}
									disabled={insertCommentData.commentContent === '' || user?._id === ''}
									onClick={createCommentHandler}
								>
									<Typography className={'title'}>Submit Review</Typography>
									<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
										<g clipPath="url(#clip0_6975_3642)">
											<path
												d="M16.1571 0.5H6.37936C6.1337 0.5 5.93491 0.698792 5.93491 0.944458C5.93491 1.19012 6.1337 1.38892 6.37936 1.38892H15.0842L0.731781 15.7413C0.558156 15.915 0.558156 16.1962 0.731781 16.3698C0.818573 16.4566 0.932323 16.5 1.04603 16.5C1.15974 16.5 1.27345 16.4566 1.36028 16.3698L15.7127 2.01737V10.7222C15.7127 10.9679 15.9115 11.1667 16.1572 11.1667C16.4028 11.1667 16.6016 10.9679 16.6016 10.7222V0.944458C16.6016 0.698792 16.4028 0.5 16.1571 0.5Z"
												fill="#181A20"
											/>
										</g>
										<defs>
											<clipPath id="clip0_6975_3642">
												<rect width="16" height="16" fill="white" transform="translate(0.601562 0.5)" />
											</clipPath>
										</defs>
									</svg>
								</Button>
							</Box>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
	);
};

AgentDetail.defaultProps = {
	initialInput: {
		page: 1,
		limit: 6,
		sort: 'createdAt',
		direction: 'DESC',
	},
	initialComment: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: 'ASC',
		search: {
			commentRefId: '',
		},
	},
};

export default withLayoutBasic(AgentDetail);
