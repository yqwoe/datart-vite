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
import { ChartDataSectionType } from 'app/constants';
import { ChartConfig } from 'app/types/ChartConfig';
import ChartDataSetDTO, { IChartDataSet } from 'app/types/ChartDataSet';
import { BrokerContext, BrokerOption } from 'app/types/ChartLifecycleBroker';
import { init } from 'echarts';
import {
  flattenArray,
  getColumnRenderName,
  getReference2,
  getSeriesTooltips4Polar2,
  getStyles,
  getStyleValueByGroup,
  getValueByColumnKey,
  maxNumber,
  toFormattedValue,
  transformToDataSet,
} from 'app/utils/chartHelper';
import Chart from '../../../models/Chart';
import Config from './config';

class BasicRadarChart extends Chart {
  config = Config;
  chart: any = null;

  constructor(props?) {
    super(
      props?.id || 'radar',
      props?.name || 'viz.palette.graph.names.radarChart',
      props?.icon || 'radarchart',
    );
    this.meta.requirements = props?.requirements || [
      {
        group: 1,
        aggregate: [1, 999],
      },
    ];
  }

  onMount(options: BrokerOption, context: BrokerContext) {
    if (options.containerId === undefined || !context.document) {
      return;
    }

    this.chart = init(
      context.document.getElementById(options.containerId)!,
      'default',
    );
    this.mouseEvents?.forEach(event => {
      this.chart.on(event.name, event.callback);
    });
  }

  onUpdated(options: BrokerOption, context: BrokerContext) {
    if (!options.dataset || !options.dataset.columns || !options.config) {
      return;
    }
    if (!this.isMatchRequirement(options.config)) {
      this.chart?.clear();
      return;
    }
    const newOptions = this.getOptions(options.dataset, options.config);
    this.chart?.setOption(Object.assign({}, newOptions), true);
  }

  onUnMount(options: BrokerOption, context: BrokerContext) {
    this.chart?.dispose();
  }

  onResize(options: BrokerOption, context: BrokerContext) {
    this.chart?.resize(context);
  }

