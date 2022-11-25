import { Dispatch, SetStateAction } from 'react';

export interface ToThreeChars {
	(number: number): string;
}

export interface LoaderProps {
	onComplete: Dispatch<SetStateAction<boolean>>;
}

export interface GroupUrls {
	(urls: Array<string>): Array<Array<string>>;
}
