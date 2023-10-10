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
import {
  BlockOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Tabs } from 'antd';
import useComputedState from 'app/hooks/useComputedState';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import ChartI18NContext from 'app/pages/ChartWorkbenchPage/contexts/Chart18NContext';
import ChartPaletteContext from 'app/pages/ChartWorkbenchPage/contexts/ChartPaletteContext';
import { ChartConfigReducerActionType } from 'app/pages/ChartWorkbenchPage/slice/constant';
import { currentDataViewSelector } from 'app/pages/ChartWorkbenchPage/slice/selectors';
import { ChartConfigPayloadType } from 'app/pages/ChartWorkbenchPage/slice/types';
import { selectVizs } from 'app/pages/MainPage/pages/VizPage/slice/selectors';
import {
  ChartConfig,
  ChartDataConfig,
  ChartStyleConfig,
} from 'app/types/ChartConfig';
import ChartDataView from 'app/types/ChartDataView';
import { FC, memo } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  BORDER_RADIUS,
  FONT_WEIGHT_MEDIUM,
  SPACE,
  SPACE_MD,
} from 'styles/StyleConstants';
import { cond, isEmptyArray } from 'utils/object';
import ChartDataConfigPanel from './ChartDataConfigPanel';
import ChartStyleConfigPanel from './ChartStyleConfigPanel';
import ChartToolbar from '../ChartToolbar';

const { TabPane } = Tabs;

const CONFIG_PANEL_TABS = {
  DATA: 'data',
  STYLE: 'style',
  SETTING: 'setting',
  INTERACTION: 'interaction',
};

const ChartConfigPanel: FC<{
  dataView?: ChartDataView;
  chartId?: string;
  chartConfig?: ChartConfig;
  expensiveQuery?: boolean;
  onChange: (type: string, payload: ChartConfigPayloadType) => void;
}> = memo(
  ({ chartId, chartConfig, expensiveQuery, onChange }) => {
    const t = useI18NPrefix(`viz.palette`);
    const vizs = useSelector(selectVizs);
    const dataview = useSelector(currentDataViewSelector);
    const [tabActiveKey, setTabActiveKey] = useComputedState(
      () => {
        return cond(
          [config => !isEmptyArray(config?.datas), CONFIG_PANEL_TABS.DATA],
          [config => !isEmptyArray(config?.styles), CONFIG_PANEL_TABS.STYLE],
          [
            config => !isEmptyArray(config?.settings),
            CONFIG_PANEL_TABS.SETTING,
          ],
          [
            config => !isEmptyArray(config?.interactions),
            CONFIG_PANEL_TABS.INTERACTION,
          ],
        )(chartConfig, CONFIG_PANEL_TABS.DATA);
      },
      (prev, next) => prev !== next,
      chartId,
    );

    const onDataConfigChanged = (
      ancestors,
      config: ChartDataConfig,
      needRefresh?: boolean,
    ) => {
      onChange?.(ChartConfigReducerActionType.DATA, {
        ancestors: ancestors,
        value: config,
        needRefresh,
      });
    };

    const handleConfigChangeByAction =
      (actionType: string) =>
      (
        ancestors: number[],
        config: ChartStyleConfig,
        needRefresh?: boolean,
      ) => {
        onChange?.(actionType, {
          ancestors: ancestors,
          value: config,
          needRefresh,
        });
      };

    const items = [
      !isEmptyArray(chartConfig?.datas) && {
        key: CONFIG_PANEL_TABS.DATA,
        label: (
          <span>
            <DatabaseOutlined />
            {t('title.content')}
          </span>
        ),
        children: (
          <ChartDataConfigPanel
            dataConfigs={chartConfig?.datas}
            expensiveQuery={expensiveQuery}
            onChange={onDataConfigChanged}
          />
        ),
      },
      !isEmptyArray(chartConfig?.styles) && {
        key: CONFIG_PANEL_TABS.STYLE,
        label: (
          <span>
            <DashboardOutlined />
            {t('title.design')}
          </span>
        ),
        children: (
          <ChartStyleConfigPanel
            key="viz.palette.style"
            i18nPrefix="viz.palette.style"
            configs={chartConfig?.styles}
            dataConfigs={chartConfig?.datas}
            onChange={handleConfigChangeByAction(
              ChartConfigReducerActionType.STYLE,
            )}
          />
        ),
      },
      !isEmptyArray(chartConfig?.settings) && {
        key: CONFIG_PANEL_TABS.SETTING,
        label: (
          <span>
            <SettingOutlined />
            {t('title.setting')}
          </span>
        ),
        children: (
          <ChartStyleConfigPanel
            key="viz.palette.setting"
            i18nPrefix="viz.palette.setting"
            configs={chartConfig?.settings}
            dataConfigs={chartConfig?.datas}
            onChange={handleConfigChangeByAction(
              ChartConfigReducerActionType.SETTING,
            )}
          />
        ),
      },
      !isEmptyArray(chartConfig?.interactions) && {
        key: CONFIG_PANEL_TABS.INTERACTION,
        label: (
          <span>
            <BlockOutlined />
            {t('title.interaction')}
          </span>
        ),
        children: (
          <ChartStyleConfigPanel
            key="viz.palette.interaction"
            i18nPrefix="viz.palette.interaction"
            configs={chartConfig?.interactions}
            dataConfigs={chartConfig?.datas}
            context={{ vizs, dataview }}
            onChange={handleConfigChangeByAction(
              ChartConfigReducerActionType.INTERACTION,
            )}
          />
        ),
      },
    ];

    return (
      <ChartI18NContext.Provider value={{ i18NConfigs: chartConfig?.i18ns }}>
        <ChartPaletteContext.Provider value={{ datas: chartConfig?.datas }}>
          <StyledChartDataViewPanel>
            <ConfigBlock>
              <ChartToolbar />
              <Tabs
                items={items}
                activeKey={tabActiveKey}
                className="tabs"
                onChange={setTabActiveKey}
                centered
              />
            </ConfigBlock>
          </StyledChartDataViewPanel>
        </ChartPaletteContext.Provider>
      </ChartI18NContext.Provider>
    );
  },
  (prev, next) =>
    prev.chartConfig === next.chartConfig &&
    prev.chartId === next.chartId &&
    prev.expensiveQuery === next.expensiveQuery,
);

export default ChartConfigPanel;

const StyledChartDataViewPanel = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 ${SPACE};
  background-color: ${p => p.theme.bodyBackground};
`;

const ConfigBlock = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  background-color: ${p => p.theme.componentBackground};
  border-radius: ${BORDER_RADIUS};

  .tabs {
    font-weight: ${FONT_WEIGHT_MEDIUM};
    color: ${p => p.theme.textColorSnd};
    .ant-tabs-content {
      padding: 0 ${SPACE_MD};
      overflow-y: auto;
      height: calc(100vh - 103px);
    }
  }
`;
