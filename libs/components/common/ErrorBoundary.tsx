import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import Link from 'next/link';

type ErrorBoundaryProps = {
	children: ReactNode;
};

type ErrorBoundaryState = {
	hasError: boolean;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	state: ErrorBoundaryState = { hasError: false };

	static getDerivedStateFromError(): ErrorBoundaryState {
		return { hasError: true };
	}

	componentDidCatch(error: Error, info: ErrorInfo) {
		console.error('[ErrorBoundary]', error, info.componentStack);
	}

	private handleRetry = () => {
		this.setState({ hasError: false });
	};

	render() {
		if (this.state.hasError) {
			return (
				<div className="velora-error-fallback" role="alert">
					<h2>Something went wrong</h2>
					<p>We hit an unexpected error. Try refreshing the page or return home.</p>
					<div className="velora-error-fallback__actions">
						<button type="button" onClick={this.handleRetry}>
							Try again
						</button>
						<Link href="/">Back to home</Link>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
