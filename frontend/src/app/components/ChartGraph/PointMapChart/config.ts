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
import { ChartConfig } from 'app/types/ChartConfig';
import geoChina from 'app/assets/geojson/china.json';

const config: ChartConfig = {
  datas: [
    {
      label: 'latitude',
      key: 'latitude',
      required: true,
      type: 'group',
      actions: {
        NUMERIC: ['alias', 'format', 'sortable'],
        STRING: ['alias', 'format', 'sortable'],
      },
      limit: 1,
    },
    {
      label: 'longitude',
      key: 'longitude',
      required: true,
      type: 'group',
      actions: {
        NUMERIC: ['alias', 'format', 'sortable'],
        STRING: ['alias', 'format', 'sortable'],
      },
      limit: 1,
    },
    {
      label: 'dimension',
      key: 'dimension',
      required: true,
      type: 'group',
      actions: {
        NUMERIC: ['alias', 'format', 'sortable'],
        STRING: ['alias', 'format', 'sortable'],
      },
      limit: [0, 999],
    },
    {
      label: 'metrics',
      key: 'metrics',
      type: 'aggregate',
      required: true,
      limit: [1, 999],
      actions: {
        NUMERIC: ['aggregate', 'alias', 'format', 'sortable', 'colorRange'],
        STRING: ['aggregate', 'alias', 'format', 'sortable', 'colorRange'],
      },
      options: {
        sortable: { backendSort: false },
      },
    },
    {
      label: 'filter',
      key: 'filter',
      type: 'filter',
      allowSameField: true,
    },
    {
      label: 'info',
      key: 'info',
      type: 'info',
    },
  ],
  styles: [
    {
      label: 'map.title',
      key: 'map',
      comType: 'group',
      rows: [
        {
          label: 'map.center',
          key: 'center',
          comType: 'select',
          default: '113.665412,34.757975',
          options: {
            items: geoChina['features']
              .filter(item => !!item?.properties?.name)
              .map(item => {
                const { name: label, center = [] } = item.properties;
                return {
                  label,
                  value: center?.join(','),
                };
              }),
          },
        },
        {
          label: 'map.zoom',
          key: 'zoom',
          comType: 'inputNumber',
          default: 6,
          options: {
            step: 1,
            min: 5,
            max: 20,
          },
        },
        {
          label: 'map.theme',
          key: 'theme',
          comType: 'select',
          default: 'light',
          options: {
            items: [
              { label: '标准', value: 'normal' },
              { label: '明亮', value: 'light' },
              { label: '黑暗', value: 'dark' },
              { label: '马卡龙', value: 'macaron' },
              { label: '涂鸦', value: 'graffiti' },
              { label: '远山黛', value: 'whitesmoke' },
              { label: '草青色', value: 'fresh' },
              { label: '极夜蓝', value: 'darkblue' },
              { label: '蓝色', value: 'blue' },
            ],
          },
        },
        {
          label: 'map.cycleType',
          key: 'cycleType',
          comType: 'select',
          default: 'scatter',
          options: {
            items: [
              { label: '标准', value: 'scatter' },
              { label: '动态', value: 'effectScatter' },
            ],
          },
        },
        {
          label: 'map.cycleColor',
          key: 'cycleColor',
          comType: 'fontColor',
          default: '#298ffe',
        },
        {
          label: 'map.cycleRatio',
          key: 'cycleRatio',
          default: 5,
          comType: 'inputNumber',
        },
      ],
    },
    {
      label: 'label.title',
      key: 'label',
      comType: 'group',
      rows: [
        {
          label: 'label.showLabel',
          key: 'showLabel',
          default: false,
          comType: 'checkbox',
        },
        {
          label: 'label.position',
          key: 'position',
          comType: 'select',
          default: 'top',
          options: {
            items: [
              { label: '上', value: 'top' },
              { label: '左', value: 'left' },
              { label: '右', value: 'right' },
              { label: '下', value: 'bottom' },
              { label: '内', value: 'inside' },
              { label: '内左', value: 'insideLeft' },
              { label: '内右', value: 'insideRight' },
              { label: '内上', value: 'insideTop' },
              { label: '内下', value: 'insideBottom' },
              { label: '内左上', value: 'insideTopLeft' },
              { label: '内左下', value: 'insideBottomLeft' },
              { label: '内右上', value: 'insideTopRight' },
              { label: '内右下', value: 'insideBottomRight' },
            ],
          },
        },
        {
          label: 'font',
          key: 'font',
          comType: 'font',
          default: {
            fontFamily: 'PingFang SC',
            fontSize: '12',
            fontWeight: 'normal',
            fontStyle: 'normal',
            color: 'black',
          },
        },
      ],
    },
    {
      label: 'viz.palette.style.visualMap.title',
      key: 'visualMap',
      comType: 'group',
      rows: [
        {
          label: 'viz.palette.style.visualMap.show',
          key: 'show',
          default: false,
          comType: 'checkbox',
        },
        {
          label: 'viz.palette.style.visualMap.orient',
          key: 'orient',
          comType: 'select',
          default: 'vertical',
          options: {
            items: [
              { label: '竖直', value: 'vertical' },
              { label: '水平', value: 'horizontal' },
            ],
          },
        },
        {
          label: 'viz.palette.style.visualMap.align',
          key: 'align',
          comType: 'select',
          default: 'auto',
          options: {
            items: [
              { label: '自动', value: 'auto' },
              { label: '右', value: 'right' },
              { label: '上', value: 'top' },
              { label: '下', value: 'bottom' },
              { label: '左', value: 'left' },
            ],
          },
        },
        {
          label: 'viz.palette.style.visualMap.itemWidth',
          key: 'itemWidth',
          default: 20,
          comType: 'inputNumber',
        },
        {
          label: 'viz.palette.style.visualMap.itemHeight',
          key: 'itemHeight',
          default: 140,
          comType: 'inputNumber',
        },
        {
          label: 'viz.palette.style.font',
          key: 'font',
          comType: 'font',
          default: {
            fontFamily: 'PingFang SC',
            fontSize: '12',
            fontWeight: 'normal',
            fontStyle: 'normal',
            color: 'black',
          },
        },
      ],
    },
  ],
  settings: [
    {
      label: 'paging.title',
      key: 'paging',
      comType: 'group',
      rows: [
        {
          label: 'paging.pageSize',
          key: 'pageSize',
          default: 1000,
          comType: 'inputNumber',
          options: {
            needRefresh: true,
            step: 1,
            min: 0,
          },
        },
      ],
    },
  ],
  interactions: [
    {
      label: 'drillThrough.title',
      key: 'drillThrough',
      comType: 'checkboxModal',
      default: false,
      options: { modalSize: 'middle' },
      rows: [
        {
          label: 'drillThrough.title',
          key: 'setting',
          comType: 'interaction.drillThrough',
        },
      ],
    },
    {
      label: 'viewDetail.title',
      key: 'viewDetail',
      comType: 'checkboxModal',
      default: false,
      options: { modalSize: 'middle' },
      rows: [
        {
          label: 'viewDetail.title',
          key: 'setting',
          comType: 'interaction.viewDetail',
        },
      ],
    },
  ],
  i18ns: [
    {
      lang: 'zh-CN',
      translation: {
        paging: {
          title: '分页设置',
          enablePaging: '启用分页',
          pageSize: '每页行数',
        },
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
        deminsionAndColor: '指标(颜色)',
        label: {
          title: '标签',
          showLabel: '显示标签',
          position: '位置',
        },
        map: {
          title: '地图设置',
          level: '默认地图等级',
          enableZoom: '开启缩放',
          theme: '主题',
          cycleType: '气泡类型',
          cycleColor: '气泡颜色',
          cycleRatio: '气泡大像素比',
          zoom: '地图缩放',
          center: '中心位置',
        },
        visualMap: {
          title: '地图设置',
        },
        background: { title: '背景设置' },
      },
    },
    {
      lang: 'en',
      translation: {
        paging: {
          title: 'Paging',
          pageSize: 'Rows',
        },
        common: {
          showAxis: 'Show Axis',
          inverseAxis: 'Inverse Axis',
          lineStyle: 'Line Style',
          borderType: 'Border Type',
          borderWidth: 'Border Width',
          borderColor: 'Border Color',
          backgroundColor: 'Background Color',
          showLabel: 'Show Lable',
          unitFont: 'Unit Font',
          rotate: 'Rorate',
          position: 'Position',
          showInterval: 'Show Interval',
          interval: 'Interval',
          showTitleAndUnit: 'Show Title',
          nameLocation: 'Title Location',
          nameRotate: 'Title Rotate',
          nameGap: 'Title Gap',
          min: 'Min',
          max: 'Max',
        },
        deminsionAndColor: 'Metrics(Color)',
        label: {
          title: 'Label',
          showLabel: 'Show Label',
          position: 'Position',
        },
        map: {
          title: 'Map Settings',
          level: 'Default Level',
          enableZoom: 'Enable Zoom',
          theme: 'Theme',
          cycleType: 'Cycle',
          cycleColor: 'Cycle Color',
          cycleRatio: 'Cycle Ratio',
          zoom: 'Map Zoom',
          center: 'Map Center',
        },
        visualMap: {
          title: 'Visual Map',
        },
        background: { title: 'Background' },
      },
    },
  ],
};

export default config;
