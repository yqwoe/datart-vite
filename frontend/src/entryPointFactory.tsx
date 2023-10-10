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
import { Fragment } from 'react';
import 'react-app-polyfill/ie11';
// TODO(Stephen): check if need it
import 'react-app-polyfill/stable';
import { Inspector } from 'react-dev-inspector';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
// TODO(Stephen): check if need it
import 'app/assets/fonts/iconfont.css';
import 'core-js/features/string/replace-all';
import { configureAppStore } from 'redux/configureStore';
import { ThemeProvider } from 'styles/theme/ThemeProvider';
import { Debugger } from 'utils/debugger';
import './locales/i18n';

export const generateEntryPoint = EntryPointComponent => {
  const IS_DEVELOPMENT = import.meta.env.DEV;
  const MOUNT_NODE = document.getElementById('root') as HTMLElement;
  const store = configureAppStore();
  Debugger.instance.setEnable(IS_DEVELOPMENT);

  const InspectorWrapper = IS_DEVELOPMENT ? Inspector : Fragment;

  const root = createRoot(MOUNT_NODE);

  root.render(
    <InspectorWrapper>
      <Provider store={store}>
        <ThemeProvider>
          <HelmetProvider>
            <EntryPointComponent />
          </HelmetProvider>
        </ThemeProvider>
      </Provider>
    </InspectorWrapper>,
  );
};
