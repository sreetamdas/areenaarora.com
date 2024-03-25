<script lang="ts">
	import type { PageServerData } from "./$types";

	export let data: PageServerData;
</script>

<h1 class="text-4xl">Hello {data.username}</h1>
