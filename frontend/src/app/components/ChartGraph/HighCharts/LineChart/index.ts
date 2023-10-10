import { ChartDataSectionType } from 'app/constants';
import { ChartDrillOption } from 'app/models/ChartDrillOption';
import ReactChart from 'app/models/ReactChart';
import {
  ChartConfig,
  ChartDataConfig,
  ChartDataSectionField,
  ChartStyleConfig,
} from 'app/types/ChartConfig';
import ChartDataSetDTO from 'app/types/ChartDataSet';
import {
  getColumnRenderName,
  getDrillableRows,
  toFormattedValue,
  transformToDataSet,
} from 'app/utils/chartHelper';
import BasicHighChartsWrapper from '../BasicHighChartsWrapper';
import Config from './config';

class HighChartsLineChart extends ReactChart {
  useIFrame = false;
  isISOContainer = 'high-charts-line-chart';
  config = Config;
  chart: any = null;
  updateOptions: any = {};

  constructor(props?) {
    super(BasicHighChartsWrapper, {
      id: props?.id || 'high-charts-line-chart',
      name: props?.name || 'chartName',
      icon: '<svg t="1651731341892" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2491" width="200" height="200"><path d="M954.181818 977.454545h-837.818182q-28.904727 0-49.338181-20.48Q46.545455 936.587636 46.545455 907.636364v-837.818182h46.545454v837.818182q0 9.634909 6.795636 16.477091 6.842182 6.795636 16.477091 6.795636h837.818182v46.545454z m23.272727-23.272727q0 2.327273-0.465454 4.561455t-1.303273 4.328727q-0.884364 2.141091-2.141091 4.049455-1.303273 1.861818-2.885818 3.537454-1.629091 1.582545-3.537454 2.885818-1.908364 1.256727-4.049455 2.141091-2.094545 0.884364-4.328727 1.303273-2.280727 0.465455-4.561455 0.465454-2.327273 0-4.561454-0.465454t-4.328728-1.303273q-2.141091-0.884364-4.049454-2.141091-1.861818-1.303273-3.537455-2.885818-1.582545-1.629091-2.885818-3.537454-1.256727-1.908364-2.141091-4.049455-0.884364-2.094545-1.303273-4.328727-0.465455-2.280727-0.465454-4.561455 0-2.327273 0.465454-4.561454t1.303273-4.328728q0.884364-2.141091 2.141091-4.049454 1.303273-1.861818 2.885818-3.537455 1.629091-1.582545 3.537455-2.885818 1.908364-1.256727 4.049454-2.141091 2.094545-0.884364 4.328728-1.303273 2.280727-0.465455 4.561454-0.465454 2.327273 0 4.561455 0.465454t4.328727 1.303273q2.141091 0.884364 4.049455 2.141091 1.861818 1.303273 3.537454 2.885818 1.582545 1.629091 2.885818 3.537455 1.256727 1.908364 2.141091 4.049454 0.884364 2.094545 1.303273 4.328728 0.465455 2.280727 0.465454 4.561454zM93.090909 69.818182q0 2.327273-0.465454 4.561454t-1.303273 4.328728q-0.884364 2.141091-2.141091 4.049454-1.303273 1.861818-2.885818 3.537455-1.629091 1.582545-3.537455 2.885818-1.908364 1.256727-4.049454 2.141091-2.094545 0.884364-4.328728 1.303273Q72.098909 93.090909 69.818182 93.090909q-2.327273 0-4.561455-0.465454t-4.328727-1.303273q-2.141091-0.884364-4.049455-2.141091-1.861818-1.303273-3.537454-2.885818-1.582545-1.629091-2.885818-3.537455-1.256727-1.908364-2.141091-4.049454-0.884364-2.094545-1.303273-4.328728Q46.545455 72.098909 46.545455 69.818182q0-2.327273 0.465454-4.561455t1.303273-4.328727q0.884364-2.141091 2.141091-4.049455 1.303273-1.861818 2.885818-3.537454 1.629091-1.582545 3.537454-2.885818 1.908364-1.256727 4.049455-2.141091 2.094545-0.884364 4.328727-1.303273Q67.537455 46.545455 69.818182 46.545455q2.327273 0 4.561454 0.465454t4.328728 1.303273q2.141091 0.884364 4.049454 2.141091 1.861818 1.303273 3.537455 2.885818 1.582545 1.629091 2.885818 3.537454 1.256727 1.908364 2.141091 4.049455 0.884364 2.094545 1.303273 4.328727 0.465455 2.280727 0.465454 4.561455z" fill="#000000" p-id="2492"></path><path d="M948.317091 248.180364l-220.485818 248.040727q-34.722909 39.051636-86.946909 39.051636h-213.178182q-32.209455 0-53.061818 24.482909L203.869091 759.854545l-35.374546-30.254545 170.682182-200.052364q34.862545-40.820364 88.529455-40.820363h213.178182q31.325091 0 52.130909-23.412364l220.485818-248.087273 34.816 30.952728zM954.181818 232.727273q0 2.327273-0.465454 4.561454t-1.303273 4.328728q-0.884364 2.141091-2.141091 4.049454-1.303273 1.861818-2.885818 3.537455-1.629091 1.582545-3.537455 2.885818-1.908364 1.256727-4.049454 2.141091-2.094545 0.884364-4.328728 1.303272-2.280727 0.465455-4.561454 0.465455-2.327273 0-4.561455-0.465455t-4.328727-1.303272q-2.141091-0.884364-4.049454-2.141091-1.861818-1.303273-3.537455-2.885818-1.582545-1.629091-2.885818-3.537455-1.256727-1.908364-2.141091-4.049454-0.884364-2.094545-1.303273-4.328728-0.465455-2.280727-0.465454-4.561454 0-2.327273 0.465454-4.561455t1.303273-4.328727q0.884364-2.141091 2.141091-4.049455 1.303273-1.861818 2.885818-3.537454 1.629091-1.582545 3.537455-2.885818 1.908364-1.256727 4.049454-2.141091 2.094545-0.884364 4.328727-1.303273 2.280727-0.465455 4.561455-0.465455 2.327273 0 4.561454 0.465455t4.328728 1.303273q2.141091 0.884364 4.049454 2.141091 1.861818 1.303273 3.537455 2.885818 1.582545 1.629091 2.885818 3.537454 1.256727 1.908364 2.141091 4.049455 0.884364 2.094545 1.303273 4.328727 0.465455 2.280727 0.465454 4.561455z m-744.727273 512q0 2.327273-0.465454 4.561454t-1.303273 4.328728q-0.884364 2.141091-2.141091 4.049454-1.303273 1.861818-2.885818 3.537455-1.629091 1.582545-3.537454 2.885818-1.908364 1.256727-4.049455 2.141091-2.094545 0.884364-4.328727 1.303272-2.280727 0.465455-4.561455 0.465455-2.327273 0-4.561454-0.465455t-4.328728-1.303272q-2.141091-0.884364-4.049454-2.141091-1.861818-1.303273-3.537455-2.885818-1.582545-1.629091-2.885818-3.537455-1.256727-1.908364-2.141091-4.049454-0.884364-2.094545-1.303273-4.328728-0.465455-2.280727-0.465454-4.561454 0-2.327273 0.465454-4.561455t1.303273-4.328727q0.884364-2.141091 2.141091-4.049455 1.303273-1.861818 2.885818-3.537454 1.629091-1.582545 3.537455-2.885818 1.908364-1.256727 4.049454-2.141091 2.094545-0.884364 4.328728-1.303273 2.280727-0.465455 4.561454-0.465455 2.327273 0 4.561455 0.465455t4.328727 1.303273q2.141091 0.884364 4.049455 2.141091 1.861818 1.303273 3.537454 2.885818 1.582545 1.629091 2.885818 3.537454 1.256727 1.908364 2.141091 4.049455 0.884364 2.094545 1.303273 4.375273 0.465455 2.234182 0.465454 4.514909z" fill="#FF2222" p-id="2493"></path></svg>',
    });

    this.meta.requirements = props?.requirements || [
      {
        group: [1, 999],
        aggregate: [2, 999],
      },
    ];
  }

