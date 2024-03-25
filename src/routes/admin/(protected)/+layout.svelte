<script>
	import { enhance } from "$app/forms";
</script>

<div class="flex">
	<form method="post" use:enhance action="/signout">
		<button>Sign out</button>
	</form>
</div>

<slot />
