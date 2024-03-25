import { Lucia } from "lucia";
import { dev } from "$app/environment";
import { D1Adapter } from "@lucia-auth/adapter-sqlite";
import type { Handle } from "@sveltejs/kit";

import { drizzle } from "drizzle-orm/d1";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { sessionTable, userTable } from "./schema";

declare module "lucia" {
	interface Register {
		Auth: ReturnType<typeof initializeLucia>;
		Lucia: ReturnType<typeof initializeLucia>;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	username: string;
}

export function initializeLucia(D1: D1Database) {
	const adapter = new D1Adapter(D1, {
		user: "user",
		session: "session",
	});
	return new Lucia(adapter, {
		sessionCookie: {
			attributes: {
				// set to `true` when using HTTPS
				secure: !dev,
			},
		},
		getUserAttributes: (attributes) => {
			return {
				// attributes has the type of DatabaseUserAttributes
				username: attributes.username,
			};
		},
	});
}

export const luciaAuthHandle: Handle = async ({ event, resolve }) => {
	if (typeof event.platform?.env?.CLOUDFLARE_D1_DB === "undefined") {
		throw new Error("platform.env.CLOUDFLARE_D1_DB is not defined");
	}

	const db = drizzle(event.platform?.env?.CLOUDFLARE_D1_DB);
	const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable);

	const lucia = new Lucia(adapter, {
		sessionCookie: {
			attributes: {
				// set to `true` when using HTTPS
				secure: !dev,
			},
		},
		getUserAttributes: (attributes) => {
			return {
				// attributes has the type of DatabaseUserAttributes
				username: attributes.username,
			};
		},
	});

	event.locals.db = db;
	event.locals.lucia = lucia;

	const sessionId = event.cookies.get(lucia.sessionCookieName);

	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await lucia.validateSession(sessionId);

	if (session && session.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);
		// sveltekit types deviates from the de-facto standard
		// you can use 'as any' too
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes,
		});
	}
	if (!session) {
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes,
		});
	}
	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
};
