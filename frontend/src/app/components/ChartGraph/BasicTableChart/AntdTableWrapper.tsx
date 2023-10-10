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
import { ConfigProvider, Table, TablePaginationConfig } from 'antd';
import { useAutoScroll } from 'app/hooks/useAutoScroll';
import useInterval from 'app/hooks/useInterval';
import { antdLocales } from 'locales/i18n';
import { FC, memo, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useRafInterval } from 'ahooks';

interface TableStyleConfigProps {
  odd?: {
    backgroundColor: string;
    color: string;
  };
  even?: {
    backgroundColor: string;
    color: string;
  };
  isFixedColumns?: boolean;
  summaryStyle?: {
    backgroundColor?: string;
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
    fontStyle?: string;
    color?: string;
  };
}

const AntdTableWrapper: FC<{
  dataSource: [];
  columns: [];
  tableStyleConfig?: TableStyleConfigProps | undefined;
  summaryFn?: (data) => { total: number; summarys: [] };
  pagination?: false | TablePaginationConfig;
}> = memo(
  ({
    dataSource = [],
    columns = [],
    children,
    summaryFn,
    tableStyleConfig,
    containerId,
    ...rest
  }) => {
    const { play, delay, pauseOnHover, direction, speed } = rest;
    const { i18n } = useTranslation();
    const tableRef = useRef(null);
    const getTableSummaryRow = pageData => {
      if (!summaryFn) {
        return undefined;
      }
      const summaryData = summaryFn?.(pageData);
      return (
        <Table.Summary fixed>
          <Table.Summary.Row>
            {(summaryData?.summarys || []).map((data, index) => {
              return (
                <Table.Summary.Cell key={index} index={index}>
                  {data}
                </Table.Summary.Cell>
              );
            })}
          </Table.Summary.Row>
        </Table.Summary>
      );
    };
    const directionMap = {
      up: dom => {
        dom.scrollTop += speed;
        if (
          Math.ceil(dom.scrollTop) >=
          parseFloat((dom.scrollHeight - dom.clientHeight).toString())
        ) {
          dom.scrollTop = 0;
        }
      },
      down: dom => {
        dom.scrollTop -= speed;
        if (dom.scrollTop <= 0) {
          dom.scrollTop = dom.scrollHeight;
        }
      },
      left: dom => {
        dom.scrollLeft += speed;
        if (
          Math.ceil(dom.scrollLeft) >=
          parseFloat((dom.scrollWidth - dom.clientWidth).toString())
        ) {
          dom.scrollLeft = 0;
        }
      },
      right: dom => {
        dom.scrollLeft -= speed;
        if (dom.scrollLeft <= 0) {
          dom.scrollLeft = dom.scrollWidth;
        }
      },
    };

    const [paused, setPaused] = useState(false);

    useRafInterval(
      () => {
        if (play) {
          const dom =
            tableRef?.current?.getElementsByClassName?.('ant-table-body')[0];
          directionMap?.[direction]?.(dom);
        }
      },
      !paused ? delay : null,
    );

    return (
      <ConfigProvider locale={antdLocales[i18n.language]}>
        {dataSource.length > 0 && (
          <TableWrapper
            onMouseOver={e => {
              pauseOnHover && setPaused(true);
            }}
            onMouseOut={e => {
              pauseOnHover && setPaused(false);
            }}
          >
            <StyledTable
              {...rest}
              ref={tableRef}
              tableStyleConfig={tableStyleConfig}
              dataSource={dataSource}
              columns={columns}
              summary={getTableSummaryRow}
            />
          </TableWrapper>
        )}
      </ConfigProvider>
    );
  },
);

const TableWrapper = styled.div`
  width: 100%;
  .virtual-table .ant-table-container:before,
  .virtual-table .ant-table-container:after {
    display: none;
  }
  .virtual-table-cell {
    box-sizing: border-box;
    padding: 16px;
    background: #fff;
    border-bottom: 1px solid #e8e8e8;
  }
  [data-theme='dark'] .virtual-table-cell {
    box-sizing: border-box;
    padding: 16px;
    background: #141414;
    border-bottom: 1px solid #303030;
  }
`;

const StyledTable = styled(Table)<{ tableStyleConfig?: TableStyleConfigProps }>`
  height: 100%;
  overflow: auto;
  .ant-table {
    background: transparent;
  }
  .ant-table-body {
    overflow: ${p =>
      p?.tableStyleConfig?.isFixedColumns ? 'auto scroll' : 'auto !important'};
  }
  .ant-table .ant-table-container .ant-table-body .ant-table-tbody td {
    background: inherit;
  }
  .ant-table-summary .ant-table-cell {
    font-family: ${p => p?.tableStyleConfig?.summaryStyle?.fontFamily};
    font-size: ${p => p?.tableStyleConfig?.summaryStyle?.fontSize + 'px'};
    font-style: ${p => p?.tableStyleConfig?.summaryStyle?.fontStyle};
    font-weight: ${p => p?.tableStyleConfig?.summaryStyle?.fontWeight};
    color: ${p => p?.tableStyleConfig?.summaryStyle?.color};
    background-color: ${p =>
      p?.tableStyleConfig?.summaryStyle?.backgroundColor};
  }
  .ant-table .ant-table-container .ant-table-body .datart-basic-table-odd {
    color: ${p => p?.tableStyleConfig?.odd?.color || 'inherit'};
    background: ${p =>
      p?.tableStyleConfig?.odd?.backgroundColor || 'transparent'};
  }
  .ant-table .ant-table-container .ant-table-body .datart-basic-table-even {
    color: ${p => p?.tableStyleConfig?.even?.color || 'inherit'};
    background: ${p =>
      p?.tableStyleConfig?.even?.backgroundColor || 'transparent'};
  }
`;

export default AntdTableWrapper;
