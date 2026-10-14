import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ADMIN_NAV, findAdminNavItem } from './adminNav';

type AdminMenuListProps = {
	onNavigate?: () => void;
};

const AdminMenuList = ({ onNavigate }: AdminMenuListProps) => {
	const router = useRouter();
	const active = findAdminNavItem(router.pathname);

	return (
		<nav className="va-nav" aria-label="Admin">
			{ADMIN_NAV.map((group) => (
				<div className="va-nav__group" key={group.label}>
					<p className="va-nav__label">{group.label}</p>
					{group.items.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className={`va-nav__item ${active?.href === item.href ? 'is-active' : ''}`}
							aria-current={active?.href === item.href ? 'page' : undefined}
							onClick={onNavigate}
						>
							<span className="va-nav__icon">{item.icon}</span>
							<span>{item.label}</span>
						</Link>
					))}
				</div>
			))}
		</nav>
	);
};

export default AdminMenuList;
