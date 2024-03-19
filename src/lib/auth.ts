import { SvelteKitAuth, type SvelteKitAuthConfig } from "@auth/sveltekit";
import { GITHUB_ID, GITHUB_SECRET } from "$env/static/private";
import GitHub from "@auth/sveltekit/providers/github";
import type { Handle } from "@sveltejs/kit";
import { D1Adapter, up } from "@auth/d1-adapter";

export const {
	handle: svelteKitAuthHandle,
	signIn,
	signOut,
} = SvelteKitAuth(async (event) => {
	const authOptions = {
		providers: [GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET })],
		adapter: D1Adapter(event.platform?.env?.CLOUDFLARE_D1_DB),
		// secret: event.platform.env.AUTH_SECRET,
		// trustHost: true,
	} satisfies SvelteKitAuthConfig;

	return authOptions;
	// }) satisfies Handle;
});

let migrated = false;
export const migrationHandle = (async ({ event, resolve }) => {
	if (!migrated) {
		try {
			await up(event.platform?.env?.CLOUDFLARE_D1_DB);
			migrated = true;
		} catch (err) {
			console.error(err);
		}
	}
	return resolve(event);
}) satisfies Handle;
