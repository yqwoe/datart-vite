import Chart from 'app/models/Chart';
import { ChartSelectionManager } from 'app/models/ChartSelectionManager';
import { getStyles, transformToDataSet } from 'app/utils/chartHelper';
import { init } from 'echarts';
import Config from './config';

class AreaLineChart extends Chart {
  config = Config;
  chart: any = null;
  timeId: any = null;
  selectionManager?: ChartSelectionManager;

  constructor(props?) {
    super(
      props?.id || 'area-line-chart',
      props?.name || '折线区域图',
      props?.icon || 'chartpie',
    );
    this.meta.requirements = props?.requirements || [
      { group: 1, aggregate: 2 },
    ];
  }

  onMount(options, context) {
    if (
      options.containerId === undefined ||
      !context.document ||
      !context.window
    ) {
      return;
    }
    this.chart = init(
      context.document.getElementById(options.containerId),
      'default',
      { renderer: 'svg' },
    );

    this.selectionManager = new ChartSelectionManager(this.mouseEvents);
    this.selectionManager.attachWindowListeners(context.window);

    if (this.timeId) {
      clearInterval(this.timeId);
    }
  }

  onUpdated(props) {
    const styleConfigs = props.config.styles;
    const [enableDataZoom] = getStyles(styleConfigs, ['dataZoom'], ['enable']);

    if (!props.dataset || !props.dataset.columns || !props.config) {
      return;
    }
    if (!this.isMatchRequirement(props.config)) {
      this.chart?.clear();
      return;
    }

    if (enableDataZoom) {
      if (this.timeId || !enableDataZoom) {
        // 如果timeId已经存在，说明当前已有正在轮播的图表。把正在轮播的图表清除
        clearInterval(this.timeId);
      }
      const newOptions: any = this.getOptions(props.dataset, props.config);
      const timeId = setInterval(() => {
        // 设置轮播，轮播速度为1200毫秒
        if (newOptions?.dataZoom?.end >= 100) {
          clearInterval(this.timeId);
        } else {
          newOptions!.dataZoom!.end += 5;
        }
        this.chart?.setOption(Object.assign({}, newOptions), true);
      }, 1200);
      this.timeId = timeId;
    } else {
      if (this.timeId) {
        clearInterval(this.timeId);
      }
      const newOptions = this.getOptions(props.dataset, props.config);
      newOptions!.dataZoom!.disabled = true;
      this.chart?.setOption(Object.assign({}, newOptions), true);
    }
  }

  onUnMount() {
    if (this.timeId) {
      clearInterval(this.timeId);
    }
    this.chart && this.chart.dispose();
  }

  onResize(opt, context) {
    this.chart && this.chart.resize(context);
  }

  getOptions(dataset, config) {
    const styleConfigs = config.styles;
    const dataConfigs = config.datas || [];
    const objDataColumns = transformToDataSet(dataset.rows, dataset.columns);
    const dimensionTitle = dataConfigs[0].rows[0].colName;
    const metricsTitleList: Array<string> = [];
    dataConfigs[1].rows.forEach(row => {
      metricsTitleList.push(row.aggregate + '(' + row.colName + ')');
    });

    const dimensionList: any[] = [];
    const lineMetricsList: any[] = [];
    const areaMetricsList: any[] = [];
    objDataColumns.forEach(record => {
      dimensionList.push(record[dimensionTitle]);
      lineMetricsList.push(record[metricsTitleList[0]]);
      areaMetricsList.push(record[metricsTitleList[1]]);
    });

    const [lineColor, lineSmooth] = getStyles(
      styleConfigs,
      ['lineGraph'],
      ['color', 'smooth'],
    );
    const [areaColor, areaSmooth] = getStyles(
      styleConfigs,
      ['areaGraph'],
      ['color', 'smooth'],
    );
    const [enableDataZoom] = getStyles(styleConfigs, ['dataZoom'], ['enable']);
    const dataZoom = enableDataZoom
      ? {
          disabled: false,
          show: false,
          yAxisIndex: [0],
          xAxisIndex: [0],
          start: 0,
          end: 10,
        }
      : {
          disabled: true,
          show: false,
        };

    const options = {
      dataZoom: dataZoom,
      tooltip: {
        trigger: 'none',
        axisPointer: {
          type: 'cross',
        },
      },
      legend: {},
      xAxis: this.getXAxis(styleConfigs, dimensionList),
      yAxis: this.getYAxis(styleConfigs),
      series: [
        {
          name: metricsTitleList[0],
          type: 'line',
          data: lineMetricsList,
          itemStyle: {
            color: lineColor.color,
          },
          smooth: lineSmooth,
        },
        {
          name: metricsTitleList[1],
          type: 'line',
          data: areaMetricsList,
          itemStyle: {
            color: areaColor.color,
          },
          areaStyle: {
            color: areaColor.color,
          },
          smooth: areaSmooth,
        },
      ],
    };
    return options;
  }

  getXAxis(styles, data) {
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
      type: 'category',
      data: data,
      inverse,
      axisLabel: {
        show: showLabel,
        rotate,
        interval: showInterval ? interval : 'auto',
        ...font,
      },
      axisLine: {
        show: showAxis,
        lineStyle,
      },
      axisTick: {
        show: showLabel,
        lineStyle,
      },
      splitLine: {
        show: showVerticalLine,
        lineStyle: verticalLineStyle,
      },
    };
  }

  getYAxis(styles) {
    const [showAxis, inverse, lineStyle, showLabel, font, min, max] = getStyles(
      styles,
      ['yAxis'],
      [
        'showAxis',
        'inverseAxis',
        'lineStyle',
        'showLabel',
        'font',
        'min',
        'max',
      ],
    );
    const [showHorizonLine, horizonLineStyle] = getStyles(
      styles,
      ['splitLine'],
      ['showHorizonLine', 'horizonLineStyle'],
    );

    return {
      type: 'value',
      inverse,
      min,
      max,
      axisLabel: {
        show: showLabel,
        ...font,
      },
      axisLine: {
        show: showAxis,
        lineStyle,
      },
      axisTick: {
        show: showLabel,
        lineStyle,
      },
      splitLine: {
        show: showHorizonLine,
        lineStyle: horizonLineStyle,
      },
    };
  }
}

export default AreaLineChart;
