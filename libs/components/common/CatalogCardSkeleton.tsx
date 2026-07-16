import { Skeleton } from '@mui/material';

export const CatalogCardSkeleton = () => (
	<article className="tour-card tour-card--skeleton" aria-hidden>
		<Skeleton variant="rectangular" height={175} animation="wave" />
		<div className="tour-card--skeleton-body">
			<Skeleton width="82%" height={22} animation="wave" />
			<Skeleton width="65%" height={16} animation="wave" sx={{ mt: 1 }} />
			<Skeleton width="55%" height={16} animation="wave" sx={{ mt: 0.75 }} />
			<Skeleton width="45%" height={26} animation="wave" sx={{ mt: 2 }} />
		</div>
	</article>
);

type CatalogGridSkeletonProps = {
	count?: number;
};

export const CatalogGridSkeleton = ({ count = 8 }: CatalogGridSkeletonProps) => (
	<div className="tour-grid">
		{Array.from({ length: count }, (_, index) => (
			<CatalogCardSkeleton key={index} />
		))}
	</div>
);
