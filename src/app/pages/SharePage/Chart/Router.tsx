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
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import echartsDarkTheme from 'app/assets/theme/echarts_dark_theme';
import echartsDefaultTheme from 'app/assets/theme/echarts_default_theme';
import echartsPurplePassionTheme from 'app/assets/theme/echarts_purple_passion_theme';
import echartsRomaTheme from 'app/assets/theme/echarts_roma_theme';
import { antdLocales } from 'locales/i18n';
import { GlobalStyles } from 'styles/globalStyles';
import { registerTheme } from 'echarts';
import HelmetPageTitle from '../components/HelmetPageTitle';
import { LazyShareChart } from './Loadable';
import { PUBLIC_URL } from 'globalConstants';

registerTheme('default', echartsDefaultTheme);
registerTheme('purple-passion', echartsPurplePassionTheme);
registerTheme('dark', echartsDarkTheme);
registerTheme('roma', echartsRomaTheme);

export function Router() {
  const { i18n } = useTranslation();

  return (
    <ConfigProvider locale={antdLocales[i18n.language]}>
      <BrowserRouter basename={PUBLIC_URL}>
        <HelmetPageTitle lang={i18n.language} />
        <Routes>
          <Route path="/shareChart/:token" element={<LazyShareChart />} />
        </Routes>
        <GlobalStyles />
      </BrowserRouter>
    </ConfigProvider>
  );
}
