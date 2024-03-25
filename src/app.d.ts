// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: import("lucia").User | null;
			session: import("lucia").Session | null;
			db: import("drizzle-orm/d1").DrizzleD1Database;
			lucia: import("lucia").Lucia;
		}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env?: {
				CLOUDFLARE_D1_DB: D1Database;
			};
			// context: {
			// 	waitUntil(promise: Promise<unknown>): void;
			// };
			// caches: CacheStorage & { default: Cache };
		}
	}
}

export {};
