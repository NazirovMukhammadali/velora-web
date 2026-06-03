import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<meta name="robots" content="index,follow" />
				<link rel="icon" type="image/svg+xml" href="/img/logo/velora-mark.svg" />

				{/* SEO */}
				<meta
					name="keyword"
					content={'velora, velora-web, travel booking, flights, hotels, rentcar, tours'}
				/>
				<meta
					name={'description'}
					content={
						'Explore and book flights, hotels, cars, and tours with Velora. Plan your next trip with a seamless travel booking experience.'
					}
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
