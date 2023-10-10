import { StorageKeys } from 'globalConstants';
import { ThemeKeyType } from './slice/types';
import { themes } from './themes';

/* istanbul ignore next line */
export const isSystemDark = window?.matchMedia
  ? window.matchMedia('(prefers-color-scheme: dark)')?.matches
  : undefined;

export function saveTheme(theme: ThemeKeyType) {
  window.localStorage && localStorage.setItem(StorageKeys.Theme, theme);
}

/* istanbul ignore next line */
export function getThemeFromStorage(): ThemeKeyType {
  let theme = 'light' as ThemeKeyType;

  //跟随系统颜色变化
  const media = window.matchMedia('(prefers-color-scheme:dark)');

  try {
    const storedTheme =
      window.localStorage && localStorage.getItem(StorageKeys.Theme);
    if (storedTheme) {
      theme = storedTheme as ThemeKeyType;
    } else if (media.matches) {
      theme = 'dark' as ThemeKeyType;
    }
  } catch (error) {
    throw error;
  }
  return theme;
}

export function getTokenVariableMapping(themeKey: string) {
  const currentTheme = themes[themeKey];
  return {
    colorPrimary: currentTheme.primary,
    successColor: currentTheme.success,
    processingColor: currentTheme.processing,
    errorColor: currentTheme.error,
    highlightColor: currentTheme.highlight,
    warningColor: currentTheme.warning,
    bodyBackground: currentTheme.bodyBackground,
    textColor: currentTheme.textColor,
    textColorSecondary: currentTheme.textColorLight,
    headingColor: currentTheme.textColor,
    disabledColor: currentTheme.textColorDisabled,
  };
}

export function getVarsToBeModified(themeKey: string) {
  const tokenVariableMapping = getTokenVariableMapping(themeKey);
  return {
    ...(themeKey === 'light' ? {} : {}),
    ...tokenVariableMapping,
  };
}
