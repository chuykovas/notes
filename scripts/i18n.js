import i18next from 'i18next';
import en from '../locales/en/common.json';

await i18next.init({
  lng: 'ru',
  debug: true,
  resources: {
    ru,
    en,
  },
});