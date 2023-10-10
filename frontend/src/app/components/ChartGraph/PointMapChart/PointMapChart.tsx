import geoChina from 'app/assets/geojson/china.json';
import {
  ChartDataSectionType,
  ChartDataViewFieldCategory,
  ChartDataViewSubType,
} from 'app/constants';
import Chart from 'app/models/Chart';
import {
  getSeriesTooltips4Polar2,
  getStyles,
  getValueByColumnKey,
  toFormattedValue,
  transformToDataSet,
} from 'app/utils/chartHelper';
import Config from './config';

class PointMapChart extends Chart {
  dependency = [
    'https://webapi.amap.com/maps?v=2.0&key=71e61689c0c1566be9a315704f5d7016&plugin=AMap.Scale,AMap.ToolBar',
    'https://unpkg.com/echarts@5.4.3/dist/echarts.min.js',
    'https://unpkg.com/echarts-extension-amap@1.11.0/dist/echarts-extension-amap.min.js',
  ];
  config = Config;
  chart: any = null;
  geoMap: any = null;

  constructor(props?) {
    super(
      props?.id || 'point-map-chart',
      props?.name || 'viz.palette.graph.names.pointMap',
      props?.icon || 'point-map',
    );
    this.meta.requirements = props?.requirements || [
      {
        latitude: 1,
        longitude: 1,
        group: [0, 999],
        aggregate: [1, 999],
      },
    ];
  }
  onMount(options, context) {
    if (options.containerId === undefined || !context.document) {
      return;
    }

    this.chart = context.window.echarts.init(
      context.document.getElementById(options.containerId),
      'default',
    );
    this.mouseEvents?.forEach(event => {
      this.chart.on(event.name, event.callback);
    });
  }

  onUpdated(props, context) {
    if (!props.dataset || !props.dataset.columns || !props.config) {
      return;
    }
    if (!this.isMatchRequirement(props.config)) {
      this.chart?.clear();
      return;
    }

    // Node: especially clear before map dispose
    this.chart?.clear();
    const newOptions = this.getOptions(props.dataset, props.config);
    this.chart?.setOption(Object.assign({}, newOptions), true);
    // Node: should add amap controls after setOption
    this.loadMapTools(context);
  }

  onUnMount() {
    this.chart?.dispose();
  }

  onResize(opt, context) {
    this.chart?.resize(context);
  }

