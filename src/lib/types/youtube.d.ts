declare namespace YT {
	interface Player {
		playVideo(): void;
		stopVideo(): void;
		seekTo(seconds: number): void;
		getCurrentTime(): number;
	}

	interface PlayerEvent {
		target: Player;
	}

	interface PlayerOptions {
		height: string | number;
		width: string | number;
		videoId: string;
		playerVars?: {
			autoplay?: number;
			[key: string]: any;
		};
		events?: {
			onReady?: (event: PlayerEvent) => void;
			[key: string]: ((event: PlayerEvent) => void) | undefined;
		};
	}

	interface PlayerConstructor {
		new (elementId: string, options: PlayerOptions): Player;
	}
}

interface Window {
	YT: {
		Player: YT.PlayerConstructor;
	};
	onYouTubeIframeAPIReady: () => void;
}
