import { OverlayProvider } from '@react-aria/overlays';
import { SSRProvider } from '@react-aria/ssr';
import React, { useEffect, useMemo, useState } from 'react';

import CssBaseline from '../css-baseline';
import useSSR from '../use-ssr';
import deepMerge from '../utils/deep-merge';
import { copyObject } from '../utils/object';
import withDefaults from '../utils/with-defaults';

import ThemeContext, { defaultContext } from './theme-context';
import { CreateTheme, ReCompUIThemeContext, ThemeType } from './types';
import {
  changeTheme,
  getDocumentCSSTokens,
  getDocumentTheme,
  getThemeName,
} from './utils';

export interface Props {
  theme?: CreateTheme;
  disableBaseline?: boolean;
  children?: React.ReactNode;
}

const defaultProps = {
  disableBaseline: false,
};

export type ThemeProviderProps = Props & typeof defaultProps;

const ThemeProvider: React.FC<ThemeProviderProps> = ({
  theme: userTheme,
  disableBaseline,
  children,
}) => {
  const { isBrowser } = useSSR();

  const [currentTheme, setCurrentTheme] = useState<ThemeType | string>(
    defaultContext.type,
  );

  const changeCurrentTheme = (type: ThemeType | string) => {
    setCurrentTheme((ct) => (ct !== type ? type : ct));
  };

  const changeTypeBaseEl = (el: HTMLElement) => {
    const themeValue = getDocumentTheme(el);

    themeValue && changeCurrentTheme(themeValue);
  };

  const providerValue = useMemo<ReCompUIThemeContext>(() => {
    const themeTokens = isBrowser ? getDocumentCSSTokens() : {};
    const theme = deepMerge(copyObject(defaultContext.theme), themeTokens);
    const themeName = getThemeName(currentTheme);

    return {
      theme,
      type: themeName,
      isDark: themeName === 'dark',
    };
  }, [currentTheme, isBrowser]);

  useEffect(() => {
    // initial set
    changeTypeBaseEl(document?.documentElement);

    const observer = new MutationObserver((mutation) => {
      if (
        mutation &&
        mutation.length > 0 &&
        mutation[0]?.target.nodeName === 'BODY'
      ) {
        const documentTheme = document?.body?.dataset?.theme;

        documentTheme && changeCurrentTheme(documentTheme);
      } else {
        changeTypeBaseEl(document?.documentElement);
      }
    });

    observer.observe(document?.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'style'],
    });

    observer.observe(document?.body, {
      attributes: true,
      attributeFilter: ['data-theme', 'style'],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isBrowser || !userTheme) {
      return;
    }
    if (userTheme?.className) {
      changeTheme(userTheme.className);
      changeCurrentTheme(getThemeName(userTheme.className));
    }
  }, [isBrowser, userTheme]);

  return (
    <SSRProvider>
      <OverlayProvider>
        <ThemeContext.Provider value={providerValue}>
          {!disableBaseline && <CssBaseline />}
          {children}
        </ThemeContext.Provider>
      </OverlayProvider>
    </SSRProvider>
  );
};

export default withDefaults(ThemeProvider, defaultProps);