  getOptions(dataset: ChartDataSetDTO, config: ChartConfig) {
    const styleConfigs = config.styles;
    const dataConfigs = config.datas || [];
    const settingConfigs = config.settings;
    const groupConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.Group)
      .flatMap(config => config.rows || []);
    const aggregateConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.Aggregate)
      .flatMap(config => config.rows || []);
    const colorConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.Color)
      .flatMap(config => config.rows || []);
    const sizeConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.Size)
      .flatMap(config => config.rows || []);
    const infoConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.Info)
      .flatMap(config => config.rows || []);

    const dataColumns = transformToDataSet(
      dataset.rows,
      dataset.columns,
      dataConfigs,
    );
    const series = this.getSeries(
      settingConfigs,
      styleConfigs,
      colorConfigs,
      dataColumns,
      groupConfigs,
      aggregateConfigs,
      infoConfigs,
    );
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: this.getTooltipFormmaterFunc(
          styleConfigs,
          groupConfigs,
          aggregateConfigs,
          colorConfigs,
          infoConfigs,
          dataColumns,
        ),
      },
      legend: this.getLegendStyle(styleConfigs, series),
      // visualMap: {
      //   top: 'middle',
      //   right: 10,
      //   color: ['red', 'yellow'],
      //   calculable: true,
      // },
      radar: {
        // shape: 'circle',
        name: {
          textStyle: {
            color: '#fff',
            backgroundColor: '#999',
            borderRadius: 3,
            padding: [3, 5],
          },
        },
        splitNumber: 4,
        indicator: this.getIndicators(
          groupConfigs,
          aggregateConfigs,
          dataColumns,
        ),
      },
      series: series,
    };

    return option;
  }

  getIndicators(groupCongigs, aggregateConfigs, dataColumns) {
    return dataColumns.map(data => {
      return {
        name: data?.getCell?.(groupCongigs[0]),
      };
    });
  }

  getMax(dataColumns, aggregateConfigs) {
    const values = aggregateConfigs.map(aggConfig => {
      return dataColumns.map(dc => {
        return dc[getValueByColumnKey(aggConfig)];
      });
    });
    return maxNumber(flattenArray(values));
  }

  getSeriesData(aggregateConfigs, dataColumns, styleConfigs) {
    return aggregateConfigs.map(aggConfig => {
      return {
        name: getColumnRenderName(aggConfig),
        value: dataColumns.map(dc => dc?.getCell?.(aggConfig)),
        areaStyle: {
          color: aggConfig?.color?.start || '#8696A7',
        },
        symbolSize: 2,
        ...this.getLabelStyle(styleConfigs),
      };
    });
  }
  private getTooltipFormmaterFunc(
    styleConfigs,
    groupConfigs,
    aggregateConfigs,
    colorConfigs,
    infoConfigs,
    chartDataSet: IChartDataSet<string>,
  ) {
    return seriesParams => {
      return getSeriesTooltips4Polar2(
        chartDataSet,
        seriesParams[0],
        groupConfigs,
        colorConfigs,
        aggregateConfigs,
        infoConfigs,
      );
    };
  }

  getLegendStyle(styles, series) {
    const seriesNames = (series[0]?.data || []).map((col: any) => col?.name);
    const show = getStyleValueByGroup(styles, 'legend', 'showLegend');
    const type = getStyleValueByGroup(styles, 'legend', 'type');
    const font = getStyleValueByGroup(styles, 'legend', 'font');
    const legendPos = getStyleValueByGroup(styles, 'legend', 'position');
    const selectAll = getStyleValueByGroup(styles, 'legend', 'selectAll');
    let positions = {};
    let orient = {};

    switch (legendPos) {
      case 'top':
        orient = 'horizontal';
        positions = { top: 8, left: 8, right: 8, height: 32 };
        break;
      case 'bottom':
        orient = 'horizontal';
        positions = { bottom: 8, left: 8, right: 8, height: 32 };
        break;
      case 'left':
        orient = 'vertical';
        positions = { left: 8, top: 16, bottom: 24, width: 96 };
        break;
      default:
        orient = 'vertical';
        positions = { right: 8, top: 16, bottom: 24, width: 96 };
        break;
    }
    const selected = seriesNames.reduce(
      (obj, name) => ({
        ...obj,
        [name]: selectAll,
      }),
      {},
    );

    return {
      ...positions,
      show,
      type,
      orient,
      selected,
      data: seriesNames,
      textStyle: font,
    };
  }

  private getSeries(
    settingConfigs,
    styleConfigs,
    colorConfigs,
    dataColumns,
    groupConfigs,
    aggregateConfigs,
    infoConfigs,
  ) {
    return [
      {
        type: 'radar',
        emphasis: {
          lineStyle: {
            width: 4,
          },
          areaStyle: {
            color: 'rgba(0,250,0,0.3)',
          },
        },
        data: this.getSeriesData(aggregateConfigs, dataColumns, styleConfigs),
      },
    ];
  }

  private getBarSeiesImpl(
    styleConfigs,
    settingConfigs,
    dataColumns,
    dataConfig,
  ) {
    return {
      ...this.getLabelStyle(styleConfigs),
      ...this.getSeriesStyle(styleConfigs),
      ...getReference2(settingConfigs, dataColumns, dataConfig, false),
    };
  }

  private getSerieItemStyle(styles, itemStyle?) {
    const [borderType, borderWidth, borderColor] = getStyles(
      styles,
      ['borderStyle'],
      ['type', 'width', 'color'],
    );

    const [borderRadius] = getStyles(styles, ['bar'], ['radius']);

    return {
      ...itemStyle,
      borderRadius,
      borderType,
      borderWidth,
      borderColor,
    };
  }

  getLabelStyle(styles) {
    const show = getStyleValueByGroup(styles, 'label', 'showLabel');
    const position = getStyleValueByGroup(styles, 'label', 'position');
    const font = getStyleValueByGroup(styles, 'label', 'font');
    return {
      label: {
        show,
        position,
        ...font,
        formatter: params => {
          const { value, data } = params;
          const formattedValue = toFormattedValue(value, data.format);
          const labels: string[] = [];
          labels.push(formattedValue);
          return labels.join('\n');
        },
      },
    };
  }

  getSeriesStyle(styles) {
    const [smooth, step] = getStyles(styles, ['graph'], ['smooth', 'step']);
    return { smooth, step };
  }
}

export default BasicRadarChart;
