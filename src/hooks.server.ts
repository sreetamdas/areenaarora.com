import { sequence } from "@sveltejs/kit/hooks";
import { migrationHandle, svelteKitAuthHandle } from "$lib/auth";

export const handle = sequence(migrationHandle, svelteKitAuthHandle);
