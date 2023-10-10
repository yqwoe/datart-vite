import ReactChart from 'app/models/ReactChart';
import BasicHighChartsWrapper from '../BasicHighChartsWrapper';
import Config from './config';

class HighChartsAreaChart extends ReactChart {
  useIFrame = false;
  isISOContainer = 'high-charts-area-chart';
  config = Config;
  chart: any = null;
  updateOptions: any = {};

  constructor(props?) {
    super(BasicHighChartsWrapper, {
      id: props?.id || 'high-charts-area-chart',
      name: props?.name || 'AreaChart',
      icon:
        props?.icon ||
        '<svg t="1651731730777" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3063" width="200" height="200"><path d="M149.333333 874.666667V85.333333H85.333333v853.333334h853.333334v-64z" fill="#333333" p-id="3064"></path><path d="M644.266667 369.066667l-128 100.266666c-4.266667 2.133333-8.533333 4.266667-12.8 0L362.666667 394.666667c-4.266667-2.133333-10.666667-2.133333-12.8 2.133333L213.333333 520.533333v138.666667l136.533334-121.6c4.266667-4.266667 8.533333-4.266667 12.8-2.133333l162.133333 87.466666c4.266667 2.133333 8.533333 2.133333 10.666667 0l132.266666-83.2s2.133333-2.133333 4.266667-2.133333L938.666667 471.466667v-174.933334l-288 70.4c-4.266667 0-6.4 2.133333-6.4 2.133334z m0 0" fill="#5C6BC0" p-id="3065"></path><path d="M665.6 586.666667l-130.133333 83.2c-4.266667 2.133333-8.533333 2.133333-10.666667 0l-164.266667-87.466667c-4.266667-2.133333-10.666667-2.133333-12.8 2.133333 0 0-136.533333 121.6-136.533333 123.733334v100.266666h725.333333V518.4l-266.666666 68.266667h-4.266667z m0 0" fill="#8E99F3" p-id="3066"></path></svg>',
    });

    this.meta.requirements = props?.requirements || [
      {
        group: [1, 999],
        aggregate: [1, 999],
      },
    ];
  }
}

export default HighChartsAreaChart;
