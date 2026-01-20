import { addMessages, init, locale } from 'svelte-i18n';
import { browser } from '$app/environment';
import en from './locales/en.json';
import hu from './locales/hu.json';

addMessages('en', en);
addMessages('hu', hu);

const savedLocale = browser ? window.localStorage.getItem('locale') : null;
const initialLocale = savedLocale || 'hu';

init({
  fallbackLocale: 'en',
  initialLocale: initialLocale,
});

if (browser) {
  locale.subscribe((value) => {
    if (value) {
      window.localStorage.setItem('locale', value);
    }
  });
}