<script lang="ts">
  import { t, locale } from 'svelte-i18n';
  import LocaleSwitcher from './LocaleSwitcher.svelte';
</script>

<header>
  <nav>
    <a href="/{$locale === 'en' ? '?lang=en' : ''}" class="logo">{$t('common.title')}</a>
    <LocaleSwitcher />
  </nav>
</header>

<style>
  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 3rem 0rem;
    border-bottom: 1px solid #eee;
  }
  .logo {
    font-size: 3.5rem;
    font-weight: bold;
    text-decoration: none;
    color: black;
  }
</style>