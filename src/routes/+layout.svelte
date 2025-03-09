<script lang="ts">
	import '../app.css';
    import logo from '$lib/assets/logo/votist-logo.png'
    
	let { children } = $props();
</script>


<div class="navbar bg-base-100">
	<div class="flex-1">
		<a href="/">
			<img class=" w-16 m-1" src={logo} alt="votist logo">
		</a>
		
	</div>
	<div class="flex-none items-start">
		<div>
			<!-- profile info -->
			<p class='text-2xl text-right'>Josh Mehler</p>
			<p>Founder, Votist</p>
		</div>	
			<div>
				<div class="grid grid-cols-2">
					<!-- stats -->
					<div class="flex-col flex gap-2">
						<div class="mx-4 flex space-x-2">
							<p class='text-sm'>Knowledge</p>
							<div class="badge badge0">+1</div>
						</div>
						<div class="mx-4 flex space-x-2">
							<p class=' text-sm'>Charisma</p>
							<div class="badge badge-primary">+1</div>
						</div>
					</div>
					<!-- tags -->
					<div class="flex flex-col flex-wrap gap-2">
						<div class="badge badge-secondary">
							<p class="text-sm">Votist</p>
						</div>
						<div class="badge badge-accent">
							<p class='text-sm'>
								Scholar
							</p>
						</div>
						<div class="badge badge-accent">
							<p class="text-sm">	Mentor</p>
						</div>
					</div>
				</div>
			</div>
		<a href="/">
			<button class="btn btn-ghost">What is Votist?</button>
		</a>
		<button class="btn btn-ghost">Settings</button>
		<a href="/proposals">
			<button class="btn btn-square text-white mx-3 px-12 bg-votistBlue">
			  Login
			</button>
		</a>
	</div>
</div>
{@render children()}
