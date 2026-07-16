import { Skeleton } from '@mui/material';

export const FlightCardSkeleton = () => (
	<article className="flight-card flight-card--skeleton" aria-hidden>
		<div className="flight-card__airline">
			<Skeleton variant="rounded" width={44} height={44} animation="wave" />
			<div>
				<Skeleton width={120} height={18} animation="wave" />
				<Skeleton width={90} height={14} animation="wave" sx={{ mt: 0.5 }} />
			</div>
		</div>
		<div className="flight-card__route">
			<Skeleton width={48} height={28} animation="wave" />
			<Skeleton width="100%" height={4} animation="wave" sx={{ mx: 2, flex: 1 }} />
			<Skeleton width={48} height={28} animation="wave" />
		</div>
		<div className="flight-card__fare">
			<Skeleton width={80} height={28} animation="wave" />
			<Skeleton variant="rounded" width={100} height={36} animation="wave" />
		</div>
	</article>
);

type FlightListSkeletonProps = {
	count?: number;
};

export const FlightListSkeleton = ({ count = 6 }: FlightListSkeletonProps) => (
	<div className="flights-list-skeleton">
		{Array.from({ length: count }, (_, index) => (
			<FlightCardSkeleton key={index} />
		))}
	</div>
);
