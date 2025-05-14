<script lang="ts">
	import logo from '$lib/assets/logo/votist-logo.png';
</script>

<div class="container mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-12">
	<div class="grid grid-cols-1 gap-12 md:grid-cols-2">
		<!-- Contact Form -->
		<div class="w-full">
			<h2 class="text-primary mb-8 text-2xl font-bold">Contact Us</h2>
			<form
				action="https://public.herotofu.com/v1/fe67e780-3073-11f0-9486-b3bf4f299ad0"
				method="post"
				class="space-y-6"
			>
				<div>
					<label for="name" class="text-primary mb-2 block text-sm font-medium">Name *</label>
					<input
						type="text"
						name="name"
						id="name"
						required
						class="border-primary focus:border-primary focus:ring-primary w-full rounded-md border p-3 focus:ring-1 focus:outline-none"
					/>
				</div>

				<div>
					<label for="email" class="text-primary mb-2 block text-sm font-medium">Email *</label>
					<input
						type="email"
						name="email"
						id="email"
						required
						class="border-primary focus:border-primary focus:ring-primary w-full rounded-md border p-3 focus:ring-1 focus:outline-none"
					/>
				</div>

				<div>
					<label for="phone" class="text-primary mb-2 block text-sm font-medium">Phone Number</label
					>
					<input
						type="tel"
						name="phone"
						id="phone"
						class="border-primary focus:border-primary focus:ring-primary w-full rounded-md border p-3 focus:ring-1 focus:outline-none"
					/>
				</div>

				<div>
					<label for="reason" class="text-primary mb-2 block text-sm font-medium"
						>Reason for Contact</label
					>
					<select
						name="reason"
						id="reason"
						class="border-primary focus:border-primary focus:ring-primary w-full rounded-md border p-3 focus:ring-1 focus:outline-none"
					>
						<option value="">Select a reason</option>
						<option value="partnership">Partnership Opportunity</option>
						<option value="feedback">Provide Feedback</option>
						<option value="support">Platform Support</option>
						<option value="other">Other</option>
					</select>
				</div>

				<div>
					<label for="message" class="text-primary mb-2 block text-sm font-medium">Message</label>
					<textarea
						name="message"
						id="message"
						rows="4"
						class="border-primary focus:border-primary focus:ring-primary w-full rounded-md border p-3 focus:ring-1 focus:outline-none"
					></textarea>
				</div>

				<div>
					<button
						type="submit"
						class="bg-primary hover:bg-opacity-90 focus:ring-primary w-full rounded-md px-6 py-3 text-white focus:ring-2 focus:ring-offset-2 focus:outline-none"
					>
						Send Message
					</button>
				</div>
			</form>
		</div>

		<!-- Logo and Tagline -->
		<div class="flex flex-col items-center justify-center space-y-6">
			<img src={logo} alt="Votist Logo" class="w-32" />
			<p class="text-primary text-center text-xl font-light">
				The platform for solution-driven civic engagement
			</p>
		</div>
	</div>
</div>
