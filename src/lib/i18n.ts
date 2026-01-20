// src/lib/i18n.ts
import { addMessages, init } from 'svelte-i18n';
import en from './locales/en.json';
import hu from './locales/hu.json';

addMessages('en', en);
addMessages('hu', hu);

init({
  fallbackLocale: 'en',
  initialLocale: 'hu',
});