import React from 'react';
import Link from 'next/link';
import { AirplaneTilt, Buildings, Car, MapTrifold } from 'phosphor-react';
import type { AssistantSource } from '../../types/assistant/assistant';
import { resolvePackageImage } from '../../data/packageApi';
import { formatSourcePrice, sourceTypeLabel } from '../../utils/assistant';

const TYPE_ICONS: Record<string, React.ReactNode> = {
	hotel: <Buildings size={22} weight="duotone" />,
	tour: <MapTrifold size={22} weight="duotone" />,
	rentcar: <Car size={22} weight="duotone" />,
	flight: <AirplaneTilt size={22} weight="duotone" />,
};

/** Mini listing card under an assistant answer; opens the item page. */
const SourceCard = ({ source, onOpen }: { source: AssistantSource; onOpen?: () => void }) => (
	<Link href={source.url} className={`ai-source ai-source--${source.type}`} onClick={onOpen}>
		<span className="ai-source__media">
			{source.type === 'flight' || !source.image ? (
				<span className="ai-source__icon">{TYPE_ICONS[source.type] ?? TYPE_ICONS.tour}</span>
			) : (
				// eslint-disable-next-line @next/next/no-img-element -- listing images can be API uploads on any host
				<img src={resolvePackageImage(source.image)} alt="" loading="lazy" />
			)}
			<span className="ai-source__type">{sourceTypeLabel(source.type)}</span>
		</span>
		<span className="ai-source__body">
			<strong title={source.title}>{source.title}</strong>
			<em>{formatSourcePrice(source)}</em>
		</span>
	</Link>
);

export default SourceCard;
