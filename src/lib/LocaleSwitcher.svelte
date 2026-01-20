<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { locale } from 'svelte-i18n';

  function updateLocale(event: Event) {
    const target = event.target as HTMLSelectElement;
    const newLang = target.value;

    const newUrl = new URL($page.url);
    if (newLang === 'en') {
      newUrl.searchParams.set('lang', 'en');
    } else {
      newUrl.searchParams.delete('lang');
    }
    goto(newUrl.pathname + newUrl.search, { keepFocus: true, noScroll: true });
  }
</script>

<select value={$locale} onchange={updateLocale}>
  <option value="hu">🇭🇺 Magyar</option>
  <option value="en">🇬🇧 English</option>
</select>