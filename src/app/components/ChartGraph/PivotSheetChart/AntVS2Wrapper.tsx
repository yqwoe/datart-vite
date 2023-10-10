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
import { DataCell, measureTextWidth, setLang } from '@antv/s2';
import { SheetComponent } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';
import { getLang } from 'locales/i18n';
import { FC, memo, useRef, useState } from 'react';
import styled from 'styled-components';
import { FONT_SIZE_LABEL } from 'styles/StyleConstants';
import { AndvS2Config } from './types';

import { useRafInterval } from 'ahooks';

// 进度条
const PROGRESS_BAR = {
  width: 80,
  height: 10,
  innerHeight: 6,
};

// 期望线
const EXPECTED_LINE = {
  width: 1,
  height: 12,
  color: '#000',
};

// 当前进度状态颜色
const STATUS_COLOR = {
  healthy: '#30BF78',
  late: '#FAAD14',
  danger: '#F4664A',
};

const DERIVE_COLOR = {
  up: '#F4664A',
  down: '#30BF78',
};

// 间距
const PADDING = 10;

function getStatusColorByProgress(realProgress, expectedProgress) {
  const leftWorker = expectedProgress - realProgress;
  if (leftWorker <= 0.1) {
    return STATUS_COLOR.healthy;
  }
  if (leftWorker > 0.1 && leftWorker <= 0.3) {
    return STATUS_COLOR.late;
  }
  return STATUS_COLOR.danger;
}

const CONTAINER_COLOR = '#E9E9E9';

export class KpiStrategyDataCell extends DataCell {
  // 重写数值单元格
  initCell() {
    super.initCell();
    // 在绘制完原本的单元格后, 再绘制进度条和衍生指标
    this.renderProgressBar();
    // this.renderDeriveValue();
  }

  // 如果是进度, 格式化为百分比 (只做 demo 示例, 请根据实际情况使用)
  getFormattedFieldValue() {
    const { data } = this.meta;
    if (!data || !data.isProgress) {
      return super.getFormattedFieldValue();
    }
    const formattedValue = `${data.value * 100} %`;
    return { formattedValue, value: data.value };
  }

  // 绘制衍生指标
  renderDeriveValue() {
    // 通过 this.meta 拿到当前单元格的有效信息
    const { x, width, data } = this.meta;
    if (!data || data.isExtra) {
      return;
    }
    const value = data?.compare ?? '';
    const isDown = value.startsWith('-');
    const color = isDown ? DERIVE_COLOR.down : DERIVE_COLOR.up;
    const displayValue = value.replace('-', '');
    const text = isDown ? `↓${displayValue}` : `↑${displayValue}`;
    const textStyle = {
      fill: color,
      fontSize: 12,
    };
    // 获取当前文本坐标
    const { maxY } = this.textShape.getBBox();
    // 获取当前文本宽度
    const textWidth = measureTextWidth(text, textStyle);
    // 衍生指标靠右显示
    const textX = x + width - textWidth - PADDING;
    // 衍生指标和数值对齐显示
    const textY = maxY;

    this.addShape('text', {
      attrs: {
        x: textX,
        y: textY,
        text,
        ...textStyle,
      },
    });
  }

  // 绘制子弹进度条

  renderProgressBar() {
    const { x, y, width, height, data } = this.meta;
    if (!data || !data.isProgress) {
      return;
    }
    const currentProgress = data.value;
    const expectedProgress = data.expectedValue;

    const currentProgressWidth = Math.min(
      PROGRESS_BAR.width * currentProgress,
      PROGRESS_BAR.width,
    );

    // 总进度条
    this.addShape('rect', {
      attrs: {
        x: x + width - PROGRESS_BAR.width - PADDING,
        y: y + (height - PROGRESS_BAR.height) / 2,
        width: PROGRESS_BAR.width,
        height: PROGRESS_BAR.height,
        fill: CONTAINER_COLOR,
      },
    });
    // 当前进度条
    this.addShape('rect', {
      attrs: {
        x: x + width - PROGRESS_BAR.width - PADDING,
        y: y + (height - PROGRESS_BAR.innerHeight) / 2,
        width: currentProgressWidth,
        height: PROGRESS_BAR.innerHeight,
        fill: getStatusColorByProgress(currentProgress, expectedProgress),
      },
    });
  }
}

setLang(['zh_CN', 'en_US'].find(lang => lang.includes(getLang()!)) as any);

