declare module '@vimeo/player' {
	interface VimeoPlayerOptions {
		id?: string | number;
		url?: string;
		width?: number | string;
		height?: number | string;
		autopause?: boolean;
		autoplay?: boolean;
		background?: boolean;
		byline?: boolean;
		color?: string;
		controls?: boolean;
		dnt?: boolean;
		loop?: boolean;
		maxheight?: number;
		maxwidth?: number;
		muted?: boolean;
		playsinline?: boolean;
		portrait?: boolean;
		responsive?: boolean;
		speed?: boolean;
		title?: boolean;
		transparent?: boolean;
	}

	export default class Player {
		constructor(element: HTMLElement | string, options?: VimeoPlayerOptions);
		ready(): Promise<void>;
		getCurrentTime(): Promise<number>;
		setCurrentTime(seconds: number): Promise<void>;
		getDuration(): Promise<number>;
		play(): Promise<void>;
		pause(): Promise<void>;
	}
}
