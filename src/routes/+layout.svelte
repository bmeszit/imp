<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
  import Header from '$lib/Header.svelte';
  import '../app.scss';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Header />

{@render children()}
