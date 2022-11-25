import { useEffect, useMemo, useRef, useState } from 'react';
import { FIRST_INTERVAL_DELAY, INTERVAL_DELAY } from './useImagesLoader.data';

const useImagesLoader = (imageUrls: string[][]) => {
	const [loadIndex, setLoadIndex] = useState(0);
	const [loaded, setLoaded] = useState(0);
	const imagesContainer = useRef<HTMLDivElement | null>(null);

	const totalImages = useMemo(() => imageUrls.flat().length, [imageUrls]);
	const progress = useMemo(() => {
		const currProgress = Math.floor((loaded / totalImages) * 100);
		if (currProgress === 0 || currProgress === 100) {
			return currProgress;
		}
		return currProgress - 2 + Math.round(Math.random() * 4);
	}, [loaded, totalImages]);

	const fetchNextRow = async () => {
		const list = imageUrls[loadIndex];
		await preloadImages(list);
		setLoaded(loaded + list.length);

		if (loadIndex < imageUrls.length - 1) {
			setLoadIndex(loadIndex + 1);
		}
	};

	const preloadImages = (urls: string[]): Promise<void> => {
		return new Promise((resolve) => {
			let loaded = 0;

			const onImageRequestComplete = () => {
				loaded++;

				if (loaded === urls.length) {
					resolve();
				}
			};

			urls.forEach((url) => {
				const img = new Image(0, 0);
				img.onload = onImageRequestComplete;
				img.onerror = onImageRequestComplete;
				img.src = url;
				img.alt = '';
				imagesContainer.current?.appendChild(img);
			});
		});
	};

	useEffect(() => {
		const delay = loadIndex === 0 ? FIRST_INTERVAL_DELAY : INTERVAL_DELAY;
		setTimeout(() => fetchNextRow(), delay);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [loadIndex]);

	useEffect(() => {
		const imagesContainerEl = document.createElement('div');
		imagesContainer.current = imagesContainerEl;
		imagesContainerEl.style.height = '0px';
		imagesContainerEl.style.overflow = 'hidden';
		imagesContainerEl.style.position = 'fixed';
		imagesContainerEl.style.zIndex = '-1000';

		document.body.appendChild(imagesContainerEl);
	}, []);

	useEffect(() => {
		if (progress === 100 && imagesContainer.current) {
			document.body.removeChild(imagesContainer.current);
		}
	}, [progress]);

	return progress;
};

export default useImagesLoader;
