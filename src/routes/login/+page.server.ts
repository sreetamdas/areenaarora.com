import { error, fail, redirect } from "@sveltejs/kit";

import type { Actions, PageServerLoad } from "./$types";
import { userTable } from "$lib/server/schema";
import { eq } from "drizzle-orm";
import { Scrypt } from "lucia";

export const load = (async (event) => {
	if (event.locals.user) {
		redirect(302, "/admin/dashboard");
	}

	return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get("username");
		const password = formData.get("password");

		if (
			typeof username !== "string" ||
			username.length < 3 ||
			username.length > 31 ||
			!/^[a-z0-9_-]+$/.test(username)
		) {
			return fail(400, {
				message: "Invalid username",
			});
		}
		if (typeof password !== "string" || password.length < 6 || password.length > 255) {
			return fail(400, {
				message: "Invalid password",
			});
		}

		const db = event.locals.db;
		const lucia = event.locals.lucia;

		const existingUsers = await db
			.select()
			.from(userTable)
			.where(eq(userTable.username, username.toLowerCase()));

		if (!existingUsers) {
			// NOTE:
			// Returning immediately allows malicious actors to figure out valid usernames from response times,
			// allowing them to only focus on guessing passwords in brute-force attacks.
			// As a preventive measure, you may want to hash passwords even for invalid usernames.
			// However, valid usernames can be already be revealed with the signup page among other methods.
			// It will also be much more resource intensive.
			// Since protecting against this is none-trivial,
			// it is crucial your implementation is protected against brute-force attacks with login throttling etc.
			// If usernames are public, you may outright tell the user that the username is invalid.
			return fail(400, {
				message: "Incorrect username or password",
			});
		}

		if (existingUsers.length > 1) {
			return error(500, {
				message: "More than one result, how is that even possible",
			});
		}

		const [existingUser] = existingUsers;

		const validPassword = await new Scrypt().verify(existingUser.hashed_password, password);

		if (!validPassword) {
			return fail(400, {
				message: "Incorrect username or password",
			});
		}

		const session = await lucia.createSession(existingUser.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);

		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes,
		});

		event.locals.session = session;
		event.locals.user = existingUser;

		redirect(302, "/admin/dashboard");
	},
};
