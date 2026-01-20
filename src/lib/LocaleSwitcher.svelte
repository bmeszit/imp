<script lang="ts">
  import { locale } from 'svelte-i18n';

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'hu', label: 'Magyar', flag: '🇭🇺' }
  ];

  function updateLocale(event: Event) {
    const target = event.target as HTMLSelectElement;
    $locale = target.value;
  }
</script>

<div class="switcher">
  <select value={$locale} onchange={updateLocale}>
    {#each languages as lang}
      <option value={lang.code}>
        {lang.flag} {lang.label}
      </option>
    {/each}
  </select>
</div>

<style>
  select {
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    border: 1px solid #ccc;
    background: white;
    cursor: pointer;
    font-size: 0.9rem;
  }
</style>