  onUpdated(options, context): void {
    if (!this.isMatchRequirement(options.config)) {
      this.adapter?.unmount();
      return;
    }

    this.updateOptions = this.getOptions(
      context,
      options.dataset,
      options.config,
      options.drillOption,
    );
    this.adapter?.updated(this.updateOptions);
  }

  onResize(_, context): void {
    if (this.updateOptions?.options) {
      this.updateOptions.options = Object.assign(
        {
          ...this.updateOptions.options,
        },
        { width: context.width, height: context.height },
      );
      this.adapter?.updated(this.updateOptions);
    }
  }

  getOptions(
    context: any,
    dataset: ChartDataSetDTO,
    config: ChartConfig,
    drillOption: ChartDrillOption,
  ) {
    const styleConfigs: ChartStyleConfig[] = config.styles || [];
    const dataConfigs: ChartDataConfig[] = config.datas || [];
    const settingConfigs: ChartStyleConfig[] = config.settings || [];
    // const groupConfigs = dataConfigs
    //   .filter(c => c.type === 'group')
    //   .filter(c => c.key === 'dimension')
    //   .flatMap(config => config.rows || []);
    const groupConfigs: ChartDataSectionField[] = getDrillableRows(
      dataConfigs,
      drillOption,
    );

    const leftMetricsConfigs: ChartDataSectionField[] = dataConfigs
      .filter(
        c => c.type === ChartDataSectionType.Aggregate && c.key === 'metricsL',
      )
      .flatMap(config => config.rows || []);
    const rightMetricsConfigs: ChartDataSectionField[] = dataConfigs
      .filter(
        c => c.type === ChartDataSectionType.Aggregate && c.key === 'metricsR',
      )
      .flatMap(config => config.rows || []);

    if (!leftMetricsConfigs.concat(rightMetricsConfigs)?.length) {
      return {};
    }

    const chartDataSet = transformToDataSet(
      dataset.rows,
      dataset.columns,
      dataConfigs,
    );
    const leftData: Array<any[]> = [];
    const rightData: Array<any[]> = [];

    chartDataSet.forEach(row => {
      leftData.push([
        row.getCell(groupConfigs[0]),
        toFormattedValue(
          row.getCell(leftMetricsConfigs[0]),
          leftMetricsConfigs[0].format,
        ),
      ]);
      rightData.push([
        row.getCell(groupConfigs[0]),
        toFormattedValue(
          row.getCell(rightMetricsConfigs[0]),
          rightMetricsConfigs[0].format,
        ),
      ]);
    });

    // const [graphType] = getStyles(styles, ['leftY'], ['graphType']);

    return {
      leftData,
      rightData,
      leftName: getColumnRenderName(leftMetricsConfigs[0]),
      rightName: getColumnRenderName(rightMetricsConfigs[0]),
      // graphType,
    };
  }
}

export default HighChartsLineChart;
