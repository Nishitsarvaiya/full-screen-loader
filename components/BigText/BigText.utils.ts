import { RefObject } from 'react';
import { ANIMATION_DELAY_STEPS } from './BigText.data';

export const initCharsAnimation = ({
	containerRef,
	staticReset,
	animationDelay = 0,
	animateIntoView,
	snapOnAnimationEnd,
	intersectionThreshold = 0.2,
	intersectionRootMargin,
}: {
	containerRef: RefObject<HTMLSpanElement | null>;
	staticReset: () => void;
	animationDelay: number;
	animateIntoView: boolean;
	snapOnAnimationEnd: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null;
	intersectionThreshold: number | number[] | undefined;
	intersectionRootMargin: string | undefined;
}) => {
	const containerEl = containerRef.current as HTMLSpanElement;

	const mainChars = [...Array.from(containerEl.children)];
	// const mainChars = Array.from(containerEl.children).map((child) => child);
	mainChars.shift();
	const targetEl = mainChars.pop() as HTMLSpanElement;
	const firstChar = mainChars[0] as HTMLSpanElement;
	let charHeight = firstChar.offsetHeight;
	let hasRenderedTargetChars = false;

	const resetTargetCharsLayout = () => {
		if (charHeight === firstChar.offsetHeight || !hasRenderedTargetChars) {
			return;
		}

		charHeight = firstChar.offsetHeight;

		mainChars.forEach((char, index) => {
			const mainChar = char as HTMLSpanElement;
			const targetChar = targetEl.children[index] as HTMLSpanElement;

			targetChar.style.height = `${mainChar.offsetHeight}px`;
			const left = mainChar.getBoundingClientRect().left - containerEl.getBoundingClientRect().left;
			targetChar.style.left = `${left}px`;
		});
	};

	window.addEventListener('resize', resetTargetCharsLayout);

	const intersectionObserverCallback = (entries: IntersectionObserverEntry[]) => {
		entries.forEach((entry) => {
			if (!entry.isIntersecting) {
				canCleanUpAnimations();
			}
		});
	};

	const observer = new IntersectionObserver(intersectionObserverCallback);

	const canCleanUpAnimations = () => {
		window.removeEventListener('resize', resetTargetCharsLayout);
		window.removeEventListener('resize', canCleanUpAnimations);
		observer.unobserve(containerEl);
		staticReset();
	};

	const animateChars = () => {
		mainChars.forEach((char, index) => {
			const mainChar = char as HTMLSpanElement;
			const targetChar = document.createElement('span');
			targetChar.innerHTML = mainChar.innerHTML;
			targetChar.style.animationDelay = `${animationDelay + index * ANIMATION_DELAY_STEPS}s`;

			targetChar.style.height = `${mainChar.offsetHeight}px`;
			const left = mainChar.getBoundingClientRect().left - containerEl.getBoundingClientRect().left;
			targetChar.style.left = `${left}px`;

			if (snapOnAnimationEnd && index === mainChars.length - 3) {
				targetChar.onanimationend = snapOnAnimationEnd;
			}

			if (index === mainChars.length - 1) {
				targetChar.onanimationend = () => {
					observer.observe(containerEl);
					window.addEventListener('resize', canCleanUpAnimations);
				};
			}
			targetEl.appendChild(targetChar);
		});

		hasRenderedTargetChars = true;
	};

	if (!animateIntoView) {
		animateChars();
		return;
	}

	const inViewIntersectionObserverCallback = (entries: IntersectionObserverEntry[]) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				animateChars();
				inViewObserver.unobserve(containerEl);
			}
		});
	};

	const inViewIntersectionObserverOptions = {
		threshold: intersectionThreshold,
		rootMargin: intersectionRootMargin,
	};

	const inViewObserver = new IntersectionObserver(
		inViewIntersectionObserverCallback,
		inViewIntersectionObserverOptions
	);

	inViewObserver.observe(containerEl);
};
