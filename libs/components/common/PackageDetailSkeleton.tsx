import { Skeleton, Stack } from '@mui/material';

export const PackageDetailSkeleton = () => (
	<div className="pkg-detail-page pkg-detail-page--skeleton" aria-busy aria-label="Loading package details">
		<Skeleton width={280} height={20} animation="wave" sx={{ mb: 2 }} />

		<Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3, gap: 2 }}>
			<div style={{ flex: 1 }}>
				<Skeleton width="70%" height={40} animation="wave" />
				<Skeleton width="40%" height={20} animation="wave" sx={{ mt: 1.5 }} />
				<Skeleton width="30%" height={18} animation="wave" sx={{ mt: 1 }} />
			</div>
			<Skeleton width={140} height={48} animation="wave" />
		</Stack>

		<div className="pkg-gallery pkg-gallery--skeleton">
			<Skeleton variant="rounded" height={360} animation="wave" sx={{ borderRadius: '16px' }} />
			<div className="pkg-gallery-side">
				<Skeleton variant="rounded" height={170} animation="wave" sx={{ borderRadius: '12px' }} />
				<div className="pkg-gallery-row">
					<Skeleton variant="rounded" height={170} animation="wave" sx={{ borderRadius: '12px', flex: 1 }} />
					<Skeleton variant="rounded" height={170} animation="wave" sx={{ borderRadius: '12px', flex: 1 }} />
				</div>
			</div>
		</div>

		<Stack direction="row" gap={2} sx={{ my: 3 }}>
			{Array.from({ length: 4 }).map((_, index) => (
				<Skeleton key={index} variant="rounded" height={72} animation="wave" sx={{ flex: 1, borderRadius: '12px' }} />
			))}
		</Stack>

		<div className="pkg-detail-layout">
			<div className="pkg-detail-main">
				<Skeleton width="35%" height={28} animation="wave" sx={{ mb: 2 }} />
				<Skeleton width="100%" height={16} animation="wave" />
				<Skeleton width="95%" height={16} animation="wave" sx={{ mt: 1 }} />
				<Skeleton width="88%" height={16} animation="wave" sx={{ mt: 1 }} />
				<Skeleton width="60%" height={28} animation="wave" sx={{ mt: 4, mb: 2 }} />
				{Array.from({ length: 4 }).map((_, index) => (
					<Skeleton key={index} width={`${90 - index * 8}%`} height={16} animation="wave" sx={{ mt: 1 }} />
				))}
			</div>
			<aside className="pkg-booking pkg-booking--skeleton">
				<Skeleton width="60%" height={28} animation="wave" sx={{ mb: 2 }} />
				<Skeleton variant="rounded" height={44} animation="wave" sx={{ mb: 2 }} />
				<Skeleton variant="rounded" height={120} animation="wave" sx={{ mb: 2 }} />
				<Skeleton variant="rounded" height={48} animation="wave" sx={{ mb: 2 }} />
				<Skeleton variant="rounded" height={48} animation="wave" />
			</aside>
		</div>
	</div>
);

export const FlightDetailSkeleton = () => (
	<div className="pkg-detail-page pkg-detail-page--skeleton" aria-busy aria-label="Loading flight details">
		<Skeleton width={320} height={20} animation="wave" sx={{ mb: 2 }} />

		<Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3, gap: 2 }}>
			<div style={{ flex: 1 }}>
				<Skeleton width="65%" height={40} animation="wave" />
				<Skeleton width="45%" height={20} animation="wave" sx={{ mt: 1.5 }} />
			</div>
			<Skeleton width={140} height={48} animation="wave" />
		</Stack>

		<Skeleton variant="rounded" height={120} animation="wave" sx={{ borderRadius: '16px', mb: 3 }} />

		<Stack direction="row" gap={2} sx={{ mb: 3 }}>
			{Array.from({ length: 4 }).map((_, index) => (
				<Skeleton key={index} variant="rounded" height={72} animation="wave" sx={{ flex: 1, borderRadius: '12px' }} />
			))}
		</Stack>

		<div className="pkg-detail-layout">
			<div className="pkg-detail-main">
				<Skeleton width="40%" height={28} animation="wave" sx={{ mb: 2 }} />
				<Skeleton width="100%" height={16} animation="wave" />
				<Skeleton width="92%" height={16} animation="wave" sx={{ mt: 1 }} />
				<Skeleton width="50%" height={28} animation="wave" sx={{ mt: 4, mb: 2 }} />
				{Array.from({ length: 3 }).map((_, index) => (
					<Skeleton key={index} width={`${85 - index * 10}%`} height={16} animation="wave" sx={{ mt: 1 }} />
				))}
			</div>
			<aside className="pkg-booking pkg-booking--skeleton">
				<Skeleton width="70%" height={28} animation="wave" sx={{ mb: 2 }} />
				<Skeleton variant="rounded" height={80} animation="wave" sx={{ mb: 2 }} />
				<Skeleton variant="rounded" height={44} animation="wave" sx={{ mb: 2 }} />
				<Skeleton variant="rounded" height={56} animation="wave" sx={{ mb: 2 }} />
				<Skeleton variant="rounded" height={48} animation="wave" />
			</aside>
		</div>
	</div>
);
