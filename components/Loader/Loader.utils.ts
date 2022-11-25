import { IMAGE_URLS } from './Loader.data';
import { ToThreeChars, GroupUrls } from './Loader.types';

export const preloadImages = () => {
	IMAGE_URLS.forEach((url) => {
		const img = new Image();
		img.src = url;
	});
};

export const toThreeChars: ToThreeChars = (number) => {
	return `  ${number}`.slice(-3);
};

export const groupUrls: GroupUrls = (urls) => {
	const firstStep = 2 + Math.ceil(Math.random() * 2);
	const secondStep = 6 + Math.ceil(Math.random() * 3);

	const firstUrlsStep = Math.floor((firstStep / 10) * urls.length);
	const secondUrlsStep = Math.floor((secondStep / 10) * urls.length);

	return [
		[...urls.slice(0, firstUrlsStep)],
		[...urls.slice(firstUrlsStep, secondUrlsStep)],
		[...urls.slice(secondUrlsStep, urls.length)],
	];
};
