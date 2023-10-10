/**
 * Datart Vite
 *
 * Copyright 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { message } from 'antd';
import echartsDarkTheme from 'app/assets/theme/echarts_dark_theme';
import echartsDefaultTheme from 'app/assets/theme/echarts_default_theme';
import echartsPurplePassionTheme from 'app/assets/theme/echarts_purple_passion_theme';
import echartsRomaTheme from 'app/assets/theme/echarts_roma_theme';
import { registerTheme } from 'echarts';
import { PUBLIC_URL, StorageKeys } from 'globalConstants';
import { useEffect, useLayoutEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { GlobalStyles } from 'styles/globalStyles';
import { getToken } from 'utils/auth';
import { LoginAuthRoute } from './LoginAuthRoute';
import RootConfigProvider from './RootConfigProvider';
import useI18NPrefix from './hooks/useI18NPrefix';
import { LazyActivationPage } from './pages/ActivationPage/Loadable';
import { LazyAuthorizationPage } from './pages/AuthorizationPage/Loadable';
import { LazyForgetPasswordPage } from './pages/ForgetPasswordPage/Loadable';
import { LazyLoginPage } from './pages/LoginPage/Loadable';
import { LazyRegisterPage } from './pages/RegisterPage/Loadable';
import { LazySetupPage } from './pages/SetupPage/Loadable';
import { useAppSlice } from './slice';
import {
  getSystemInfo,
  logout,
  setLoggedInUser
} from './slice/thunks';

registerTheme('default', echartsDefaultTheme);
registerTheme('purple-passion', echartsPurplePassionTheme);
registerTheme('dark', echartsDarkTheme);
registerTheme('roma', echartsRomaTheme);

export function AppRouter() {
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const logged = !!getToken();
  const t = useI18NPrefix('global');
  useAppSlice();

  useLayoutEffect(() => {
    if (logged) {
      dispatch(setLoggedInUser());
    } else {
      if (localStorage.getItem(StorageKeys.LoggedInUser)) {
        message.warning(t('tokenExpired'));
      }
      dispatch(logout());
    }
  }, [dispatch, t, logged]);

  useEffect(() => {
    dispatch(getSystemInfo());
  }, [dispatch]);

  return (
    <RootConfigProvider>
      <BrowserRouter basename={PUBLIC_URL}>
        <Helmet
          titleTemplate="%s - Datart"
          defaultTitle="Datart"
          htmlAttributes={{ lang: i18n.language }}
        >
          <meta name="description" content="Datart" />
        </Helmet>
        <Routes>
          <Route path="/setup" element={<LazySetupPage />} />
          <Route path="/login" element={<LazyLoginPage />} />
          <Route path="/register" element={<LazyRegisterPage />} />
          <Route path="/activation" element={<LazyActivationPage />} />
          <Route path="/forgetPassword" element={<LazyForgetPasswordPage />} />
          <Route path="/authorization" element={<LazyAuthorizationPage />} />
          <Route path="*" element={<LoginAuthRoute />} />
        </Routes>
        <GlobalStyles />
      </BrowserRouter>
    </RootConfigProvider>
  );
}
