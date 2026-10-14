import Image from 'next/image';
import { useEffect, useState } from 'react';

type VeloraImageProps = {
	src: string;
	alt: string;
	fallback?: string;
	fill?: boolean;
	width?: number;
	height?: number;
	className?: string;
	sizes?: string;
	priority?: boolean;
	/** Skip the Next image optimizer (e.g. user avatars from arbitrary hosts). */
	unoptimized?: boolean;
};

const VeloraImage = ({
	src,
	alt,
	fallback,
	fill = false,
	width,
	height,
	className = 'velora-img',
	sizes,
	priority = false,
	unoptimized = false,
}: VeloraImageProps) => {
	const [currentSrc, setCurrentSrc] = useState(src);

	useEffect(() => {
		setCurrentSrc(src);
	}, [src]);

	const handleError = () => {
		if (fallback && currentSrc !== fallback) setCurrentSrc(fallback);
	};

	if (fill) {
		return (
			<Image
				src={currentSrc}
				alt={alt}
				fill
				className={className}
				sizes={sizes ?? '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
				onError={handleError}
				priority={priority}
				unoptimized={unoptimized}
			/>
		);
	}

	return (
		<Image
			src={currentSrc}
			alt={alt}
			width={width ?? 900}
			height={height ?? 600}
			className={className}
			sizes={sizes}
			onError={handleError}
			priority={priority}
			unoptimized={unoptimized}
		/>
	);
};

export default VeloraImage;
