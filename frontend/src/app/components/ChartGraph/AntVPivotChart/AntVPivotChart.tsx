import {
  getAxisLabel,
  getAxisLine,
  getAxisTick,
  getColumnRenderName,
  getNameTextStyle,
  getSplitLine,
  getStyles,
  transformToDataSet,
} from 'app/utils/chartHelper';
import Chart from '../../../models/Chart';
import Config from './config';

class AntVPivotChart extends Chart {
  config = Config;
  chart: any = null;
  dependency = [
    'https://unpkg.com/@antv/s2@1.50.0/dist/index.min.js',
    'https://unpkg.com/@antv/s2@1.50.0/dist/style.min.css',
  ];

  constructor(props?) {
    super(
      props?.id || 'antv-pivot-chart',
      props?.name || '透视表',
      props?.icon || 'pivot-table',
    );
    this.meta.requirements = props?.requirements || [
      { group: [0, 999], aggregate: [0, 999] },
    ];
  }

  onMount(options, context) {
    if ('PivotSheet' in context.window.S2) {
      const newOptions = this.getOptions(options.dataset, options.config);
      const newDataCfg = this.getDataConfig(options.dataset, options.config);
      this.chart = new context.window.S2.PivotSheet(
        context.document.getElementById(options.containerId),
        newDataCfg,
        {
          ...newOptions,
          width: context.window.innerWidth,
          height: context.window.innerHeight,
        },
      );
    }
  }

  onUpdated(props) {
    if (!props.dataset || !props.dataset.columns || !props.config) {
      return;
    }
    if (!this.isMatchRequirement(props.config)) {
      this.chart?.render(true);
      return;
    }
    const newOptions = this.getOptions(props.dataset, props.config);
    const newDataCfg = this.getDataConfig(props.dataset, props.config);
    this.chart && this.chart.setDataCfg(newDataCfg);
    this.chart && this.chart.setOptions(newOptions);
    this.chart && this.chart?.render(true);
  }

  onUnMount() {
    this.chart && this.chart?.destroy();
  }

  onResize(opt, context) {
    if (!this.chart) {
      return;
    }
    this.chart?.changeSize(context.width, context.height);
    this.chart?.render(false);
  }

  getDataConfig(dataset, config) {
    const styleConfigs = config.styles;
    const dataConfigs = config.datas || [];
    const groupConfigs = dataConfigs
      .filter(c => c.type === 'group')
      .flatMap(config => config.rows || []);
    const aggregateConfigs = dataConfigs
      .filter(c => c.type === 'aggregate')
      .flatMap(config => config.rows || []);

    const objDataColumns = transformToDataSet(
      dataset.rows,
      dataset.columns,
      dataConfigs,
    );

    return {
      fields: {
        ...this.getFieldsStyle(styleConfigs),
        valueInCols: true,
      },
      meta: this.getMeta(groupConfigs, aggregateConfigs),
      data: objDataColumns,
    };
  }

  getOptions(dataset, config) {
    const styleConfigs = config.styles;
    const dataConfigs = config.datas || [];
    const groupConfigs = dataConfigs
      .filter(c => c.type === 'group')
      .flatMap(config => config.rows || []);
    const aggregateConfigs = dataConfigs
      .filter(c => c.type === 'aggregate')
      .flatMap(config => config.rows || []);

    const objDataColumns = transformToDataSet(
      dataset.rows,
      dataset.columns,
      dataConfigs,
    );

    const [theme, headerAction, hierarchyType] = getStyles(
      styleConfigs,
      ['style'],
      ['theme', 'headerAction', 'hierarchyType'],
    );
    this.chart?.setThemeCfg({ name: theme });

    return {
      showDefaultHeaderActionIcon: headerAction,
      hierarchyType: hierarchyType,
      tooltip: {
        showTooltip: true,
        operation: {
          hiddenColumns: true,
          sort: headerAction,
          tableSort: headerAction,
          trend: headerAction,
        },
        renderTooltip: args => {
          console.log(args);
        },
        ...this.getTooltipStyle(styleConfigs),
      },
      // interaction: {
      //   selectedCellsSpotlight: true,
      //   hoverHighlight: false,
      // },
    };
  }

