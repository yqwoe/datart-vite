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
import { FC, memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Modal } from 'antd';
import { LEVEL_100 } from 'styles/StyleConstants';
import styled from 'styled-components';
import { MockDataEditor } from 'app/pages/DashBoardPage/components/MockDataPanel/MockDataEditor';
import { exportChartTpl } from 'app/pages/MainPage/pages/VizPage/slice/thunks';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { getDataChartData } from './utils';

export interface MockDataPanelProps {
  onClose: () => void;
  chartId: string;
  open: boolean;
}
export const ChartMockDataPanel: FC<MockDataPanelProps> = memo(
  ({ open, chartId, onClose, ...props }) => {
    const dispatch = useDispatch();
    const t = useI18NPrefix('global.button');
    const [dataset, setDataset] = useState<any>();
    useEffect(() => {
      const dataset = dispatch(getDataChartData(chartId));
      setDataset(dataset);
    }, [chartId, dispatch]);

    const onExport = async () => {
      dispatch(
        exportChartTpl({ chartId, dataset: dataset, callBack: onClose }),
      );
    };

    const onDataChange = val => {
      const newDataset = { ...dataset };
      newDataset.rows = val;
      setDataset(newDataset);
    };
    return (
      <StyledWrapper
        className="mockDataPanel"
        open={open}
        title={null}
        width="100%"
        onCancel={onClose}
        {...props}
        maskClosable={false}
        onOk={onExport}
        style={{ top: 10 }}
        okText="导出"
      >
        <div className="content">
          <div className="empty-data" style={{ flex: 1 }}>
            <MockDataEditor
              originalData={dataset?.rows}
              onDataChange={onDataChange}
            />
          </div>
        </div>
      </StyledWrapper>
    );
  },
);
const StyledWrapper = styled(Modal)`
  & .content {
    height: 800px;
    display: flex;
    flex: 1;
    flex-direction: column;
    background-color: ${p => p.theme.bodyBackground};
    .empty-data {
      display: flex;
      flex: 1;
      align-content: center;
      align-items: center;
      justify-content: center;
    }
  }
  .btn-box {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    height: 50px;
    .btn {
      margin-right: 20px;
    }
  }
  .tab-box {
    display: flex;
    flex: 1;
  }
`;
