export const toTwoDigits = (val: number): string => {
	return `0${val}`.slice(-2);
};
