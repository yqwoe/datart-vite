/**
 * Data Cube
 * Copyright  2023
 * 河南国立软件技术有限公司
 */
// organize-imports-ignore  polyfill/stable must in the first
// import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'core-js/features/string/replace-all';
import { migrateWidgets } from 'app/migration/BoardConfig/migrateWidgets';
import { ChartDataRequestBuilder } from 'app/models/ChartDataRequestBuilder';
import {
  DataChart,
  ServerDashboard,
} from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { getBoardChartRequests } from 'app/pages/DashBoardPage/utils';
import {
  getChartDataView,
  getDashBoardByResBoard,
  getDataChartsByServer,
} from 'app/pages/DashBoardPage/utils/board';
import { getWidgetMap } from 'app/pages/DashBoardPage/utils/widget';
import { ChartConfig } from 'app/types/ChartConfig';
import { ChartDetailConfigDTO } from 'app/types/ChartConfigDTO';
import { ChartDTO } from 'app/types/ChartDTO';
import { convertToChartDto } from 'app/utils/ChartDtoHelper';

// import 'core-js/stable/map';
// need polyfill [Object.values,Array.prototype.find,new Map]

/**
 * @param ''
 * @description 'server task 定时任务 调用'
 */
const getBoardQueryData = (dataStr: string) => {
  const data = JSON.parse(dataStr || '{}') as ServerDashboard;

  // const renderMode: VizRenderMode = 'schedule';
  const dashboard = getDashBoardByResBoard(data);
  const { datacharts, views: serverViews, widgets: serverWidgets } = data;

  const dataCharts: DataChart[] = getDataChartsByServer(
    datacharts,
    serverViews,
  );
  const migratedWidgets = migrateWidgets(serverWidgets, dashboard.config.type);
  const { widgetMap, wrappedDataCharts } = getWidgetMap(
    migratedWidgets, // TODO
    dataCharts,
    dashboard.config.type,
    serverViews,
  );

  const allDataCharts: DataChart[] = dataCharts.concat(wrappedDataCharts);
  const viewViews = getChartDataView(serverViews, allDataCharts);

  const viewMap = viewViews.reduce((obj, view) => {
    obj[view.id] = view;
    return obj;
  }, {});

  const dashboardDataChartMap = allDataCharts.reduce((obj, dataChart) => {
    obj[dataChart.id] = dataChart;
    return obj;
  }, {});
  const downloadParams = getBoardChartRequests({
    widgetMap,
    viewMap,
    dashboardDataChartMap,
  });
  const fileName = dashboard.name;
  return JSON.stringify({ downloadParams, fileName });
};

const getChartQueryData = (dataStr: string) => {
  // see  handleCreateDownloadDataTask
  const data: ChartDTO = JSON.parse(dataStr || '{}');

  const chartData = convertToChartDto(data);
  const dataConfig: ChartDetailConfigDTO = chartData.config;

  const chartConfig: ChartConfig = dataConfig.chartConfig as ChartConfig;
  const builder = new ChartDataRequestBuilder(
    {
      ...chartData.view,
      computedFields: chartData.config.computedFields,
    },
    chartConfig?.datas,
    chartConfig?.settings,
    {},
    false,
    dataConfig?.aggregation,
  );
  const downloadParams = [builder.build()];
  const fileName = data?.name || 'chart';
  return JSON.stringify({ downloadParams, fileName });
};
const getQueryData = (type: 'chart' | 'board', dataStr: string) => {
  if (type === 'board') {
    return getBoardQueryData(dataStr);
  } else {
    return getChartQueryData(dataStr);
  }
};
export default getQueryData;
