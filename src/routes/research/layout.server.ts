import type { LayoutServerLoad } from './$types';
import { wordpressCSS } from '$lib/server/wordpress';

export const load: LayoutServerLoad = async () => {
	return {
		wordpressCSS
	};
};
