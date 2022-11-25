export interface BigTextProps {
	text: string;
	className: string;
	isStatic: boolean;
	animationDelay: number;
	animateIntoView: boolean;
	snapOnAnimationEnd: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null;
	intersectionThreshold: number | number[] | undefined;
	intersectionRootMargin: string | undefined;
	withoutSrText: string | undefined;
	srText: string | undefined;
}
