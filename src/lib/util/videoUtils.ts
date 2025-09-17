// Utility functions for parsing video URLs and extracting metadata

export interface VideoInfo {
	videoId: string;
	service: 'YouTube' | 'Vimeo';
	thumbnailUrl: string;
}

/**
 * Extracts video ID from YouTube URL
 */
function extractYouTubeId(url: string): string | null {
	const patterns = [
		/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
		/youtube\.com\/v\/([^&\n?#]+)/,
		/youtube\.com\/shorts\/([^&\n?#]+)/
	];

	for (const pattern of patterns) {
		const match = url.match(pattern);
		if (match) {
			return match[1];
		}
	}
	return null;
}

/**
 * Extracts video ID from Vimeo URL
 */
function extractVimeoId(url: string): string | null {
	const patterns = [/vimeo\.com\/(\d+)/, /player\.vimeo\.com\/video\/(\d+)/];

	for (const pattern of patterns) {
		const match = url.match(pattern);
		if (match) {
			return match[1];
		}
	}
	return null;
}

/**
 * Determines video service from URL
 */
function getVideoService(url: string): 'YouTube' | 'Vimeo' | null {
	if (url.includes('youtube.com') || url.includes('youtu.be')) {
		return 'YouTube';
	}
	if (url.includes('vimeo.com')) {
		return 'Vimeo';
	}
	return null;
}

/**
 * Generates thumbnail URL for a video
 */
export function getVideoThumbnail(videoId: string, service: 'YouTube' | 'Vimeo'): string {
	if (service === 'YouTube') {
		return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
	} else if (service === 'Vimeo') {
		// For Vimeo, we'll use a placeholder since getting thumbnails requires API calls
		// TODO: Implement Vimeo API call to fetch actual thumbnail
		return `https://i.vimeocdn.com/video/${videoId}_640x360.jpg`;
	}
	return '';
}

/**
 * Parses video URL and returns video information
 */
export function parseVideoUrl(url: string): VideoInfo | null {
	if (!url || typeof url !== 'string') {
		return null;
	}

	const service = getVideoService(url);
	if (!service) {
		return null;
	}

	let videoId: string | null = null;
	if (service === 'YouTube') {
		videoId = extractYouTubeId(url);
	} else if (service === 'Vimeo') {
		videoId = extractVimeoId(url);
	}

	if (!videoId) {
		return null;
	}

	return {
		videoId,
		service,
		thumbnailUrl: getVideoThumbnail(videoId, service)
	};
}

/**
 * Generates embed URL for a video
 */
export function getVideoEmbedUrl(
	videoId: string,
	service: 'YouTube' | 'Vimeo',
	options: { autoplay?: boolean; startTime?: number } = {}
): string {
	const { autoplay = false, startTime = 0 } = options;

	if (service === 'YouTube') {
		const params = new URLSearchParams({
			autoplay: autoplay ? '1' : '0',
			rel: '0',
			modestbranding: '1'
		});
		if (startTime > 0) {
			params.set('start', Math.floor(startTime).toString());
		}
		return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
	} else if (service === 'Vimeo') {
		const params = new URLSearchParams({
			autoplay: autoplay ? '1' : '0',
			title: '0',
			byline: '0',
			portrait: '0'
		});
		if (startTime > 0) {
			params.set('t', Math.floor(startTime).toString());
		}
		return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
	}
	return '';
}

/**
 * Checks if a URL is a valid video URL
 */
export function isValidVideoUrl(url: string): boolean {
	return parseVideoUrl(url) !== null;
}
