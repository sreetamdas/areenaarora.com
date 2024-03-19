<script lang="ts">
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<section class="mx-auto flex max-w-2xl flex-col items-center px-4 py-8">
	<h1 class="pb-20 pt-20 text-5xl font-bold">Hi! I'm Areena.</h1>

	<div class="">
		<p class="py-2">
			I'm a data journalist, occassional food blogger, and 🪴house plant enthusiast!🪴
		</p>
		<p class="py-2">
			I'm new to the world of data-powered storytelling, and slowly paving my path at Knox News.
		</p>
		<p class="py-2">
			I'm also ✨NEW✨ to coding, and learning Svelte. This website is where I showcase my best
			front-end work.
		</p>
	</div>
</section>

<section class="m-4 mx-auto flex max-w-4xl flex-col items-center">
	<h2 class="py-20 text-4xl font-bold">Articles of Interest</h2>

	<div class="flex w-fit flex-wrap gap-4">
		{#each data.parsed_articles_content as parsed_article}
			<article class="max-w-72">
				<img src={parsed_article.image} alt={parsed_article.title} />
				<h3 class="pt-4 text-lg font-semibold leading-tight">{parsed_article.title}</h3>
				<p class="pt-4 text-sm italic">{parsed_article.description}</p>
			</article>
		{/each}
	</div>
</section>
