<script lang="ts">
	import type { PageProps } from './$types';

	// Define the post type based on what formatPost returns
	type Post = {
		title: string;
		date: Date;
		imageUrl: string;
		excerpt: string;
		slug: string;
		tag: string;
		readingTime: string;
		meta: string;
		content: string;
	};

	let { data }: PageProps = $props();
	const post: Post = data.post || {
		title: 'Research Coming Soon',
		date: new Date(),
		imageUrl: '/votist-logo.png',
		excerpt: 'We are currently setting up our research content.',
		slug: 'research-coming-soon',
		tag: 'Announcement',
		readingTime: '2 min read',
		meta: '',
		content: 'Research content will be available soon.'
	};

	// Date formatting function with error handling
	const format = (date: Date, formatString: string) => {
		try {
			if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
				return 'Invalid Date';
			}

			const day = date.getDate().toString().padStart(2, '0');
			const month = date.toLocaleDateString('en-US', { month: 'short' });
			const year = date.getFullYear();

			if (formatString === 'dd MMM y') {
				return `${day} ${month} ${year}`;
			}
			return date.toLocaleDateString();
		} catch (error) {
			console.error('Error formatting date:', error);
			return 'Invalid Date';
		}
	};
</script>

<svelte:head>
	{@html post.meta || ''}
	<title>{post.title || 'Research'}</title>
	<meta name="description" content={post.excerpt || 'Research content from Votist'} />
</svelte:head>

<section class="w-screen pb-8">
	<div style="margin-top: 15vh">
		<div class="justify-content-center flex flex-col items-center px-4 md:px-8 lg:px-24">
			<div
				class="entry-content alignfull wp-block-post-content has-global-padding is-layout-constrained wp-block-post-content-is-layout-constrained w-full"
			>
				<!-- Featured Image and Title Section -->
				<div class="featured-section mb-8">
					{#if post.imageUrl}
						<img
							src={post.imageUrl}
							alt={post.title || 'Research image'}
							class="w-1/3 rounded-lg"
						/>
					{/if}

					<div class="title-section">
						<h1 class="text-votist-blue mb-5 text-4xl font-bold">
							{@html post.title || 'Research Coming Soon'}
						</h1>

						{#if post.date}
							<p class="publish-date">Published: {format(post.date, 'dd MMM y')}</p>
						{/if}

						{#if post.tag && post.tag !== 'General'}
							<div class="mb-4">
								<span class="tag-secondary">{@html post.tag}</span>
							</div>
						{/if}

						{#if post.readingTime}
							<div class="mb-4">
								<p class="rt-reading-time">Reading time: {post.readingTime}</p>
							</div>
						{/if}
					</div>
				</div>

				{#if post.excerpt}
					<div class="mb-6 rounded-lg bg-gray-50 p-4">
						<p class="text-lg italic">{@html post.excerpt}</p>
					</div>
				{/if}

				{#if post.content}
					<div class="prose max-w-none">
						{@html post.content}
					</div>
				{:else}
					<div class="prose max-w-none">
						<p class="text-gray-600">
							We are currently setting up our research content. Please check back soon for the
							latest insights and analysis.
						</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>

<style>
	:global(.wp_content a) {
		color: #167b9b;
		text-decoration: none;
	}
	:global(.wp_content a:hover) {
		color: #333333;
	}
	:global(.tag-secondary) {
		color: #000000;
		background-color: #cbe8ae;
		padding: 1px 6px;
		font-size: 15px;
	}
	:global(.text-primary) {
		font-size: 2.686rem;
	}

	:global(.wp-block-image) {
		align-self: center;
		:global(img) {
			object-fit: cover;
		}
	}
	:global(strong) {
		font-weight: 700 !important;
	}
	:global(ol) {
		list-style: decimal !important;
	}
	:global(.wp-block-list) {
		padding-inline-start: 40px !important;
		list-style: inherit;
	}
	:global(.rt-reading-time) {
		font-size: 1rem;
		margin: 0 !important;
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
	}
	h1 {
		font-size: 2.686rem !important;
		font-family: Montserrat !important;
		font-weight: 700 !important;
	}
	.publish-date {
		font-size: 1rem !important;
		margin: 1rem 0 0 0;
		color: #666;
	}

	:global(.prose) {
		line-height: 1.7;
	}

	:global(.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6) {
		margin-top: 2rem;
		margin-bottom: 1rem;
		font-weight: 600;
	}

	:global(.prose p) {
		margin-bottom: 1.5rem;
	}

	:global(.prose img) {
		max-width: 100%;
		height: auto;
		border-radius: 8px;
		margin: 1.5rem 0;
	}

	:global(.prose blockquote) {
		border-left: 4px solid #167b9b;
		padding-left: 1.5rem;
		margin: 2rem 0;
		font-style: italic;
		background-color: #f8f9fa;
		padding: 1.5rem;
		border-radius: 0 8px 8px 0;
	}

	/* Featured Image and Title Layout */
	.featured-section {
		display: flex;
		align-items: flex-start;
		gap: 2rem;
		margin-bottom: 2rem;
	}

	.featured-image {
		float: left;
		width: 200px;
		height: 200px;
		object-fit: cover;
		border-radius: 12px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		margin-right: 2rem;
		margin-bottom: 1rem;
		flex-shrink: 0;
	}

	.title-section {
		flex: 1;
		min-width: 0; /* Allows text to wrap properly */
	}

	/* Content wrapping around the image */
	.prose {
		clear: both;
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.featured-section {
			flex-direction: column;
			gap: 1rem;
		}

		.featured-image {
			width: 100%;
			max-width: 300px;
			height: auto;
			aspect-ratio: 1;
			margin: 0 auto 1rem auto;
			float: none;
		}

		.title-section {
			text-align: center;
		}
	}

	@media (max-width: 480px) {
		.featured-image {
			max-width: 250px;
		}
	}
</style>
