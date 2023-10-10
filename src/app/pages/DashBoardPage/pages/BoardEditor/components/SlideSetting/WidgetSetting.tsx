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
import { FC, memo, useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tabs } from 'antd';
import { ChartStyleConfig } from 'app/types/ChartConfig';
import styled from 'styled-components';
import { WidgetChartContext } from 'app/pages/DashBoardPage/components/WidgetProvider/WidgetChartProvider';
import { WidgetContext } from 'app/pages/DashBoardPage/components/WidgetProvider/WidgetProvider';
import { selectVizs } from 'app/pages/MainPage/pages/VizPage/slice/selectors';
import useChartInteractions from 'app/hooks/useChartInteractions';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { updateBy } from 'app/utils/mutation';
import { editBoardStackActions } from '../../slice';
import { showRectAction } from '../../slice/actions/actions';
import { selectSortAllWidgets } from '../../slice/selectors';
import { NameSet } from './SettingItem/NameSet';
import { RectSet } from './SettingItem/RectSet';
import { SettingPanel } from './SettingPanel';
import { WidgetConfigPanel } from './WidgetConfigPanel';

export const WidgetSetting: FC<{ boardId?: string }> = memo(({ boardId }) => {
  const t = useI18NPrefix(`viz.board.setting`);
  const dispatch = useDispatch();
  const widget = useContext(WidgetContext);
  const { dataChart, chartDataView } = useContext(WidgetChartContext);
  const showRect = dispatch(showRectAction(widget)) as unknown as boolean;
  const [currentTab, setCurrentTab] = useState<string>('style');
  const vizs = useSelector(selectVizs);
  const allWidgets = useSelector(selectSortAllWidgets);
  const { getDrillThroughSetting, getViewDetailSetting } = useChartInteractions(
    {},
  );

  const handleStyleConfigChange = (
    ancestors: number[],
    configItem: ChartStyleConfig,
    needRefresh?: boolean,
  ) => {
    dispatch(
      editBoardStackActions.updateWidgetStyleConfigByPath({
        ancestors,
        configItem,
        wid: widget.id,
      }),
    );
  };

  const handleInteractionConfigChange = (
    ancestors: number[],
    configItem: ChartStyleConfig,
    needRefresh?: boolean,
  ) => {
    dispatch(
      editBoardStackActions.updateWidgetInteractionConfigByPath({
        ancestors,
        configItem,
        wid: widget.id,
      }),
    );
  };

  const updateInteractionOptionWhenHasChartInteraction = (
    interactions: ChartStyleConfig[],
  ) => {
    const drillThroughKey = 'drillThrough';
    const viewDetailKey = 'viewDetail';
    const chartInteractions =
      dataChart?.config?.chartConfig?.interactions || [];
    const chartDrillThroughSetting = getDrillThroughSetting(
      chartInteractions,
      [],
    );
    const chartViewDetailSetting = getViewDetailSetting(chartInteractions, []);
    return updateBy(interactions, draft => {
      const boardDrillThrough = draft.find(i => i.key === drillThroughKey);
      const boardViewDetail = draft.find(i => i.key === viewDetailKey);
      if (boardDrillThrough) {
        boardDrillThrough.options = Object.assign(
          {},
          boardDrillThrough?.options,
          {
            hasOriginal: !!chartDrillThroughSetting,
          },
        );
      }
      if (boardViewDetail) {
        boardViewDetail.options = Object.assign(
          {},
          boardDrillThrough?.options,
          {
            hasOriginal: !!chartViewDetailSetting,
          },
        );
      }
      return interactions;
    });
  };

  const items = [
    {
      key: 'style',
      label: t('style'),
      children: (
        <SettingPanel title={`${t('widget')}${t('setting')}`}>
          <>
            <NameSet
              wid={widget?.id}
              name={widget?.config?.name}
              boardVizs={allWidgets}
            />
            {showRect && (
              <RectSet wid={widget?.id} rect={widget?.config?.rect} />
            )}
            <WidgetConfigPanel
              configs={widget?.config?.customConfig?.props || []}
              onChange={handleStyleConfigChange}
            />
          </>
        </SettingPanel>
      ),
    },
    {
      key: 'interaction',
      label: t('interaction'),
      children: (
        <SettingPanel title={`${t('widget')}${t('setting')}`}>
          <WidgetConfigPanel
            configs={updateInteractionOptionWhenHasChartInteraction(
              widget?.config?.customConfig?.interactions || [],
            )}
            dataConfigs={dataChart?.config?.chartConfig?.datas}
            context={{
              widgetId: widget?.id,
              vizs,
              boardVizs: allWidgets,
              dataview: chartDataView,
            }}
            onChange={handleInteractionConfigChange}
          />
        </SettingPanel>
      ),
    },
  ];

  return (
    <StyledWidgetSetting
      activeKey={currentTab}
      onChange={key => setCurrentTab(key)}
      items={items}
      centered
    />
  );
});

export default WidgetSetting;

const StyledWidgetSetting = styled(Tabs)`
  .ant-tabs-content-holder {
    overflow: auto;
    height: calc(100vh - 159px);
  }
`;
