<script lang="ts">
  import "../lib/i18n";
  import favicon from "$lib/assets/favicon.svg";
  import Header from "$lib/Header.svelte";
  import "../app.scss";

  import { createCodeRepo } from "$lib";
  import { defaultCode } from "$lib";

  import { setContext } from "svelte";

  const codeRepo = createCodeRepo(defaultCode);
  setContext("codeRepo", codeRepo);

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<Header />

<main>
  {@render children()}
</main>