  getGrid(styles) {
    const [containLabel, left, right, bottom, top] = getStyles(
      styles,
      ['margin'],
      [
        'containLabel',
        'marginLeft',
        'marginRight',
        'marginBottom',
        'marginTop',
      ],
    );
    return { left, right, bottom, top, containLabel };
  }

  // getTooltip() {}

  getYAxis(styles, yAxisColumns) {
    const [
      showAxis,
      inverse,
      lineStyle,
      showLabel,
      font,
      unitFont,
      showTitleAndUnit,
      nameLocation,
      nameGap,
      nameRotate,
      min,
      max,
    ] = getStyles(
      styles,
      ['yAxis'],
      [
        'showAxis',
        'inverseAxis',
        'lineStyle',
        'showLabel',
        'font',
        'unitFont',
        'showTitleAndUnit',
        'nameLocation',
        'nameGap',
        'nameRotate',
        'min',
        'max',
      ],
    );

    const name = showTitleAndUnit
      ? yAxisColumns.map(c => c.name).join(' / ')
      : null;

    const [showHorizonLine, horizonLineStyle] = getStyles(
      styles,
      ['splitLine'],
      ['showHorizonLine', 'horizonLineStyle'],
    );

    return {
      type: 'value',
      name,
      nameLocation,
      nameGap,
      nameRotate,
      inverse,
      min,
      max,
      axisLabel: getAxisLabel(showLabel, font),
      axisLine: getAxisLine(showAxis, lineStyle),
      axisTick: getAxisTick(showLabel, lineStyle),
      nameTextStyle: getNameTextStyle(
        unitFont?.fontFamily,
        unitFont?.fontSize,
        unitFont?.color,
      ),
      splitLine: getSplitLine(showHorizonLine, horizonLineStyle),
    };
  }

  getXAxis(styles, xAxisColumns) {
    const axisColumnInfo = xAxisColumns[0];

    const [
      showAxis,
      inverse,
      lineStyle,
      showLabel,
      font,
      rotate,
      showInterval,
      interval,
    ] = getStyles(
      styles,
      ['xAxis'],
      [
        'showAxis',
        'inverseAxis',
        'lineStyle',
        'showLabel',
        'font',
        'rotate',
        'showInterval',
        'interval',
      ],
    );

    const [showVerticalLine, verticalLineStyle] = getStyles(
      styles,
      ['splitLine'],
      ['showVerticalLine', 'verticalLineStyle'],
    );

    return {
      ...axisColumnInfo,
      inverse,
      axisLabel: getAxisLabel(
        showLabel,
        font,
        showInterval ? interval : null,
        rotate,
      ),
      axisLine: getAxisLine(showAxis, lineStyle),
      axisTick: getAxisTick(showLabel, lineStyle),
      splitLine: getSplitLine(showVerticalLine, verticalLineStyle),
    };
  }

  getLegendStyle(styles, seriesNames) {
    const [show, type, font, legendPos, selectAll] = getStyles(
      styles,
      ['legend'],
      ['showLegend', 'type', 'font', 'position', 'selectAll'],
    );

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

  getFieldsStyle(styles) {
    const [rows, columns, values] = getStyles(
      styles,
      ['config'],
      ['rows', 'columns', 'values'],
    );

    return { rows, columns, values };
  }

  getTooltipStyle(styles) {
    const [row, col, data] = getStyles(
      styles,
      ['config'],
      ['rows', 'columns', 'values'],
    );
    return { row, col, data };
  }

  getMeta(group, aggs) {
    return [
      ...group.map(g => ({ field: g.colName, name: getColumnRenderName(g) })),
      ...aggs.map(g => ({
        field: this.getAggregateName(g),
        name: getColumnRenderName(g),
      })),
    ];
  }

  getAggregateName(agg) {
    return agg.aggregate ? `${agg.aggregate}(${agg.colName})` : agg.colName;
  }

  getLabelStyle(styles) {
    const [show, position, font] = getStyles(
      styles,
      ['label'],
      ['showLabel', 'position', 'font'],
    );

    return { label: { show, position, ...font } };
  }
}

export default AntVPivotChart;
