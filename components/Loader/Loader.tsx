'use client';

import { FC, useEffect, useMemo, useState } from 'react';
import type { LoaderProps } from './Loader.types';
import { IMAGE_URLS, PROGRESS_OFFSET, FLIP_DELAY, HAS_EXITED_DELAY } from './Loader.data';
import { isMobile } from '../../utils/isMobile';
import { groupUrls, toThreeChars } from './Loader.utils';
import useImagesLoader from '../../hooks/useImagesLoader';
import BigText from '../BigText/BigText';

const Loader: FC<LoaderProps> = ({ onComplete }) => {
	const [image_urls] = useState([...IMAGE_URLS]);
	const [groupedImageUrls] = useState(groupUrls(image_urls));
	const [hasExited, setHasExited] = useState(false);
	const [wipeOut, setWipeOut] = useState(false);
	const [currYear] = useState(new Date().getFullYear());
	const [flipVal, setFlipVal] = useState(false);
	const [topText, setTopText] = useState('  0');
	const [useFullContainer, setUseFullContainer] = useState(false);

	const progress = useImagesLoader(groupedImageUrls);

	const progressTranslateY = useMemo(() => {
		const viewHeight = isMobile() ? `${window.innerHeight}px` : '100vh';
		return `calc(${progress / 100} * (-${viewHeight} + ${PROGRESS_OFFSET}px + 0.875em))`;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [progress]);

	const progressText = useMemo(() => toThreeChars(progress), [progress]);

	useEffect(() => {
		if (progress === 0) {
			return;
		}

		setFlipVal(true);

		setTimeout(() => {
			setTopText(toThreeChars(progress));
			setFlipVal(false);

			if (progress === 100) {
				onComplete(true);
				setWipeOut(true);
			}
		}, FLIP_DELAY);

		if (progress === 100) {
			setTimeout(() => {
				setHasExited(true);
			}, HAS_EXITED_DELAY);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [progress]);

	useEffect(() => {
		setUseFullContainer(!isMobile());
	}, []);

	if (hasExited) {
		return null;
	}

	return (
		<section className={`loader ${wipeOut ? 'wipeOut' : ''}`}>
			<h3 className='appDescription'>
				Nishit Sarvaiya <br /> Portfolio ©{currYear}
			</h3>
			<div className={`progress ${useFullContainer ? 'fullContainer' : ''}`}>
				<div
					className='progressBlock'
					style={{ transform: `translate3d(0, ${progressTranslateY}, 0)` }}
					aria-hidden='true'>
					<BigText
						className={`progressValue ${flipVal ? 'flipVal' : ''} ${progress === 0 ? 'singleTop' : ''} ${
							progress === 100 ? 'maxTop' : ''
						}`}
						text={topText}
						isStatic
						animationDelay={0}
						animateIntoView={false}
						snapOnAnimationEnd={null}
						intersectionThreshold={undefined}
						intersectionRootMargin={undefined}
						withoutSrText={undefined}
						srText={undefined}
					/>
					<BigText
						className={`progressValue ${flipVal ? 'flipVal' : ''} ${progress === 100 ? 'maxTop' : ''}`}
						text={progressText}
						isStatic
						animationDelay={0}
						animateIntoView={false}
						snapOnAnimationEnd={null}
						intersectionThreshold={undefined}
						intersectionRootMargin={undefined}
						withoutSrText={undefined}
						srText={undefined}
					/>
				</div>
			</div>
		</section>
	);
};

export default Loader;
