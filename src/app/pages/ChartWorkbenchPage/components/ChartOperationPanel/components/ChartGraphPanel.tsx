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
import { FC, memo, useLayoutEffect, useRef, useState } from 'react';
import ChartManager from 'app/models/ChartManager';
import { IChart } from 'app/types/Chart';
import { ChartConfig } from 'app/types/ChartConfig';
import { BORDER_RADIUS, SPACE } from 'styles/StyleConstants';
import styled from 'styled-components';
import ChartI18NContext from 'app/pages/ChartWorkbenchPage/contexts/Chart18NContext';
import { transferChartDataConfig } from 'app/utils/internalChartHelper';
import { CloneValueDeep } from 'utils/object';
import ChartGraphIcon from './ChartGraphIcon';

const ChartGraphPanel: FC<{
  chart?: IChart;
  chartConfig?: ChartConfig;
  onChartChange: (chart: IChart) => void;
}> = memo(({ chart, chartConfig, onChartChange }) => {
  const chartManager = ChartManager.instance();
  const [allCharts] = useState<IChart[]>(chartManager.getAllCharts());
  const [requirementsStates, setRequirementStates] = useState<object>({});

  const graphPanel = useRef() as React.MutableRefObject<HTMLDivElement>;

  useLayoutEffect(() => {
    if (allCharts) {
      const dict = allCharts?.reduce((acc, cur) => {
        const transferedChartConfig = transferChartDataConfig(
          { datas: CloneValueDeep(cur?.config?.datas || []) },
          { datas: chartConfig?.datas },
        );
        acc[cur.meta.id] = cur?.isMatchRequirement(transferedChartConfig);
        return acc;
      }, {});
      setRequirementStates(dict);
    }
  }, [allCharts, chartConfig]);

  return (
    <StyledChartGraphPanel ref={graphPanel}>
      {allCharts.map(c => {
        return (
          <ChartI18NContext.Provider
            key={c?.meta?.id}
            value={{ i18NConfigs: c?.config?.i18ns }}
          >
            <ChartGraphIcon
              chart={c}
              isActive={c?.meta?.id === chart?.meta?.id}
              isMatchRequirement={!!requirementsStates?.[c?.meta?.id]}
              onChartChange={onChartChange}
            />
          </ChartI18NContext.Provider>
        );
      })}
    </StyledChartGraphPanel>
  );
});

export default ChartGraphPanel;

const StyledChartGraphPanel = styled.div`
  display: flex;
  flex-flow: row wrap;
  padding: ${SPACE};
  margin-bottom: ${SPACE};
  color: ${p => p.theme.textColorLight};
  background-color: ${p => p.theme.componentBackground};
  border-radius: ${BORDER_RADIUS};
`;
