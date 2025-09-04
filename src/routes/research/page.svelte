<script lang="ts">
	import type { PageProps } from './$types';
	import { format } from 'date-fns';

	let { data }: PageProps = $props();
	const posts = data.posts;
	const categories = data.categories;

	const firstPost = posts[0];
	let searchTerm = $state('');
	let selectedCategory = $state('');

	let filteredPosts = $derived(($searchTerm: string, $selectedCategory: any) => {
		return posts.filter((item) => {
			const matchesName = item.title
				.toLowerCase()
				.replace(/<[^>]*>/g, '')
				.includes($searchTerm.toLowerCase());
			const matchesCategory = $selectedCategory ? item.tag === $selectedCategory : true;
			return matchesName && matchesCategory;
		});
	});
</script>

<section>
	<div
		class="my-24 flex w-full flex-row flex-wrap content-center items-center justify-center px-8 lg:px-24"
	>
		<img
			class="img_featured ratio ratio-1x1 shadow-[hsl(73, 53%, 31%)] rounded-lg shadow-lg"
			src={firstPost.imageUrl}
			alt=""
		/>
		<div class="card-body flex h-100 max-w-screen-sm flex-col p-0 md:gap-3">
			<h1
				class="text-secondary-green align-self-start text-lg font-bold lg:text-2xl"
				style="font-size:text"
			>
				LATEST RESEARCH
			</h1>
			<a href={`research/${firstPost.slug}`}>
				<h2 class="card-title py-1 text-3xl hover:underline lg:text-4xl lg:leading-[3.2rem]">
					{@html firstPost.title}
				</h2>
			</a>
			<div class="flex flex-row text-xs text-gray-400">
				<p class="mr-2 grow-0 border-r-2 border-r-gray-400 pr-2 md:mr-4 md:pr-4">
					{format(firstPost.date, 'dd-MMM-y')}
				</p>
				<p>{@html firstPost.tag}</p>
			</div>
			<h3 class="card-subtitle text-muted mb-2">{@html firstPost.excerpt}</h3>
			<div class="mt-6 flex flex-row justify-between gap-6 text-lg">
				<a
					href={`research/${firstPost.slug}`}
					class="text-secondary-green font-bold hover:underline"
				>
					KEEP READING
				</a>
				<p class="text-gray-400">
					{firstPost.readingTime.split(' ')[0]} Min Read
				</p>
			</div>
		</div>
	</div>
</section>

<section class="w-screen">
	<div class="w-full" style="margin-top: 15vh">
		<h4 class="mb-5 text-center text-4xl font-bold">Browse Research from Votist</h4>
	</div>
	<div class="w-screen-2xl mx-auto flex flex-wrap items-center justify-start gap-12 p-8 xl:w-5/6">
		<input
			class="input-md border-b-2 border-black"
			type="text"
			bind:value={searchTerm}
			placeholder=" Search for research"
		/>
		<label for="category-select">Filter by Category:</label>
		<select id="category-select" bind:value={selectedCategory}>
			<option value="">All Categories</option>
			{#each categories as category}
				<option value={category.name}>{@html category.name}</option>
			{/each}
		</select>
	</div>
	<div class="w-screen-2xl mx-auto flex flex-wrap justify-center gap-12 p-8 xl:w-5/6">
		{#each filteredPosts(searchTerm, selectedCategory).slice(1) as wpPost}
			<div class="col-md-4 min-h-[345px]">
				<a href={`research/${wpPost.slug}`}>
					<div class="card h-full max-w-[84vw] grow p-5 shadow-lg lg:max-w-[24vw]">
						<img class="card-img-top rounded-md" src={wpPost.imageUrl} alt="" />
						<div class="flex h-full flex-col justify-between pt-2">
							<div class="flex flex-row text-xs text-gray-400">
								<p class="mr-2 grow-0 border-r-2 border-r-gray-400 pr-2 md:mr-4 md:pr-4">
									{format(wpPost.date, 'dd-MMM-y')}
								</p>
								<p>{@html wpPost.tag}</p>
							</div>
							<h3 class="mt-3 text-lg font-bold">{@html wpPost.title}</h3>
							<div class="mt-6 flex flex-row justify-between text-lg">
								<h4 class="text-secondary-green font-bold">READ ARTICLE</h4>
								<p class="text-gray-400">
									{wpPost.readingTime.split(' ')[0]} Min Read
								</p>
							</div>
						</div>
					</div>
				</a>
			</div>
		{:else}
			<p>No posts available.</p>
		{/each}
	</div>
	<div
		class="pointer-events-none sticky bottom-0 z-0 h-16 w-full sm:h-24 lg:h-56"
		style="background: linear-gradient(0deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 100%);
"
	></div>
</section>

<style>
	a:hover {
		color: #333333;
	}

	.img_featured {
		object-fit: cover;
		aspect-ratio: 1 / 1;
		max-width: 400px;
		max-height: 500px;
		margin-right: 5%;
		margin-bottom: 5%;
	}

	.text-secondary-green {
		color: var(--color-votist-blue);
	}

	.card-img-top {
		width: 100%;
		height: 200px; /* Adjust height to maintain 1x1 ratio */
		object-fit: cover; /* Ensures the image covers the area */
	}

	@media screen and (max-width: 600px) {
		.img_featured {
			object-fit: cover;
			aspect-ratio: 1 / 1;
			max-width: 300px;
			max-height: 300px;
		}
	}
	.shadow-lg {
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
	}
</style>
