export const isMobile = (): boolean => {
	return typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
};
