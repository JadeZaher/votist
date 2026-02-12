import { env } from '$env/dynamic/private';
/*
  client calls
*/
export const fetchPosts = async (
	category: string | undefined,
	search: string | undefined
): Promise<object[]> => {
	const res = await fetch(
		`${env.WP_BASE_URL}/posts?_embed&status=publish&categories=${category}&search=${search}`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Basic admin:${env.WP_ADMIN_PASSWORD}`
			}
		}
	);
	return res.json();
};

export const fetchCategories = async (): Promise<object[]> => {
	const res = await fetch(`${env.WP_BASE_URL}/categories`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Basic admin:${env.WP_ADMIN_PASSWORD}`
		}
	});
	return res.json();
};

/* 
  mappers 
*/
export function formatPost(original: any) {
	// Safe extraction with fallbacks
	const title = original?.title?.rendered || 'Untitled Post';
	const date = original?.date ? new Date(original.date) : new Date();
	const slug = original?.slug || 'untitled-post';
	const content = original?.content?.rendered || '';

	// Safe image extraction with logo fallback
	let imageUrl = '/votist-logo.png'; // Default to votist logo as fallback
	try {
		if (original?._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.full?.source_url) {
			imageUrl = original._embedded['wp:featuredmedia'][0].media_details.sizes.full.source_url;
		}
	} catch (error) {
		console.warn('Error extracting featured image, using logo fallback:', error);
	}

	// Safe excerpt extraction
	let excerpt = '';
	try {
		excerpt = original?.yoast_head_json?.description || '';
	} catch (error) {
		console.warn('Error extracting excerpt:', error);
	}

	// Safe tag extraction
	let tag = 'General';
	try {
		if (original?._embedded?.['wp:term']?.[0]?.[0]?.name) {
			tag = original._embedded['wp:term'][0][0].name;
		}
	} catch (error) {
		console.warn('Error extracting tag, using default:', error);
	}

	// Safe reading time extraction
	let readingTime = '5 min read';
	try {
		if (original?.yoast_head_json?.twitter_misc?.['Est. reading time']) {
			readingTime = original.yoast_head_json.twitter_misc['Est. reading time'];
		}
	} catch (error) {
		console.warn('Error extracting reading time, using default:', error);
	}

	// Safe meta extraction
	let meta = '';
	try {
		meta = original?.yoast_head || '';
	} catch (error) {
		console.warn('Error extracting meta:', error);
	}

	return {
		title,
		date,
		imageUrl,
		excerpt,
		slug,
		tag,
		readingTime,
		meta,
		content
	};
}
export function formatSeoPage(original: any) {
	// Safe extraction with fallbacks
	const title = original?.title?.rendered || 'Untitled Page';
	const date = original?.date ? new Date(original.date) : new Date();
	const slug = original?.slug || 'untitled-page';
	const content = original?.content?.rendered || '';

	// Safe image extraction with logo fallback
	let imageUrl = '/votist-logo.png'; // Default to votist logo as fallback
	try {
		if (original?._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.full?.source_url) {
			imageUrl = original._embedded['wp:featuredmedia'][0].media_details.sizes.full.source_url;
		}
	} catch (error) {
		console.warn('Error extracting featured image, using logo fallback:', error);
	}

	// Safe excerpt extraction
	let excerpt = '';
	try {
		excerpt = original?.yoast_head_json?.description || '';
	} catch (error) {
		console.warn('Error extracting excerpt:', error);
	}

	// Safe reading time extraction
	let readingTime = '5 min read';
	try {
		if (original?.yoast_head_json?.twitter_misc?.['Est. reading time']) {
			readingTime = original.yoast_head_json.twitter_misc['Est. reading time'];
		}
	} catch (error) {
		console.warn('Error extracting reading time, using default:', error);
	}

	// Safe meta extraction
	let meta = '';
	try {
		meta = original?.yoast_head || '';
	} catch (error) {
		console.warn('Error extracting meta:', error);
	}

	return {
		title,
		date,
		imageUrl,
		excerpt,
		slug,
		readingTime,
		meta,
		content
	};
}

export function formatCategory(original: any) {
	// Safe extraction with fallbacks
	const name = original?.name || 'Uncategorized';
	const slug = original?.slug || 'uncategorized';

	return {
		name,
		slug
	};
}

