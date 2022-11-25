'use client';

import Image from 'next/image';
import { useState } from 'react';
import Loader from '../components/Loader/Loader';
import { IMAGE_URLS } from '../components/Loader/Loader.data';

export default function Home() {
	const [hasLoaded, setHasLoaded] = useState(false);
	const points = [
		[7, 2, 17, 9],
		[33, 10, 18, 10],
		[2, 16, 13, 12],
		[6, 37, 14, 7],
		[34, 42, 13, 9],
		[28, 27, 14, 6],
	];

	return (
		<div>
			<main>
				<h1>
					Welcome to <a href='https://nextjs.org'>Next.js!</a>
				</h1>
				<div className='images-grid'>
					{IMAGE_URLS.map((url, idx) => {
						const coordinates = points[idx];
						if (!coordinates) return null;
						const [row, column, spanRow, spanColumn] = coordinates;

						return (
							<div
								className='image'
								key={idx}
								style={{
									gridArea: `${row} / ${column} / span ${spanRow} / span ${spanColumn}`,
								}}>
								<Image
									src={url}
									fill={true}
									alt=''
									style={{ objectFit: 'cover', objectPosition: 'center' }}
								/>
							</div>
						);
					})}
				</div>
			</main>
			<Loader onComplete={setHasLoaded} />
		</div>
	);
}