const AntVS2Wrapper: FC<AndvS2Config> = memo(
  ({
    dataCfg,
    options,
    theme,
    palette,
    onCollapseRowsAll,
    onRowCellCollapseTreeRows,
    onSelected,
    getSpreadSheet,
    onDataCellClick,
    ...rest
  }) => {
    const { play, delay, pauseOnHover, direction, speed } = rest;

    const onDataCellHover = ({ event, viewMeta }) => {
      viewMeta.spreadsheet.tooltip.show({
        position: {
          x: event.clientX,
          y: event.clientY,
        },
        content: (
          <TableDataCellTooltip
            datas={viewMeta.data}
            meta={viewMeta.spreadsheet.dataCfg.meta}
          />
        ),
      });
    };

    const s2Ref = useRef(null);

    const directionMap = {
      up: () => {
        const s2 = s2Ref.current;
        // 获取当前 Y 轴滚动距离
        const { scrollY } = s2.facet.getScrollOffset();
        // 访问 https://s2.antv.antgroup.com/zh/docs/api 查看更多 API
        // 如果已经滚动到了底部，则回到顶部
        if (s2.facet.isScrollToBottom(scrollY)) {
          s2.updateScrollOffset({
            offsetY: {
              value: 0,
              animate: false,
            },
          });
          return;
        }
        s2.updateScrollOffset({
          offsetY: {
            value: scrollY + speed,
            animate: true,
          },
        });
      },
      down: () => {
        const s2 = s2Ref.current;
        // 获取当前 Y 轴滚动距离
        const { scrollY } = s2.facet.getScrollOffset();
        // 访问 https://s2.antv.antgroup.com/zh/docs/api 查看更多 API
        // 如果已经滚动到了底部，则回到顶部
        if (s2.facet.isScrollToTop(scrollY)) {
          s2.updateScrollOffset({
            offsetY: {
              value: s2.facet.panelBBox?.height,
              animate: false,
            },
          });
          return;
        }
        s2.updateScrollOffset({
          offsetY: {
            value: scrollY - speed,
            animate: true,
          },
        });
      },
      right: () => {
        const s2 = s2Ref.current;
        // 获取当前 Y 轴滚动距离
        const { scrollX } = s2.facet.getScrollOffset();
        // 访问 https://s2.antv.antgroup.com/zh/docs/api 查看更多 API
        // 如果已经滚动到了底部，则回到顶部
        if (scrollX <= 0 && s2.facet.hScrollBar?.thumbOffset <= 0) {
          s2.updateScrollOffset({
            offsetX: {
              value: s2.facet.getRealWidth(),
              animate: false,
            },
          });
          return;
        }
        s2.updateScrollOffset({
          offsetX: {
            value: scrollX - speed,
            animate: true,
          },
        });
      },
      left: () => {
        const s2 = s2Ref.current;
        // 获取当前 Y 轴滚动距离
        const { scrollX } = s2.facet.getScrollOffset();
        // 访问 https://s2.antv.antgroup.com/zh/docs/api 查看更多 API
        // 如果已经滚动到了底部，则回到顶部
        if (
          scrollX >= 0 &&
          Math.round(
            s2.facet.hScrollBar?.thumbOffset + s2.facet.hScrollBar?.thumbLen,
          ) >= s2.facet.panelBBox?.width
        ) {
          s2.updateScrollOffset({
            offsetX: {
              value: 0,
              animate: false,
            },
          });
          return;
        }
        s2.updateScrollOffset({
          offsetX: {
            value: scrollX + speed,
            animate: true,
          },
        });
      },
    };

    const [paused, setPaused] = useState(false);

    const clear = useRafInterval(
      () => {
        if (play) {
          directionMap?.[direction]?.();
        }
      },
      !paused ? delay : null,
    );

    if (!dataCfg) {
      return <div></div>;
    }

    return (
      <div
        onMouseOver={e => {
          pauseOnHover && setPaused(true);
        }}
        onMouseOut={e => {
          pauseOnHover && setPaused(false);
        }}
      >
        <StyledAntVS2Wrapper
          ref={s2Ref}
          sheetType="pivot"
          dataCfg={dataCfg}
          options={options}
          themeCfg={{ theme, palette }}
          onCollapseRowsAll={onCollapseRowsAll}
          onRowCellCollapseTreeRows={onRowCellCollapseTreeRows}
          onDataCellHover={onDataCellHover}
          onSelected={onSelected}
          onMounted={getSpreadSheet}
          onDestroy={stop}
          onDataCellClick={onDataCellClick}
        />
      </div>
    );
  },
);

const TableDataCellTooltip: FC<{
  datas?: object;
  meta?: Array<{ field: string; name: string; formatter }>;
}> = ({ datas, meta, ...rest }) => {
  if (!datas) {
    return null;
  }
  return (
    <StyledTableDataCellTooltip>
      {(meta || [])
        .map(m => {
          const uniqKey = m?.field;
          if (uniqKey in datas) {
            return (
              <li key={uniqKey}>{`${m?.name}: ${m?.formatter(
                datas[uniqKey],
              )}`}</li>
            );
          }
          return null;
        })
        .filter(Boolean)}
    </StyledTableDataCellTooltip>
  );
};

const StyledTableDataCellTooltip = styled.ul`
  padding: 4px;
  font-size: ${FONT_SIZE_LABEL};
  color: ${p => p.theme.textColorLight};
`;

const StyledAntVS2Wrapper = styled(SheetComponent)`
  background-color: ${p => p.theme.componentBackground};
`;

export default AntVS2Wrapper;
