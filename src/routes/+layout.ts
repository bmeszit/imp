// src/routes/+layout.ts
import { browser } from '$app/environment';
import '../lib/i18n'; 
import { waitLocale } from 'svelte-i18n';

export const load = async () => {
  await waitLocale();
};