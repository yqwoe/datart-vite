import { ChartConfig } from 'app/types/ChartConfig';

const config: ChartConfig = {
  datas: [
    {
      label: 'dimension',
      key: 'dimension',
      required: true,
      type: 'group',
    },
    {
      label: 'metrics',
      key: 'metrics',
      required: true,
      type: 'aggregate',
    },
    {
      label: 'filter',
      key: 'filter',
      type: 'filter',
      allowSameField: true,
    },
  ],
  styles: [
    {
      label: 'config.title',
      key: 'config',
      comType: 'group',
      rows: [
        {
          label: 'config.rows',
          key: 'rows',
          comType: 'select',
          options: {
            mode: 'multiple',
            getItems: cols => {
              const columns = (cols || [])
                .filter(col =>
                  ['aggregate', 'group', 'mixed'].includes(col.type),
                )
                .reduce((acc, cur) => acc.concat(cur.rows || []), [])
                .map(c => ({
                  key: c.uid,
                  value: c.aggregate
                    ? `${c.aggregate}(${c.colName})`
                    : c.colName,
                  label:
                    c.label || c.aggregate
                      ? `${c.aggregate}(${c.colName})`
                      : c.colName,
                }));
              return columns;
            },
          },
        },
        {
          label: 'config.columns',
          key: 'columns',
          comType: 'select',
          options: {
            mode: 'multiple',
            getItems: cols => {
              const columns = (cols || [])
                .filter(col =>
                  ['aggregate', 'group', 'mixed'].includes(col.type),
                )
                .reduce((acc, cur) => acc.concat(cur.rows || []), [])
                .map(c => ({
                  key: c.uid,
                  value: c.aggregate
                    ? `${c.aggregate}(${c.colName})`
                    : c.colName,
                  label:
                    c.label || c.aggregate
                      ? `${c.aggregate}(${c.colName})`
                      : c.colName,
                }));
              return columns;
            },
          },
        },
        {
          label: 'config.values',
          key: 'values',
          comType: 'select',
          options: {
            mode: 'multiple',
            getItems: cols => {
              const columns = (cols || [])
                .filter(col =>
                  ['aggregate', 'group', 'mixed'].includes(col.type),
                )
                .reduce((acc, cur) => acc.concat(cur.rows || []), [])
                .map(c => ({
                  key: c.uid,
                  value: c.aggregate
                    ? `${c.aggregate}(${c.colName})`
                    : c.colName,
                  label:
                    c.label || c.aggregate
                      ? `${c.aggregate}(${c.colName})`
                      : c.colName,
                }));
              return columns;
            },
          },
        },
      ],
    },
    {
      label: 'style.title',
      key: 'style',
      comType: 'group',
      rows: [
        {
          label: 'style.hierarchyType',
          key: 'hierarchyType',
          comType: 'select',
          default: 'grid',
          options: {
            items: [
              { label: '平铺', value: 'grid' },
              { label: '树状', value: 'tree' },
            ],
          },
        },
        {
          label: 'style.theme',
          key: 'theme',
          comType: 'select',
          default: '',
          options: {
            items: [
              { label: '默认', value: '' },
              { label: '蓝色', value: 'colorful' },
              { label: '灰色', value: 'gray' },
            ],
          },
        },
        {
          label: 'style.headerAction',
          key: 'headerAction',
          comType: 'switch',
          default: false,
        },
        {
          label: 'style.tooltip',
          key: 'tooltip',
          comType: 'switch',
          default: false,
        },
      ],
    },
  ],
  settings: [],
  i18ns: [
    {
      lang: 'zh-CN',
      translation: {
        common: {
          showAxis: '显示坐标轴',
          inverseAxis: '反转坐标轴',
          lineStyle: '线条样式',
          borderType: '边框线条类型',
          borderWidth: '边框线条宽度',
          borderColor: '边框线条颜色',
          backgroundColor: '背景颜色',
          showLabel: '显示标签',
          unitFont: '刻度字体',
          rotate: '旋转角度',
          position: '位置',
          showInterval: '显示刻度',
          interval: '刻度间隔',
          showTitleAndUnit: '显示标题和刻度',
          nameLocation: '标题位置',
          nameRotate: '标题旋转',
          nameGap: '标题与轴线距离',
          min: '最小值',
          max: '最大值',
        },
        columns: {
          title: '列配置',
          name: '展示名称',
          position: '位置',
        },
        data: {
          color: '颜色',
          colorize: '配色',
        },
        rows: {
          title: '行配置',
          smooth: '平滑',
          name: '展示名称',
        },
        values: {
          title: '聚合数据',
          name: '展示名称',
        },
        config: {
          title: '透视表配置',
          rows: '行配置',
          columns: '列配置',
          values: '聚合数据',
        },
        style: {
          title: '透视表样式',
          hierarchyType: '表头样式',
          theme: '主题',
          headerAction: '表头操作',
          tooltip: '提示',
        },
      },
    },
  ],
};

export default config;
