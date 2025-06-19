import type { Auth } from 'svelte-clerk';

declare global {
	namespace App {
		interface Locals {
			auth: () => Promise<{ userId: string | null }>;
		}
	}
}

export {};
