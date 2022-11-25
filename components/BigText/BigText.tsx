import { useState, useEffect, useRef, useMemo, FC } from 'react';
import { initCharsAnimation } from './BigText.utils';
import type { BigTextProps } from './BigText.types';

const BigText: FC<BigTextProps> = ({
	text,
	className,
	isStatic,
	animationDelay,
	animateIntoView = true,
	snapOnAnimationEnd,
	intersectionThreshold,
	intersectionRootMargin,
	withoutSrText,
	srText,
}) => {
	const [animationsCleanUp, setAnimationsCleanUp] = useState(false);
	const chars = useMemo(() => text.split(''), [text]);
	const containerRef = useRef<HTMLSpanElement>(null);

	const staticReset = () => {
		setAnimationsCleanUp(true);
	};

	useEffect(() => {
		if (!isStatic) {
			initCharsAnimation({
				containerRef,
				staticReset,
				animationDelay,
				animateIntoView,
				snapOnAnimationEnd,
				intersectionThreshold,
				intersectionRootMargin,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<span ref={containerRef} className={`bigText ${className}`}>
			{isStatic ? (
				chars.map((char, index) => <span key={index}>{char}</span>)
			) : (
				<>
					<span className='srText'>{!withoutSrText && (srText || text)}</span>

					{chars.map((char, index) => (
						<span className={`${!animationsCleanUp ? 'passive' : ''}`} key={index} aria-hidden='true'>
							{char}
						</span>
					))}

					{!animationsCleanUp && <span className='animatedChars' aria-hidden='true' />}
				</>
			)}
		</span>
	);
};

export default BigText;
