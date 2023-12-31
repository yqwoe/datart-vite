import { StorageKeys } from 'globalConstants';
import { instance as requestInstance } from 'utils/request';
import antd_en_US from 'antd/locale/en_US';
import antd_zh_CN from 'antd/locale/zh_CN';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import en from './en/translation.json';
import { convertLanguageJsonToObject } from './translations';
import { getInitialLocale } from './utils';
import zh from './zh/translation.json';
import moment from 'moment';
import 'moment/dist/locale/zh-cn';

export const translationsJson = {
  en: {
    translation: en,
  },
  zh: {
    translation: zh,
  },
};

// Create the 'translations' object to provide full intellisense support for the static json files.
convertLanguageJsonToObject(en);

export const changeLang = lang => {
  localStorage.setItem(StorageKeys.Locale, lang);
  window.location && window.location.reload();
};

export const getLang = () => {
  return localStorage.getItem(StorageKeys.Locale);
};

const initialLocale = getInitialLocale();
requestInstance.defaults.headers['Accept-Language'] =
  initialLocale === 'zh' ? 'zh-CN' : 'en-US'; // FIXME locale
moment.locale(initialLocale === 'zh' ? 'zh-cn' : 'en-us'); // FIXME locale

export const i18n = i18next
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    lng: initialLocale,
    resources: translationsJson,
    fallbackLng: 'zh',
    debug: import.meta.env.DEV,

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export const antdLocales = {
  en: antd_en_US,
  zh: antd_zh_CN,
};
