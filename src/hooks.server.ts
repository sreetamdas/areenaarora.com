import { sequence } from "@sveltejs/kit/hooks";
import { error, type Handle } from "@sveltejs/kit";
import { building, dev } from "$app/environment";

import { Miniflare } from "miniflare";

import { luciaAuthHandle } from "$lib/server/auth";

const cloudflareHandle: Handle = async ({ event, resolve }) => {
	if (dev) {
		const mf = new Miniflare({
			modules: true,
			script: `
			export default {
				async fetch(request, env, ctx) {
					return new Response("Hello Miniflare!");
				}
			}
			`,
			d1Databases: {
				CLOUDFLARE_D1_DB: "9ac535ec-ca83-4e84-92fe-d1c8c9a190e6",
			},
		});

		const db = await mf.getD1Database("CLOUDFLARE_D1_DB");
		event.platform ??= {
			env: {
				CLOUDFLARE_D1_DB: db,
			},
		};
	}

	if (!building && !event.platform?.env?.CLOUDFLARE_D1_DB) {
		error(500, "Platform not found");
	}

	return resolve(event);
};

export const handle = sequence(cloudflareHandle, luciaAuthHandle);
