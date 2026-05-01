<script lang="ts">
	import { page } from '$app/stores';

	let email = $state('');
	let password = $state('');
	let errorMessage = $state('');
	let showError = $state(false);

	const errorReasons: Record<string, string> = {
		invalid_credentials: 'Invalid email or password',
		user_not_found: 'Invalid email or password',
		invalid_input: 'Please check your email and password',
		server_error: 'Server error. Please try again later'
	};

	$effect(() => {
		if ($page.form?.reason) {
			errorMessage = errorReasons[$page.form.reason] || 'An error occurred';
			showError = true;
			// Auto-hide error after 5 seconds
			const timer = setTimeout(() => {
				showError = false;
			}, 5000);
			return () => clearTimeout(timer);
		}
	});
</script>

<div class="flex items-center justify-center min-h-screen bg-[#21211f]">
	<form method="POST" class="flex flex-col gap-6 w-full max-w-100 p-8">
		<h1 class="text-white text-center mb-4 text-3xl">Galactic Sovereign</h1>

		{#if showError}
			<div class="px-4 py-3 bg-red-900/30 border border-red-600 rounded text-red-200 text-sm">
				{errorMessage}
			</div>
		{/if}

		<div class="flex flex-col gap-2">
			<label for="email" class="text-white font-medium text-sm">Email</label>
			<input
				id="email"
				name="email"
				type="email"
				placeholder="Enter your email"
				bind:value={email}
				required
				class="px-3 py-2 border border-[#444] rounded bg-[#2a2a27] text-white text-base transition-colors focus:outline-none focus:border-[#666] focus:bg-[#333330] placeholder-[#888]"
			/>
		</div>

		<div class="flex flex-col gap-2">
			<label for="password" class="text-white font-medium text-sm">Password</label>
			<input
				id="password"
				name="password"
				type="password"
				placeholder="Enter your password"
				bind:value={password}
				required
				class="px-3 py-2 border border-[#444] rounded bg-[#2a2a27] text-white text-base transition-colors focus:outline-none focus:border-[#666] focus:bg-[#333330] placeholder-[#888]"
			/>
		</div>

		<button
			type="submit"
			class="px-6 py-2 bg-[#444] text-white border-0 rounded text-base font-medium cursor-pointer transition-colors mt-1 hover:bg-[#555] active:bg-[#333]"
		>
			Login
		</button>
	</form>
</div>
