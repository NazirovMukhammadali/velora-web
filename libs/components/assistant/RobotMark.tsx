import React from 'react';

/** Velora AI mascot: a friendly robot head in the brand gradient (pure SVG, no assets). */
const RobotMark = ({ size = 34, className }: { size?: number; className?: string }) => (
	<svg
		className={className}
		width={size}
		height={size}
		viewBox="0 0 48 48"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
	>
		<defs>
			<linearGradient id="va-robot-grad" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
				<stop stopColor="#ff6b2c" />
				<stop offset="1" stopColor="#5b3df5" />
			</linearGradient>
		</defs>
		{/* antenna */}
		<line x1="24" y1="5" x2="24" y2="11" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" />
		<circle className="robot-antenna" cx="24" cy="4.5" r="2.6" fill="#ffd166" />
		{/* ears */}
		<rect x="4" y="21" width="5" height="10" rx="2.5" fill="#ffffff" opacity="0.9" />
		<rect x="39" y="21" width="5" height="10" rx="2.5" fill="#ffffff" opacity="0.9" />
		{/* head */}
		<rect x="8" y="11" width="32" height="28" rx="11" fill="#ffffff" />
		<rect x="11.5" y="15" width="25" height="18" rx="8" fill="url(#va-robot-grad)" />
		{/* eyes */}
		<g className="robot-eyes">
			<ellipse cx="19" cy="24" rx="2.8" ry="3.4" fill="#ffffff" />
			<ellipse cx="29" cy="24" rx="2.8" ry="3.4" fill="#ffffff" />
		</g>
		{/* smile */}
		<path d="M20.5 29.2c2 1.6 5 1.6 7 0" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
	</svg>
);

export default RobotMark;