export const wordpressCSS = `
  @import 'https://votistwpheadless.kinsta.cloud/wp-content/plugins/duplicate-post/css/duplicate-post.css?ver=4.5';
	@import 'https://votistwpheadless.kinsta.cloud/wp-content/themes/twentytwentyfive/style.css?ver=1.0';
	@import 'https://votistwpheadless.kinsta.cloud/wp-content/plugins/wordpress-seo/css/dist/adminbar-2440.css';
	@import 'https://votistwpheadless.kinsta.cloud/wp-includes/css/dashicons.min.css?ver=6.7.2';
	@import 'https://votistwpheadless.kinsta.cloud/wp-includes/css/admin-bar.min.css?ver=6.7.2';
	@import 'https://votistwpheadless.kinsta.cloud/wp-includes/blocks/navigation/style.min.css?ver=6.7.2';
	@import 'https://votistwpheadless.kinsta.cloud/wp-includes/blocks/image/style.min.css?ver=6.7.2';

  .wp_content{
     background-color: var(--wp--preset--color--base);
     color: var(--wp--preset--color--custom-brand-base-text);
     font-family: var(--wp--preset--font-family--montserrat);
     font-size: var(--wp--preset--font-size--large);
     font-style: normal;
     font-weight: 400;
     letter-spacing: -0.1px;
     line-height: 1.4;
     --wp--style--root--padding-top: 0px;
     --wp--style--root--padding-right: var(--wp--preset--spacing--50);
     --wp--style--root--padding-bottom: 0px;
     --wp--style--root--padding-left: var(--wp--preset--spacing--50);

  @media screen {
    html {
      margin-top: 32px !important;
    }
  }
  @media screen and (max-width: 782px) {
    html {
      margin-top: 46px !important;
    }
  }

  @media print {
    #wpadminbar {
      display: none;
    }
  }

  .wp-block-site-title {
    box-sizing: border-box;
  }
  .wp-block-site-title :where(a) {
    color: inherit;
    font-family: inherit;
    font-size: inherit;
    font-style: inherit;
    font-weight: inherit;
    letter-spacing: inherit;
    line-height: inherit;
    text-decoration: inherit;
  }

  .wp-block-navigation .wp-block-page-list {
    align-items: var(--navigation-layout-align, initial);
    background-color: inherit;
    display: flex;
    flex-direction: var(--navigation-layout-direction, initial);
    flex-wrap: var(--navigation-layout-wrap, wrap);
    justify-content: var(--navigation-layout-justify, initial);
  }
  .wp-block-navigation .wp-block-navigation-item {
    background-color: inherit;
  }

  .wp-block-group {
    box-sizing: border-box;
  }
  :where(.wp-block-group.wp-block-group-is-layout-constrained) {
    position: relative;
  }

  .wp-block-post-title {
    box-sizing: border-box;
    word-break: break-word;
  }
  .wp-block-post-title :where(a) {
    display: inline-block;
    font-family: inherit;
    font-size: inherit;
    font-style: inherit;
    font-weight: inherit;
    letter-spacing: inherit;
    line-height: inherit;
    text-decoration: inherit;
  }

  .wp-block-post-featured-image {
    margin-left: 0;
    margin-right: 0;
  }
  .wp-block-post-featured-image a {
    display: block;
    height: 100%;
  }
  .wp-block-post-featured-image :where(img) {
    box-sizing: border-box;
    height: auto;
    max-width: 100%;
    vertical-align: bottom;
    width: 100%;
  }
  .wp-block-post-featured-image.alignfull img,
  .wp-block-post-featured-image.alignwide img {
    width: 100%;
  }
  .wp-block-post-featured-image .wp-block-post-featured-image__overlay.has-background-dim {
    background-color: #000;
    inset: 0;
    position: absolute;
  }
  .wp-block-post-featured-image {
    position: relative;
  }
  .wp-block-post-featured-image .wp-block-post-featured-image__overlay.has-background-gradient {
    background-color: initial;
  }
  .wp-block-post-featured-image .wp-block-post-featured-image__overlay.has-background-dim-0 {
    opacity: 0;
  }
  .wp-block-post-featured-image .wp-block-post-featured-image__overlay.has-background-dim-10 {
    opacity: 0.1;
  }
  .wp-block-post-featured-image .wp-block-post-featured-image__overlay.has-background-dim-20 {
    opacity: 0.2;
  }
  .wp-block-post-featured-image .wp-block-post-featured-image__overlay.has-background-dim-30 {
    opacity: 0.3;
  }
  .wp-block-post-featured-image .wp-block-post-featured-image__overlay.has-background-dim-40 {
    opacity: 0.4;
  }
  .wp-block-post-featured-image .wp-block-post-featured-image__overlay.has-background-dim-50 {
    opacity: 0.5;
  }
  .wp-block-post-featured-image .wp-block-post-featured-image__overlay.has-background-dim-60 {
    opacity: 0.6;
  }
  .wp-block-post-featured-image .wp-block-post-featured-image__overlay.has-background-dim-70 {
    opacity: 0.7;
  }
  .wp-block-post-featured-image .wp-block-post-featured-image__overlay.has-background-dim-80 {
    opacity: 0.8;
  }
  .wp-block-post-featured-image .wp-block-post-featured-image__overlay.has-background-dim-90 {
    opacity: 0.9;
  }
  .wp-block-post-featured-image .wp-block-post-featured-image__overlay.has-background-dim-100 {
    opacity: 1;
  }
  .wp-block-post-featured-image:where(.alignleft, .alignright) {
    width: 100%;
  }

  .is-small-text {
    font-size: 0.875em;
  }
  .is-regular-text {
    font-size: 1em;
  }
  .is-large-text {
    font-size: 2.25em;
  }
  .is-larger-text {
    font-size: 3em;
  }
  .has-drop-cap:not(:focus):first-letter {
    float: left;
    font-size: 8.4em;
    font-style: normal;
    font-weight: 100;
    line-height: 0.68;
    margin: 0.05em 0.1em 0 0;
    text-transform: uppercase;
  }
  body.rtl .has-drop-cap:not(:focus):first-letter {
    float: none;
    margin-left: 0.1em;
  }
  p.has-drop-cap.has-background {
    overflow: hidden;
  }
   :where(p.has-background) {
    padding: 1.25em 2.375em;
  }
  :where(p.has-text-color:not(.has-link-color)) a {
    color: inherit;
  }
  p.has-text-align-left[style*='writing-mode:vertical-lr'],
  p.has-text-align-right[style*='writing-mode:vertical-rl'] {
    rotate: 180deg;
  }

  .wp-block-post-author-name {
    box-sizing: border-box;
  }

  .wp-block-post-terms {
    box-sizing: border-box;
  }
  .wp-block-post-terms .wp-block-post-terms__separator {
    white-space: pre-wrap;
  }

  ol,
  ul {
    box-sizing: border-box;
  }
   :where(.wp-block-list.has-background) {
    padding: 1.25em 2.375em;
  }

  ul.is-style-checkmark-list {
    list-style-type: '\xb9';
  }

  ul.is-style-checkmark-list li {
    padding-inline-start: 1ch;
  }

  @charset "UTF-8";
  .wp-block-separator {
    border: none;
    border-top: 2px solid;
  }
   :where(.wp-block-separator.is-style-dots) {
    height: auto;
    line-height: 1;
    text-align: center;
  }
   :where(.wp-block-separator.is-style-dots):before {
    color: currentColor;
    content: '···';
    font-family: serif;
    font-size: 1.5em;
    letter-spacing: 2em;
    padding-left: 2em;
  }
  .wp-block-separator.is-style-dots {
    background: none !important;
    border: none !important;
  }

  .wp-block-post-content {
    display: flow-root;
  }

  .wp-block-post-navigation-link .wp-block-post-navigation-link__arrow-previous {
    display: inline-block;
    margin-right: 1ch;
  }
  .wp-block-post-navigation-link
    .wp-block-post-navigation-link__arrow-previous:not(.is-arrow-chevron) {
    transform: scaleX(1);
  }
  .wp-block-post-navigation-link .wp-block-post-navigation-link__arrow-next {
    display: inline-block;
    margin-left: 1ch;
  }
  .wp-block-post-navigation-link
    .wp-block-post-navigation-link__arrow-next:not(.is-arrow-chevron) {
    transform: scaleX(1);
  }
  .wp-block-post-navigation-link.has-text-align-left[style*='writing-mode: vertical-lr'],
  .wp-block-post-navigation-link.has-text-align-right[style*='writing-mode: vertical-rl'] {
    rotate: 180deg;
  }

  .wp-block-post-comments {
    box-sizing: border-box;
  }
  .wp-block-post-comments .alignleft {
    float: left;
  }
  .wp-block-post-comments .alignright {
    float: right;
  }
  .wp-block-post-comments .navigation:after {
    clear: both;
    content: '';
    display: table;
  }
  .wp-block-post-comments .commentlist {
    clear: both;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .wp-block-post-comments .commentlist .comment {
    min-height: 2.25em;
    padding-left: 3.25em;
  }
  .wp-block-post-comments .commentlist .comment p {
    font-size: 1em;
    line-height: 1.8;
    margin: 1em 0;
  }
  .wp-block-post-comments .commentlist .children {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .wp-block-post-comments .comment-author {
    line-height: 1.5;
  }
  .wp-block-post-comments .comment-author .avatar {
    border-radius: 1.5em;
    display: block;
    float: left;
    height: 2.5em;
    margin-right: 0.75em;
    margin-top: 0.5em;
    width: 2.5em;
  }
  .wp-block-post-comments .comment-author cite {
    font-style: normal;
  }
  .wp-block-post-comments .comment-meta {
    font-size: 0.875em;
    line-height: 1.5;
  }
  .wp-block-post-comments .comment-meta b {
    font-weight: 400;
  }
  .wp-block-post-comments .comment-meta .comment-awaiting-moderation {
    display: block;
    margin-bottom: 1em;
    margin-top: 1em;
  }
  .wp-block-post-comments .comment-body .commentmetadata {
    font-size: 0.875em;
  }
  .wp-block-post-comments .comment-form-author label,
  .wp-block-post-comments .comment-form-comment label,
  .wp-block-post-comments .comment-form-email label,
  .wp-block-post-comments .comment-form-url label {
    display: block;
    margin-bottom: 0.25em;
  }
  .wp-block-post-comments .comment-form input:not([type='submit']):not([type='checkbox']),
  .wp-block-post-comments .comment-form textarea {
    box-sizing: border-box;
    display: block;
    width: 100%;
  }
  .wp-block-post-comments .comment-form-cookies-consent {
    display: flex;
    gap: 0.25em;
  }
  .wp-block-post-comments .comment-form-cookies-consent #wp-comment-cookies-consent {
    margin-top: 0.35em;
  }
  .wp-block-post-comments .comment-reply-title {
    margin-bottom: 0;
  }
  .wp-block-post-comments .comment-reply-title :where(small) {
    font-size: var(--wp--preset--font-size--medium, smaller);
    margin-left: 0.5em;
  }
  .wp-block-post-comments .reply {
    font-size: 0.875em;
    margin-bottom: 1.4em;
  }
  .wp-block-post-comments input:not([type='submit']),
  .wp-block-post-comments textarea {
    border: 1px solid #949494;
    font-family: inherit;
    font-size: 1em;
  }
  .wp-block-post-comments input:not([type='submit']):not([type='checkbox']),
  .wp-block-post-comments textarea {
    padding: calc(0.667em + 2px);
  }
  :where(.wp-block-post-comments input[type='submit']) {
    border: none;
  }

  h1.has-background,
  h2.has-background,
  h3.has-background,
  h4.has-background,
  h5.has-background,
  h6.has-background {
    padding: 1.25em 2.375em;
  }
  h1.has-text-align-left[style*='writing-mode']:where([style*='vertical-lr']),
  h1.has-text-align-right[style*='writing-mode']:where([style*='vertical-rl']),
  h2.has-text-align-left[style*='writing-mode']:where([style*='vertical-lr']),
  h2.has-text-align-right[style*='writing-mode']:where([style*='vertical-rl']),
  h3.has-text-align-left[style*='writing-mode']:where([style*='vertical-lr']),
  h3.has-text-align-right[style*='writing-mode']:where([style*='vertical-rl']),
  h4.has-text-align-left[style*='writing-mode']:where([style*='vertical-lr']),
  h4.has-text-align-right[style*='writing-mode']:where([style*='vertical-rl']),
  h5.has-text-align-left[style*='writing-mode']:where([style*='vertical-lr']),
  h5.has-text-align-right[style*='writing-mode']:where([style*='vertical-rl']),
  h6.has-text-align-left[style*='writing-mode']:where([style*='vertical-lr']),
  h6.has-text-align-right[style*='writing-mode']:where([style*='vertical-rl']) {
    rotate: 180deg;
  }

  .wp-block-post-date {
    box-sizing: border-box;
  }

  .wp-block-post-template {
    list-style: none;
    margin-bottom: 0;
    margin-top: 0;
    max-width: 100%;
    padding: 0;
  }
  .wp-block-post-template.is-flex-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1.25em;
  }
  .wp-block-post-template.is-flex-container > li {
    margin: 0;
    width: 100%;
  }
  @media (min-width: 600px) {
    .wp-block-post-template.is-flex-container.is-flex-container.columns-2 > li {
      width: calc(50% - 0.625em);
    }
    .wp-block-post-template.is-flex-container.is-flex-container.columns-3 > li {
      width: calc(33.33333% - 0.83333em);
    }
    .wp-block-post-template.is-flex-container.is-flex-container.columns-4 > li {
      width: calc(25% - 0.9375em);
    }
    .wp-block-post-template.is-flex-container.is-flex-container.columns-5 > li {
      width: calc(20% - 1em);
    }
    .wp-block-post-template.is-flex-container.is-flex-container.columns-6 > li {
      width: calc(16.66667% - 1.04167em);
    }
  }
  @media (max-width: 600px) {
    .wp-block-post-template-is-layout-grid.wp-block-post-template-is-layout-grid.wp-block-post-template-is-layout-grid.wp-block-post-template-is-layout-grid {
      grid-template-columns: 1fr;
    }
  }
  .wp-block-post-template-is-layout-constrained > li > .alignright,
  .wp-block-post-template-is-layout-flow > li > .alignright {
    float: right;
    margin-inline-end: 0;
    margin-inline-start: 2em;
  }
  .wp-block-post-template-is-layout-constrained > li > .alignleft,
  .wp-block-post-template-is-layout-flow > li > .alignleft {
    float: left;
    margin-inline-end: 2em;
    margin-inline-start: 0;
  }
  .wp-block-post-template-is-layout-constrained > li > .aligncenter,
  .wp-block-post-template-is-layout-flow > li > .aligncenter {
    margin-inline-end: auto;
    margin-inline-start: auto;
  }

  .wp-block-site-logo {
    box-sizing: border-box;
    line-height: 0;
  }
  .wp-block-site-logo a {
    display: inline-block;
    line-height: 0;
  }
  .wp-block-site-logo.is-default-size img {
    height: auto;
    width: 120px;
  }
  .wp-block-site-logo img {
    height: auto;
    max-width: 100%;
  }
  .wp-block-site-logo a,
  .wp-block-site-logo img {
    border-radius: inherit;
  }
  .wp-block-site-logo.aligncenter {
    margin-left: auto;
    margin-right: auto;
    text-align: center;
  }
   :where(.wp-block-site-logo.is-style-rounded) {
    border-radius: 9999px;
  }

  .wp-block-site-tagline {
    box-sizing: border-box;
  }

  .wp-block-spacer {
    clear: both;
  }

  .wp-block-columns {
    align-items: normal !important;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap !important;
  }
  @media (min-width: 782px) {
    .wp-block-columns {
      flex-wrap: nowrap !important;
    }
  }
  .wp-block-columns.are-vertically-aligned-top {
    align-items: flex-start;
  }
  .wp-block-columns.are-vertically-aligned-center {
    align-items: center;
  }
  .wp-block-columns.are-vertically-aligned-bottom {
    align-items: flex-end;
  }
  @media (max-width: 781px) {
    .wp-block-columns:not(.is-not-stacked-on-mobile) > .wp-block-column {
      flex-basis: 100% !important;
    }
  }
  @media (min-width: 782px) {
    .wp-block-columns:not(.is-not-stacked-on-mobile) > .wp-block-column {
      flex-basis: 0;
      flex-grow: 1;
    }
    .wp-block-columns:not(.is-not-stacked-on-mobile) > .wp-block-column[style*='flex-basis'] {
      flex-grow: 0;
    }
  }
  .wp-block-columns.is-not-stacked-on-mobile {
    flex-wrap: nowrap !important;
  }
  .wp-block-columns.is-not-stacked-on-mobile > .wp-block-column {
    flex-basis: 0;
    flex-grow: 1;
  }
  .wp-block-columns.is-not-stacked-on-mobile > .wp-block-column[style*='flex-basis'] {
    flex-grow: 0;
  }
  :where(.wp-block-columns) {
    margin-bottom: 1.75em;
  }
  :where(.wp-block-columns.has-background) {
    padding: 1.25em 2.375em;
  }
  .wp-block-column {
    flex-grow: 1;
    min-width: 0;
    overflow-wrap: break-word;
    word-break: break-word;
  }
  .wp-block-column.is-vertically-aligned-top {
    align-self: flex-start;
  }
  .wp-block-column.is-vertically-aligned-center {
    align-self: center;
  }
  .wp-block-column.is-vertically-aligned-bottom {
    align-self: flex-end;
  }
  .wp-block-column.is-vertically-aligned-stretch {
    align-self: stretch;
  }
  .wp-block-column.is-vertically-aligned-bottom,
  .wp-block-column.is-vertically-aligned-center,
  .wp-block-column.is-vertically-aligned-top {
    width: 100%;
  }

  .wp-block-navigation .wp-block-navigation-item__label {
    overflow-wrap: break-word;
  }
  .wp-block-navigation .wp-block-navigation-item__description {
    display: none;
  }
  .link-ui-tools {
    border-top: 1px solid #f0f0f0;
    padding: 8px;
  }
  .link-ui-block-inserter {
    padding-top: 8px;
  }
  .link-ui-block-inserter__back {
    margin-left: 8px;
    text-transform: uppercase;
  }

  
    --wp-admin-theme-color: #007cba;
    --wp-admin-theme-color--rgb: 0, 124, 186;
    --wp-admin-theme-color-darker-10: #006ba1;
    --wp-admin-theme-color-darker-10--rgb: 0, 107, 161;
    --wp-admin-theme-color-darker-20: #005a87;
    --wp-admin-theme-color-darker-20--rgb: 0, 90, 135;
    --wp-admin-border-width-focus: 2px;
    --wp-block-synced-color: #7a00df;
    --wp-block-synced-color--rgb: 122, 0, 223;
    --wp-bound-block-color: var(--wp-block-synced-color);
  
  @media (min-resolution: 192dpi) {
    
      --wp-admin-border-width-focus: 1.5px;
    
  }
  .wp-element-button {
    cursor: pointer;
  }
  
    --wp--preset--font-size--normal: 16px;
    --wp--preset--font-size--huge: 42px;
  .has-very-light-gray-background-color {
    background-color: #eee;
  }
  .has-very-dark-gray-background-color {
    background-color: #313131;
  }
  .has-very-light-gray-color {
    color: #eee;
  }
   .has-very-dark-gray-color {
    color: #313131;
  }
   .has-vivid-green-cyan-to-vivid-cyan-blue-gradient-background {
    background: linear-gradient(135deg, #00d084, #0693e3);
  }
   .has-purple-crush-gradient-background {
    background: linear-gradient(135deg, #34e2e4, #4721fb 50%, #ab1dfe);
  }
   .has-hazy-dawn-gradient-background {
    background: linear-gradient(135deg, #faaca8, #dad0ec);
  }
   .has-subdued-olive-gradient-background {
    background: linear-gradient(135deg, #fafae1, #67a671);
  }
   .has-atomic-cream-gradient-background {
    background: linear-gradient(135deg, #fdd79a, #004a59);
  }
   .has-nightshade-gradient-background {
    background: linear-gradient(135deg, #330968, #31cdcf);
  }
   .has-midnight-gradient-background {
    background: linear-gradient(135deg, #020381, #2874fc);
  }
  .has-regular-font-size {
    font-size: 1em;
  }
  .has-larger-font-size {
    font-size: 2.625em;
  }
  .has-normal-font-size {
    font-size: var(--wp--preset--font-size--normal);
  }
  .has-huge-font-size {
    font-size: var(--wp--preset--font-size--huge);
  }
  .has-text-align-center {
    text-align: center;
  }
  .has-text-align-left {
    text-align: left;
  }
  .has-text-align-right {
    text-align: right;
  }
  #end-resizable-editor-section {
    display: none;
  }
  .aligncenter {
    clear: both;
  }
  .items-justified-left {
    justify-content: flex-start;
  }
  .items-justified-center {
    justify-content: center;
  }
  .items-justified-right {
    justify-content: flex-end;
  }
  .items-justified-space-between {
    justify-content: space-between;
  }
  .screen-reader-text {
    border: 0;
    clip: rect(1px, 1px, 1px, 1px);
    clip-path: inset(50%);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
    word-wrap: normal !important;
  }
  .screen-reader-text:focus {
    background-color: #ddd;
    clip: auto !important;
    clip-path: none;
    color: #444;
    display: block;
    font-size: 1em;
    height: auto;
    left: 5px;
    line-height: normal;
    padding: 15px 23px 14px;
    text-decoration: none;
    top: 5px;
    width: auto;
    z-index: 100000;
  }
  html :where(.has-border-color) {
    border-style: solid;
  }
  html :where([style*='border-top-color']) {
    border-top-style: solid;
  }
  html :where([style*='border-right-color']) {
    border-right-style: solid;
  }
  html :where([style*='border-bottom-color']) {
    border-bottom-style: solid;
  }
  html :where([style*='border-left-color']) {
    border-left-style: solid;
  }
  html :where([style*='border-width']) {
    border-style: solid;
  }
  html :where([style*='border-top-width']) {
    border-top-style: solid;
  }
  html :where([style*='border-right-width']) {
    border-right-style: solid;
  }
  html :where([style*='border-bottom-width']) {
    border-bottom-style: solid;
  }
  html :where([style*='border-left-width']) {
    border-left-style: solid;
  }
  html :where(img[class*='wp-image-']) {
    height: auto;
    max-width: 100%;
  }
  :where(figure) {
    margin: 0 0 1em;
  }
  html :where(.is-position-sticky) {
    --wp-admin--admin-bar--position-offset: var(--wp-admin--admin-bar--height, 0px);
  }
  @media screen and (max-width: 600px) {
    html :where(.is-position-sticky) {
      --wp-admin--admin-bar--position-offset: 0px;
    }
  }

  /* global-styles-inline-css */

   	* {
		--wp--preset--aspect-ratio--square: 1;
		--wp--preset--aspect-ratio--4-3: 4/3;
		--wp--preset--aspect-ratio--3-4: 3/4;
		--wp--preset--aspect-ratio--3-2: 3/2;
		--wp--preset--aspect-ratio--2-3: 2/3;
		--wp--preset--aspect-ratio--16-9: 16/9;
		--wp--preset--aspect-ratio--9-16: 9/16;
		--wp--preset--color--black: #000000;
		--wp--preset--color--cyan-bluish-gray: #abb8c3;
		--wp--preset--color--white: #ffffff;
		--wp--preset--color--pale-pink: #f78da7;
		--wp--preset--color--vivid-red: #cf2e2e;
		--wp--preset--color--luminous-vivid-orange: #ff6900;
		--wp--preset--color--luminous-vivid-amber: #fcb900;
		--wp--preset--color--light-green-cyan: #7bdcb5;
		--wp--preset--color--vivid-green-cyan: #00d084;
		--wp--preset--color--pale-cyan-blue: #8ed1fc;
		--wp--preset--color--vivid-cyan-blue: #0693e3;
		--wp--preset--color--vivid-purple: #9b51e0;
		--wp--preset--color--base: #ffffff;
		--wp--preset--color--contrast: #111111;
		--wp--preset--color--accent-1: #ffee58;
		--wp--preset--color--accent-2: #f6cff4;
		--wp--preset--color--accent-3: #503aa8;
		--wp--preset--color--accent-4: #686868;
		--wp--preset--color--accent-5: #fbfaf3;
		--wp--preset--color--accent-6: color-mix(in srgb, currentColor 20%, transparent);
		--wp--preset--color--custom-votist-blue: #167b9b;
		--wp--preset--color--custom-votist-blue-dark: #155e75;
		--wp--preset--color--custom-votist-yellow: #f9d026;
		--wp--preset--color--custom-brand-base-text: #3b3b3b;
		--wp--preset--gradient--vivid-cyan-blue-to-vivid-purple: linear-gradient(
			135deg,
			rgba(6, 147, 227, 1) 0%,
			rgb(155, 81, 224) 100%
		);
		--wp--preset--gradient--light-green-cyan-to-vivid-green-cyan: linear-gradient(
			135deg,
			rgb(122, 220, 180) 0%,
			rgb(0, 208, 130) 100%
		);
		--wp--preset--gradient--luminous-vivid-amber-to-luminous-vivid-orange: linear-gradient(
			135deg,
			rgba(252, 185, 0, 1) 0%,
			rgba(255, 105, 0, 1) 100%
		);
		--wp--preset--gradient--luminous-vivid-orange-to-vivid-red: linear-gradient(
			135deg,
			rgba(255, 105, 0, 1) 0%,
			rgb(207, 46, 46) 100%
		);
		--wp--preset--gradient--very-light-gray-to-cyan-bluish-gray: linear-gradient(
			135deg,
			rgb(238, 238, 238) 0%,
			rgb(169, 184, 195) 100%
		);
		--wp--preset--gradient--cool-to-warm-spectrum: linear-gradient(
			135deg,
			rgb(74, 234, 220) 0%,
			rgb(151, 120, 209) 20%,
			rgb(207, 42, 186) 40%,
			rgb(238, 44, 130) 60%,
			rgb(251, 105, 98) 80%,
			rgb(254, 248, 76) 100%
		);
		--wp--preset--gradient--blush-light-purple: linear-gradient(
			135deg,
			rgb(255, 206, 236) 0%,
			rgb(152, 150, 240) 100%
		);
		--wp--preset--gradient--blush-bordeaux: linear-gradient(
			135deg,
			rgb(254, 205, 165) 0%,
			rgb(254, 45, 45) 50%,
			rgb(107, 0, 62) 100%
		);
		--wp--preset--gradient--luminous-dusk: linear-gradient(
			135deg,
			rgb(255, 203, 112) 0%,
			rgb(199, 81, 192) 50%,
			rgb(65, 88, 208) 100%
		);
		--wp--preset--gradient--pale-ocean: linear-gradient(
			135deg,
			rgb(255, 245, 203) 0%,
			rgb(182, 227, 212) 50%,
			rgb(51, 167, 181) 100%
		);
		--wp--preset--gradient--electric-grass: linear-gradient(
			135deg,
			rgb(202, 248, 128) 0%,
			rgb(113, 206, 126) 100%
		);
		--wp--preset--gradient--midnight: linear-gradient(
			135deg,
			rgb(2, 3, 129) 0%,
			rgb(40, 116, 252) 100%
		);
		--wp--preset--gradient--custom-color-1: linear-gradient(
			135deg,
			rgb(0, 111, 192) 0%,
			rgb(146, 208, 80) 100%
		);
		--wp--preset--font-size--small: 0.875rem;
		--wp--preset--font-size--medium: clamp(1rem, 1rem + ((1vw - 0.2rem) * 0.196), 1.125rem);
		--wp--preset--font-size--large: clamp(1.125rem, 1.125rem + ((1vw - 0.2rem) * 0.392), 1.375rem);
		--wp--preset--font-size--x-large: clamp(1.75rem, 1.75rem + ((1vw - 0.2rem) * 0.392), 2rem);
		--wp--preset--font-size--xx-large: clamp(2.15rem, 2.15rem + ((1vw - 0.2rem) * 1.333), 3rem);
		--wp--preset--font-family--manrope: Manrope, sans-serif;
		--wp--preset--font-family--fira-code: 'Fira Code', monospace;
		--wp--preset--font-family--montserrat: Montserrat, sans-serif;
		--wp--preset--spacing--20: 10px;
		--wp--preset--spacing--30: 20px;
		--wp--preset--spacing--40: 30px;
		--wp--preset--spacing--50: clamp(30px, 5vw, 50px);
		--wp--preset--spacing--60: clamp(30px, 7vw, 70px);
		--wp--preset--spacing--70: clamp(50px, 7vw, 90px);
		--wp--preset--spacing--80: clamp(70px, 10vw, 140px);
		--wp--preset--shadow--natural: 6px 6px 9px rgba(0, 0, 0, 0.2);
		--wp--preset--shadow--deep: 12px 12px 50px rgba(0, 0, 0, 0.4);
		--wp--preset--shadow--sharp: 6px 6px 0px rgba(0, 0, 0, 0.2);
		--wp--preset--shadow--outlined:
			6px 6px 0px -3px rgba(255, 255, 255, 1), 6px 6px rgba(0, 0, 0, 1);
		--wp--preset--shadow--crisp: 6px 6px 0px rgba(0, 0, 0, 1);

		--wp--style--global--content-size: 645px;
		--wp--style--global--wide-size: 1340px;
		--wp--style--block-gap: 1.2rem;
	}
	.wp-site-blocks {
		padding-top: var(--wp--style--root--padding-top);
		padding-bottom: var(--wp--style--root--padding-bottom);
	}
	.has-global-padding {
		padding-right: var(--wp--style--root--padding-right);
		padding-left: var(--wp--style--root--padding-left);
	}
	.has-global-padding > .alignfull {
		margin-right: calc(var(--wp--style--root--padding-right) * -1);
		margin-left: calc(var(--wp--style--root--padding-left) * -1);
	}
	.has-global-padding
		:where(:not(.alignfull.is-layout-flow) > .has-global-padding:not(.wp-block-block, .alignfull)) {
		padding-right: 0;
		padding-left: 0;
	}
	.has-global-padding
		:where(:not(.alignfull.is-layout-flow) > .has-global-padding:not(.wp-block-block, .alignfull))
		> .alignfull {
		margin-left: 0;
		margin-right: 0;
	}
	.wp-site-blocks > .alignleft {
		float: left;
		margin-right: 2em;
	}
	.wp-site-blocks > .alignright {
		float: right;
		margin-left: 2em;
	}
	.wp-site-blocks > .aligncenter {
		justify-content: center;
		margin-left: auto;
		margin-right: auto;
	}
	:where(.wp-site-blocks) > * {
		margin-block-start: 1.2rem;
		margin-block-end: 0;
	}
	:where(.wp-site-blocks) > :first-child {
		margin-block-start: 0;
	}
	:where(.wp-site-blocks) > :last-child {
		margin-block-end: 0;
	}

	:where(.is-layout-flow) > :first-child {
		margin-block-start: 0;
	}
	:where(.is-layout-flow) > :last-child {
		margin-block-end: 0;
	}
	:where(.is-layout-flow) > * {
		margin-block-start: 1.2rem;
		margin-block-end: 0;
	}
	:where(.is-layout-constrained) > :first-child {
		margin-block-start: 0;
	}
	:where(.is-layout-constrained) > :last-child {
		margin-block-end: 0;
	}
	:where(.is-layout-constrained) > * {
		margin-block-start: 1.2rem;
		margin-block-end: 0;
	}
	:where(.is-layout-flex) {
		gap: 1.2rem;
	}
	:where(.is-layout-grid) {
		gap: 1.2rem;
	}
	.is-layout-flow > .alignleft {
		float: left;
		margin-inline-start: 0;
		margin-inline-end: 2em;
	}
	.is-layout-flow > .alignright {
		float: right;
		margin-inline-start: 2em;
		margin-inline-end: 0;
	}
	.is-layout-flow > .aligncenter {
		margin-left: auto !important;
		margin-right: auto !important;
	}
	.is-layout-constrained > .alignleft {
		float: left;
		margin-inline-start: 0;
		margin-inline-end: 2em;
	}
	.is-layout-constrained > .alignright {
		float: right;
		margin-inline-start: 2em;
		margin-inline-end: 0;
	}
	.is-layout-constrained > .aligncenter {
		margin-left: auto !important;
		margin-right: auto !important;
	}
	.is-layout-constrained > .alignwide {
		max-width: var(--wp--style--global--wide-size);
	}
	.is-layout-flex {
		display: flex;
	}
	.is-layout-flex {
  		align-items: center;
	}
	.is-layout-flex > :is(*, div) {
		margin: 0;
	}
	.is-layout-grid {
		display: grid;
	}
	.is-layout-grid > :is(*, div) {
		margin: 0;
	}

	a:where(:not(.wp-element-button)) {
		color: var(--wp--preset--color--custom-votist-blue);
		text-decoration: underline;
	}
	:where(a:where(:not(.wp-element-button)):hover) {
		text-decoration: none;
	}
	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		color: var(--wp--preset--color--custom-brand-base-text);
		font-style: normal;
		font-weight: 400;
		letter-spacing: -0.1px;
		line-height: 1.125;
	}
	h1 {
		font-size: var(--wp--preset--font-size--xx-large);
	}
	h2 {
		font-size: var(--wp--preset--font-size--x-large);
	}
	h3 {
		font-size: var(--wp--preset--font-size--large);
	}
	h4 {
		font-size: var(--wp--preset--font-size--medium);
	}
	h5 {
		font-size: var(--wp--preset--font-size--small);
		letter-spacing: 0.5px;
	}
	h6 {
		font-size: var(--wp--preset--font-size--small);
		font-weight: 700;
		letter-spacing: 1.4px;
		text-transform: uppercase;
	}
	:where(.wp-element-button, .wp-block-button__link) {
		background-color: var(--wp--preset--color--custom-votist-blue);
		border-width: 0;
		color: var(--wp--preset--color--base);
		font-family: inherit;
		font-size: var(--wp--preset--font-size--medium);
		line-height: inherit;
		padding-top: 1rem;
		padding-right: 2.25rem;
		padding-bottom: 1rem;
		padding-left: 2.25rem;
		text-decoration: none;
	}
	:where(.wp-element-button:hover, .wp-block-button__link:hover) {
		background-color: color-mix(in srgb, var(--wp--preset--color--contrast) 85%, transparent);
		border-color: transparent;
		color: var(--wp--preset--color--base);
	}
	:where(.wp-element-button:focus, .wp-block-button__link:focus) {
		outline-color: var(--wp--preset--color--accent-4);
		outline-offset: 2px;
	}

	:where(
		.wp-element-caption,
		.wp-block-audio figcaption,
		.wp-block-embed figcaption,
		.wp-block-gallery figcaption,
		.wp-block-image figcaption,
		.wp-block-table figcaption,
		.wp-block-video figcaption
	) {
		font-size: var(--wp--preset--font-size--small);
		line-height: 1.4;
	}
	.has-black-color {
		color: var(--wp--preset--color--black) !important;
	}
	.has-cyan-bluish-gray-color {
		color: var(--wp--preset--color--cyan-bluish-gray) !important;
	}
	.has-white-color {
		color: var(--wp--preset--color--white) !important;
	}
	.has-pale-pink-color {
		color: var(--wp--preset--color--pale-pink) !important;
	}
	.has-vivid-red-color {
		color: var(--wp--preset--color--vivid-red) !important;
	}
	.has-luminous-vivid-orange-color {
		color: var(--wp--preset--color--luminous-vivid-orange) !important;
	}
	.has-luminous-vivid-amber-color {
		color: var(--wp--preset--color--luminous-vivid-amber) !important;
	}
	.has-light-green-cyan-color {
		color: var(--wp--preset--color--light-green-cyan) !important;
	}
	.has-vivid-green-cyan-color {
		color: var(--wp--preset--color--vivid-green-cyan) !important;
	}
	.has-pale-cyan-blue-color {
		color: var(--wp--preset--color--pale-cyan-blue) !important;
	}
	.has-vivid-cyan-blue-color {
		color: var(--wp--preset--color--vivid-cyan-blue) !important;
	}
	.has-vivid-purple-color {
		color: var(--wp--preset--color--vivid-purple) !important;
	}
	.has-base-color {
		color: var(--wp--preset--color--base) !important;
	}
	.has-contrast-color {
		color: var(--wp--preset--color--contrast) !important;
	}
	.has-accent-1-color {
		color: var(--wp--preset--color--accent-1) !important;
	}
	.has-accent-2-color {
		color: var(--wp--preset--color--accent-2) !important;
	}
	.has-accent-3-color {
		color: var(--wp--preset--color--accent-3) !important;
	}
	.has-accent-4-color {
		color: var(--wp--preset--color--accent-4) !important;
	}
	.has-accent-5-color {
		color: var(--wp--preset--color--accent-5) !important;
	}
	.has-accent-6-color {
		color: var(--wp--preset--color--accent-6) !important;
	}
	.has-custom-votist-blue-color {
		color: var(--wp--preset--color--custom-votist-blue) !important;
	}
	.has-custom-votist-blue-dark-color {
		color: var(--wp--preset--color--custom-votist-blue-dark) !important;
	}
	.has-custom-votist-yellow-color {
		color: var(--wp--preset--color--custom-votist-yellow) !important;
	}
	.has-custom-brand-base-text-color {
		color: var(--wp--preset--color--custom-brand-base-text) !important;
	}
	.has-black-background-color {
		background-color: var(--wp--preset--color--black) !important;
	}
	.has-cyan-bluish-gray-background-color {
		background-color: var(--wp--preset--color--cyan-bluish-gray) !important;
	}
	.has-white-background-color {
		background-color: var(--wp--preset--color--white) !important;
	}
	.has-pale-pink-background-color {
		background-color: var(--wp--preset--color--pale-pink) !important;
	}
	.has-vivid-red-background-color {
		background-color: var(--wp--preset--color--vivid-red) !important;
	}
	.has-luminous-vivid-orange-background-color {
		background-color: var(--wp--preset--color--luminous-vivid-orange) !important;
	}
	.has-luminous-vivid-amber-background-color {
		background-color: var(--wp--preset--color--luminous-vivid-amber) !important;
	}
	.has-light-green-cyan-background-color {
		background-color: var(--wp--preset--color--light-green-cyan) !important;
	}
	.has-vivid-green-cyan-background-color {
		background-color: var(--wp--preset--color--vivid-green-cyan) !important;
	}
	.has-pale-cyan-blue-background-color {
		background-color: var(--wp--preset--color--pale-cyan-blue) !important;
	}
	.has-vivid-cyan-blue-background-color {
		background-color: var(--wp--preset--color--vivid-cyan-blue) !important;
	}
	.has-vivid-purple-background-color {
		background-color: var(--wp--preset--color--vivid-purple) !important;
	}
	.has-base-background-color {
		background-color: var(--wp--preset--color--base) !important;
	}
	.has-contrast-background-color {
		background-color: var(--wp--preset--color--contrast) !important;
	}
	.has-accent-1-background-color {
		background-color: var(--wp--preset--color--accent-1) !important;
	}
	.has-accent-2-background-color {
		background-color: var(--wp--preset--color--accent-2) !important;
	}
	.has-accent-3-background-color {
		background-color: var(--wp--preset--color--accent-3) !important;
	}
	.has-accent-4-background-color {
		background-color: var(--wp--preset--color--accent-4) !important;
	}
	.has-accent-5-background-color {
		background-color: var(--wp--preset--color--accent-5) !important;
	}
	.has-accent-6-background-color {
		background-color: var(--wp--preset--color--accent-6) !important;
	}
	.has-custom-votist-blue-background-color {
		background-color: var(--wp--preset--color--custom-votist-blue) !important;
	}
	.has-custom-votist-blue-dark-background-color {
		background-color: var(--wp--preset--color--custom-votist-blue-dark) !important;
	}
	.has-custom-votist-yellow-background-color {
		background-color: var(--wp--preset--color--custom-votist-yellow) !important;
	}
	.has-custom-brand-base-text-background-color {
		background-color: var(--wp--preset--color--custom-brand-base-text) !important;
	}
	.has-black-border-color {
		border-color: var(--wp--preset--color--black) !important;
	}
	.has-cyan-bluish-gray-border-color {
		border-color: var(--wp--preset--color--cyan-bluish-gray) !important;
	}
	.has-white-border-color {
		border-color: var(--wp--preset--color--white) !important;
	}
	.has-pale-pink-border-color {
		border-color: var(--wp--preset--color--pale-pink) !important;
	}
	.has-vivid-red-border-color {
		border-color: var(--wp--preset--color--vivid-red) !important;
	}
	.has-luminous-vivid-orange-border-color {
		border-color: var(--wp--preset--color--luminous-vivid-orange) !important;
	}
	.has-luminous-vivid-amber-border-color {
		border-color: var(--wp--preset--color--luminous-vivid-amber) !important;
	}
	.has-light-green-cyan-border-color {
		border-color: var(--wp--preset--color--light-green-cyan) !important;
	}
	.has-vivid-green-cyan-border-color {
		border-color: var(--wp--preset--color--vivid-green-cyan) !important;
	}
	.has-pale-cyan-blue-border-color {
		border-color: var(--wp--preset--color--pale-cyan-blue) !important;
	}
	.has-vivid-cyan-blue-border-color {
		border-color: var(--wp--preset--color--vivid-cyan-blue) !important;
	}
	.has-vivid-purple-border-color {
		border-color: var(--wp--preset--color--vivid-purple) !important;
	}
	.has-base-border-color {
		border-color: var(--wp--preset--color--base) !important;
	}
	.has-contrast-border-color {
		border-color: var(--wp--preset--color--contrast) !important;
	}
	.has-accent-1-border-color {
		border-color: var(--wp--preset--color--accent-1) !important;
	}
	.has-accent-2-border-color {
		border-color: var(--wp--preset--color--accent-2) !important;
	}
	.has-accent-3-border-color {
		border-color: var(--wp--preset--color--accent-3) !important;
	}
	.has-accent-4-border-color {
		border-color: var(--wp--preset--color--accent-4) !important;
	}
	.has-accent-5-border-color {
		border-color: var(--wp--preset--color--accent-5) !important;
	}
	.has-accent-6-border-color {
		border-color: var(--wp--preset--color--accent-6) !important;
	}
	.has-custom-votist-blue-border-color {
		border-color: var(--wp--preset--color--custom-votist-blue) !important;
	}
	.has-custom-votist-blue-dark-border-color {
		border-color: var(--wp--preset--color--custom-votist-blue-dark) !important;
	}
	.has-custom-votist-yellow-border-color {
		border-color: var(--wp--preset--color--custom-votist-yellow) !important;
	}
	.has-custom-brand-base-text-border-color {
		border-color: var(--wp--preset--color--custom-brand-base-text) !important;
	}
	.has-vivid-cyan-blue-to-vivid-purple-gradient-background {
		background: var(--wp--preset--gradient--vivid-cyan-blue-to-vivid-purple) !important;
	}
	.has-light-green-cyan-to-vivid-green-cyan-gradient-background {
		background: var(--wp--preset--gradient--light-green-cyan-to-vivid-green-cyan) !important;
	}
	.has-luminous-vivid-amber-to-luminous-vivid-orange-gradient-background {
		background: var(
			--wp--preset--gradient--luminous-vivid-amber-to-luminous-vivid-orange
		) !important;
	}
	.has-luminous-vivid-orange-to-vivid-red-gradient-background {
		background: var(--wp--preset--gradient--luminous-vivid-orange-to-vivid-red) !important;
	}
	.has-very-light-gray-to-cyan-bluish-gray-gradient-background {
		background: var(--wp--preset--gradient--very-light-gray-to-cyan-bluish-gray) !important;
	}
	.has-cool-to-warm-spectrum-gradient-background {
		background: var(--wp--preset--gradient--cool-to-warm-spectrum) !important;
	}
	.has-blush-light-purple-gradient-background {
		background: var(--wp--preset--gradient--blush-light-purple) !important;
	}
	.has-blush-bordeaux-gradient-background {
		background: var(--wp--preset--gradient--blush-bordeaux) !important;
	}
	.has-luminous-dusk-gradient-background {
		background: var(--wp--preset--gradient--luminous-dusk) !important;
	}
	.has-pale-ocean-gradient-background {
		background: var(--wp--preset--gradient--pale-ocean) !important;
	}
	.has-electric-grass-gradient-background {
		background: var(--wp--preset--gradient--electric-grass) !important;
	}
	.has-midnight-gradient-background {
		background: var(--wp--preset--gradient--midnight) !important;
	}
	.has-custom-color-1-gradient-background {
		background: var(--wp--preset--gradient--custom-color-1) !important;
	}
	.has-small-font-size {
		font-size: var(--wp--preset--font-size--small) !important;
	}
	.has-medium-font-size {
		font-size: var(--wp--preset--font-size--medium) !important;
	}
	.has-large-font-size {
		font-size: var(--wp--preset--font-size--large) !important;
	}
	.has-x-large-font-size {
		font-size: var(--wp--preset--font-size--x-large) !important;
	}
	.has-xx-large-font-size {
		font-size: var(--wp--preset--font-size--xx-large) !important;
	}
	.has-manrope-font-family {
		font-family: var(--wp--preset--font-family--manrope) !important;
	}
	.has-fira-code-font-family {
		font-family: var(--wp--preset--font-family--fira-code) !important;
	}
	.has-montserrat-font-family {
		font-family: var(--wp--preset--font-family--montserrat) !important;
	}

   :where(.wp-block-columns-is-layout-flow) > :first-child {
    margin-block-start: 0;
  }
   :where(.wp-block-columns-is-layout-flow) > :last-child {
    margin-block-end: 0;
  }
   :where(.wp-block-columns-is-layout-flow) > * {
    margin-block-start: var(--wp--preset--spacing--50);
    margin-block-end: 0;
  }
   :where(.wp-block-columns-is-layout-constrained) > :first-child {
    margin-block-start: 0;
  }
   :where(.wp-block-columns-is-layout-constrained) > :last-child {
    margin-block-end: 0;
  }
   :where(.wp-block-columns-is-layout-constrained) > * {
    margin-block-start: var(--wp--preset--spacing--50);
    margin-block-end: 0;
  }
   :where(.wp-block-columns-is-layout-flex) {
    gap: var(--wp--preset--spacing--50);
  }
   :where(.wp-block-columns-is-layout-grid) {
    gap: var(--wp--preset--spacing--50);
  }
   :where(.wp-block-post-date) {
    color: var(--wp--preset--color--accent-4);
    font-size: var(--wp--preset--font-size--small);
  }
   :where(.wp-block-post-date a:where(:not(.wp-element-button))) {
    color: var(--wp--preset--color--accent-4);
    text-decoration: none;
  }
   :where(.wp-block-post-date a:where(:not(.wp-element-button)):hover) {
    text-decoration: underline;
  }
   :where(.wp-block-post-navigation-link) {
    font-size: var(--wp--preset--font-size--medium);
  }
   :where(.wp-block-post-terms) {
    font-size: var(--wp--preset--font-size--small);
    font-weight: 600;
  }
   :where(.wp-block-post-terms a) {
    white-space: nowrap;
  }
   :where(.wp-block-post-title a:where(:not(.wp-element-button))) {
    text-decoration: none;
  }
   :where(.wp-block-post-title a:where(:not(.wp-element-button)):hover) {
    text-decoration: underline;
  }
   :where(.wp-block-separator) {
    border-color: currentColor;
    border-width: 0 0 1px 0;
    border-style: solid;
    color: var(--wp--preset--color--accent-6);
  }
   :where(.wp-block-site-tagline) {
    font-size: var(--wp--preset--font-size--medium);
  }
   :where(.wp-block-site-title) {
    font-weight: 700;
    letter-spacing: -0.5px;
  }
   :where(.wp-block-site-title a:where(:not(.wp-element-button))) {
    text-decoration: none;
  }
   :where(.wp-block-site-title a:where(:not(.wp-element-button)):hover) {
    text-decoration: underline;
  }
   :where(.wp-block-navigation) {
    font-size: var(--wp--preset--font-size--medium);
  }
   :where(.wp-block-navigation a:where(:not(.wp-element-button))) {
    text-decoration: none;
  }
   :where(.wp-block-navigation a:where(:not(.wp-element-button)):hover) {
    text-decoration: underline;
  }
   :where(.wp-block-list li) {
    margin-top: 0.5rem;
  }

   :where(.is-style-post-terms-1--2 a:where(:not(.wp-element-button))) {
    border-radius: 20px;
    border-color: var(--wp--preset--color--accent-6);
    border-width: 0.8px;
    border-style: solid;
    font-weight: 400;
    line-height: 2.8;
    padding-top: 5px;
    padding-right: 10px;
    padding-bottom: 5px;
    padding-left: 10px;
    text-decoration: none;
  }
   :where(.is-style-post-terms-1--2 a:where(:not(.wp-element-button)):hover) {
    text-decoration: underline;
  }

  img.wp-smiley,
  img.emoji {
    display: inline !important;
    border: none !important;
    box-shadow: none !important;
    height: 1em !important;
    width: 1em !important;
    margin: 0 0.07em !important;
    vertical-align: -0.1em !important;
    background: none !important;
    padding: 0 !important;
  }

  .wp-container-core-navigation-is-layout-1 {
    justify-content: flex-end;
  }
  .wp-container-core-group-is-layout-1 {
    flex-wrap: nowrap;
    gap: var(--wp--preset--spacing--10);
    justify-content: flex-end;
  }
  .wp-container-core-group-is-layout-2 {
    flex-wrap: nowrap;
    justify-content: space-between;
  }
  .wp-container-core-group-is-layout-5 {
    gap: 0.2em;
  }
  .wp-container-core-group-is-layout-7 {
    flex-wrap: nowrap;
    justify-content: space-between;
  }
  .wp-container-core-group-is-layout-10 {
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
  }
  .wp-container-core-group-is-layout-11 {
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
  }
  .wp-container-core-group-is-layout-12 {
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
  }
  .wp-container-core-group-is-layout-13 {
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
  }
  .wp-container-core-post-template-is-layout-1 > * {
    margin-block-start: 0;
    margin-block-end: 0;
  }
  .wp-container-core-post-template-is-layout-1 > * + * {
    margin-block-start: 0;
    margin-block-end: 0;
  }
  .wp-container-core-columns-is-layout-1 {
    flex-wrap: nowrap;
  }
  .wp-container-core-navigation-is-layout-2 {
    flex-direction: column;
    align-items: flex-start;
  }
  .wp-container-core-navigation-is-layout-3 {
    flex-direction: column;
    align-items: flex-start;
  }
  .wp-container-core-group-is-layout-16 {
    gap: var(--wp--preset--spacing--80);
    justify-content: space-between;
    align-items: flex-start;
  }
  .wp-container-core-group-is-layout-17 {
    justify-content: space-between;
    align-items: flex-start;
  }
  .wp-container-core-group-is-layout-18 {
    gap: var(--wp--preset--spacing--20);
    justify-content: space-between;
  }

  .skip-link.screen-reader-text {
    border: 0;
    clip: rect(1px, 1px, 1px, 1px);
    clip-path: inset(50%);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute !important;
    width: 1px;
    word-wrap: normal !important;
  }

  .skip-link.screen-reader-text:focus {
    background-color: #eee;
    clip: auto !important;
    clip-path: none;
    color: #444;
    display: block;
    font-size: 1em;
    height: auto;
    left: 5px;
    line-height: normal;
    padding: 15px 23px 14px;
    text-decoration: none;
    top: 5px;
    width: auto;
    z-index: 100000;
  }

  @font-face {
    font-family: Manrope;
    font-style: normal;
    font-weight: 200 800;
    font-display: fallback;
    src: url('https://votistwpheadless.kinsta.cloud/wp-content/themes/twentytwentyfive/assets/fonts/manrope/Manrope-VariableFont_wght.woff2')
      format('woff2');
  }
  @font-face {
    font-family: 'Fira Code';
    font-style: normal;
    font-weight: 300 700;
    font-display: fallback;
    src: url('https://votistwpheadless.kinsta.cloud/wp-content/themes/twentytwentyfive/assets/fonts/fira-code/FiraCode-VariableFont_wght.woff2')
      format('woff2');
  }
   .wp-block-media-text {
        box-sizing: border-box;
        /*!rtl:begin:ignore*/
        direction: ltr;
        /*!rtl:end:ignore*/
        display: grid;
        grid-template-columns: 50% 1fr;
        grid-template-rows: auto
    }

    .wp-block-media-text.has-media-on-the-right {
        grid-template-columns: 1fr 50%
    }

    .wp-block-media-text.is-vertically-aligned-top>.wp-block-media-text__content,.wp-block-media-text.is-vertically-aligned-top>.wp-block-media-text__media {
        align-self: start
    }

    .wp-block-media-text.is-vertically-aligned-center>.wp-block-media-text__content,.wp-block-media-text.is-vertically-aligned-center>.wp-block-media-text__media,.wp-block-media-text>.wp-block-media-text__content,.wp-block-media-text>.wp-block-media-text__media {
        align-self: center
    }

    .wp-block-media-text.is-vertically-aligned-bottom>.wp-block-media-text__content,.wp-block-media-text.is-vertically-aligned-bottom>.wp-block-media-text__media {
        align-self: end
    }

    .wp-block-media-text>.wp-block-media-text__media {
        /*!rtl:begin:ignore*/
        grid-column: 1;
        grid-row: 1;
        /*!rtl:end:ignore*/
        margin: 0
    }

    .wp-block-media-text>.wp-block-media-text__content {
        direction: ltr;
        /*!rtl:begin:ignore*/
        grid-column: 2;
        grid-row: 1;
        /*!rtl:end:ignore*/
        padding: 0 8%;
        word-break: break-word
    }

    .wp-block-media-text.has-media-on-the-right>.wp-block-media-text__media {
        /*!rtl:begin:ignore*/
        grid-column: 2;
        grid-row: 1 /*!rtl:end:ignore*/
    }

    .wp-block-media-text.has-media-on-the-right>.wp-block-media-text__content {
        /*!rtl:begin:ignore*/
        grid-column: 1;
        grid-row: 1 /*!rtl:end:ignore*/
    }

    .wp-block-media-text__media a {
        display: inline-block
    }

    .wp-block-media-text__media img,.wp-block-media-text__media video {
        height: auto;
        max-width: unset;
        vertical-align: middle;
        width: 100%
    }

    .wp-block-media-text.is-image-fill>.wp-block-media-text__media {
        background-size: cover;
        height: 100%;
        min-height: 250px
    }

    .wp-block-media-text.is-image-fill>.wp-block-media-text__media>a {
        display: block;
        height: 100%
    }

    .wp-block-media-text.is-image-fill>.wp-block-media-text__media img {
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
        clip: rect(0,0,0,0);
        border: 0
    }

    .wp-block-media-text.is-image-fill-element>.wp-block-media-text__media {
        height: 100%;
        min-height: 250px;
        position: relative
    }

    .wp-block-media-text.is-image-fill-element>.wp-block-media-text__media>a {
        display: block;
        height: 100%
    }

    .wp-block-media-text.is-image-fill-element>.wp-block-media-text__media img {
        height: 100%;
        object-fit: cover;
        position: absolute;
        width: 100%
    }

    @media (max-width: 600px) {
        .wp-block-media-text.is-stacked-on-mobile {
            grid-template-columns:100%!important
        }

        .wp-block-media-text.is-stacked-on-mobile>.wp-block-media-text__media {
            grid-column: 1;
            grid-row: 1
        }

        .wp-block-media-text.is-stacked-on-mobile>.wp-block-media-text__content {
            grid-column: 1;
            grid-row: 2
        }
    }
}
`;
