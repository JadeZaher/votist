<script lang="ts">
	import { SignOutButton, SignedIn } from 'svelte-clerk';
	import { goto } from '$app/navigation';

	function handleSignOut() {
		// Redirect to sign-in after sign out
		goto('/sign-in');
	}
</script>

<div class="flex min-h-screen items-center justify-center">
	<div class="card bg-base-100 w-96 shadow-xl">
		<div class="card-body items-center text-center">
			<h2 class="card-title">Sign Out</h2>
			<p class="mb-4">Are you sure you want to sign out?</p>
			<SignedIn>
				<div class="card-actions">
					<SignOutButton afterSignOutUrl="/sign-in">
						<button class="btn btn-error" on:click={handleSignOut}>Sign Out</button>
					</SignOutButton>
					<a href="/dashboard" class="btn btn-ghost">Cancel</a>
				</div>
			</SignedIn>
		</div>
	</div>
</div>