  getOptions(dataset, config) {
    const styleConfigs = config.styles;
    const dataConfigs = config.datas || [];
    const latitudeConfigs = dataConfigs
      .filter(c => c.type === 'group')
      .filter(c => c.key === 'latitude')
      .flatMap(config => config.rows || []);
    const longitudeConfigs = dataConfigs
      .filter(c => c.type === 'group')
      .filter(c => c.key === 'longitude')
      .flatMap(config => config.rows || []);
    const groupConfigs = dataConfigs
      .filter(c => c.type === 'group')
      .filter(c => c.key === 'dimension')
      .flatMap(config => config.rows || []);
    const aggregateConfigs = dataConfigs
      .filter(c => c.type === 'aggregate')
      .flatMap(config => config.rows || []);
    const sizeConfigs = dataConfigs
      .filter(c => c.type === 'size')
      .flatMap(config => config.rows || []);
    const colorConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.Color)
      .flatMap(config => config.rows || []);
    const infoConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.Info)
      .flatMap(config => config.rows || []);

    const objDataColumns = transformToDataSet(
      dataset.rows,
      dataset.columns,
      dataConfigs,
    );

    this.registerGeoMap(styleConfigs);

    const [theme, zoom] = getStyles(styleConfigs, ['map'], ['theme', 'zoom']);

    return {
      amap: {
        viewMode: '3D',
        center: this.loadMapCenter(styleConfigs),
        zoom: zoom,
        resizeEnable: true,
        mapStyle: `amap://styles/${theme}`,
        renderOnMoving: true,
        echartsLayerInteractive: true,
        largeMode: false,
      },
      tooltip: {
        trigger: 'item',
        formatter: this.getTooltipFormatterFunc(
          objDataColumns,
          groupConfigs,
          aggregateConfigs,
          colorConfigs,
          infoConfigs,
        ),
      },
      animation: false,
      visualMap: this.getVisualMap(
        objDataColumns,
        groupConfigs,
        aggregateConfigs,
        sizeConfigs,
        styleConfigs,
      ),
      series: this.getMetricAndSizeSeries(
        objDataColumns,
        groupConfigs,
        aggregateConfigs,
        sizeConfigs,
        styleConfigs,
        latitudeConfigs,
        longitudeConfigs,
      ),
    };
  }

  loadMapCenter(styleConfigs) {
    const [center] = getStyles(styleConfigs, ['map'], ['center']);
    const centerArray = center.split(',').map(a => Number(a));
    return centerArray ? centerArray : [108.39, 39.9];
  }

  loadMapTools(context) {
    const amapComponent = this.chart.getModel().getComponent('amap');
    const amap = amapComponent.getAMap();
    amap.addControl(new context.window.AMap.Scale());
    amap.addControl(new context.window.AMap.ToolBar());
  }

  getMetricAndSizeSeries(
    objDataColumns,
    groupConfigs,
    aggregateConfigs,
    sizeConfigs,
    styleConfigs,
    latitudeConfigs,
    longitudeConfigs,
  ) {
    const [showLabel, font, position] = getStyles(
      styleConfigs,
      ['label'],
      ['showLabel', 'font', 'position'],
    );
    const [cycleRatio, cycleType, cycleColor] = getStyles(
      styleConfigs,
      ['map'],
      ['cycleRatio', 'cycleType', 'cycleColor'],
    );
    const { min, max } = this.getDataColumnMaxAndMin(
      objDataColumns,
      sizeConfigs[0],
    );
    const scaleRatio = cycleRatio || 1;
    const defaultScatterPointPixelSize = 10;
    const defaultSizeValue = max - min;
    const defaultColorValue = 1;
    const colorizeGroupedSeries = aggregateConfigs.flatMap(aggConfig => {
      return [
        {
          type: cycleType,
          zlevel: 1,
          coordinateSystem: 'amap',
          symbol: 'circle',
          data: objDataColumns.map(row => {
            return {
              rowData: row?.convertToObject(),
              name: row.getCell(groupConfigs[0]),
              value: [
                Number(row.getCell(longitudeConfigs?.[0])),
                Number(row.getCell(latitudeConfigs?.[0])),
                ...aggregateConfigs.map(agg => row.getCell(agg)),
                ...groupConfigs.map(agg => row.getCell(agg)),
              ],
            };
          }),
          symbolSize: function (val) {
            return aggregateConfigs.length === 0
              ? (val[2] / (max - min)) *
                  scaleRatio *
                  defaultScatterPointPixelSize
              : scaleRatio;
          },
          label: {
            formatter: '{b}',
            position,
            show: showLabel,
            ...font,
          },
          showEffectOn: 'render',
          rippleEffect: {
            brushType: 'stroke',
          },
          itemStyle: {
            shadowBlur: 10,
            shadowColor: cycleColor,
            normal: {
              color: cycleColor, //标志颜色
            },
          },
          emphasis: {
            label: {
              show: showLabel,
              ...font,
            },
          },
        },
      ];
    });
    return colorizeGroupedSeries;
  }

  getValueName(row, groupConfigs) {
    return groupConfigs
      .filter(
        group =>
          ![ChartDataViewSubType.Lng, ChartDataViewSubType.Lat].includes(
            group.category,
          ),
      )
      .map(group => row[getValueByColumnKey(group)])
      .join('\n');
  }

  getStringPostionToNumbers(row, groupConfigs) {
    return [ChartDataViewFieldCategory.Lng, ChartDataViewFieldCategory.Lat].map(
      str => {
        const group = groupConfigs.find(s => s.category === str);
        return group?.format
          ? toFormattedValue(row[getValueByColumnKey(group)], group?.format)
          : row[getValueByColumnKey(group)];
      },
    );
  }

  getVisualMap(
    objDataColumns,
    groupConfigs,
    aggregateConfigs,
    sizeConfigs,
    styleConfigs,
  ) {
    const [show, orient, align, itemWidth, itemHeight, font] = getStyles(
      styleConfigs,
      ['visualMap'],
      ['show', 'orient', 'align', 'itemWidth', 'itemHeight', 'font'],
    );

    if (!show) {
      return [];
    }

    const { min, max } = this.getDataColumnMaxAndMin(
      objDataColumns,
      aggregateConfigs?.[0],
    );

    const inRange = {
      color: [
        aggregateConfigs?.[0]?.color?.start || '#121122',
        aggregateConfigs?.[0]?.color?.end || 'rgba(3,4,5,0.4)',
      ],
    };

    return [
      {
        type: 'continuous',
        seriesIndex: 0,
        dimension: 3,
        show,
        orient,
        align,
        itemWidth,
        itemHeight,
        inRange,
        text: [max, min],
        min,
        max,
        ...font,
      },
    ];
  }

  getDataColumnMaxAndMin(objDataColumns, config) {
    const datas = objDataColumns.map(row => row.getCell(config));
    datas.sort((a, b) => a - b);
    const min = Number.isNaN(datas[0]) ? 0 : datas[0];
    const max = Number.isNaN(datas[datas.length - 1])
      ? 100
      : datas[datas.length - 1];
    return { min, max };
  }

  mappingGeoName(sourceName) {
    const targetName = this.geoMap?.features?.find(f =>
      f.properties.name.includes(sourceName),
    )?.properties.name;
    return targetName;
  }

  mappingGeoCoordination(sourceName, ...values) {
    const properties = this.geoMap?.features?.find(f =>
      f.properties.name.includes(sourceName),
    )?.properties;

    return (properties?.cp || properties?.center)?.concat(values) || [];
  }

  registerGeoMap(styleConfigs) {
    const [mapLevelName] = getStyles(styleConfigs, ['map'], ['level']);
    this.geoMap = geoChina;
  }

  private getTooltipFormatterFunc(
    chartDataSet,
    groupConfigs,
    aggregateConfigs,
    colorConfigs,
    infoConfigs,
  ) {
    return seriesParams => {
      const params = Array.isArray(seriesParams)
        ? seriesParams
        : [seriesParams];
      return getSeriesTooltips4Polar2(
        chartDataSet,
        params[0],
        groupConfigs,
        colorConfigs,
        aggregateConfigs,
        infoConfigs,
      );
    };
  }
}

export default PointMapChart;
