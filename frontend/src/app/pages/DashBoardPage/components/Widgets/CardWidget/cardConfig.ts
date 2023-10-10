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
import { WHITE } from 'styles/StyleConstants';
import { ORIGINAL_TYPE_MAP } from 'app/pages/DashBoardPage/constants';
import { TabWidgetContent } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import type {
  WidgetActionListItem,
  widgetActionType,
  WidgetMeta,
  WidgetProto,
  WidgetToolkit,
} from 'app/pages/DashBoardPage/types/widgetTypes';
import { getJsonConfigs } from 'app/pages/DashBoardPage/utils';
import {
  initBackgroundTpl,
  initBorderTpl,
  initPaddingTpl,
  initTitleTpl,
  initWidgetName,
  LoopFetchI18N,
  PaddingI18N,
  TitleI18N,
  widgetTpl,
} from '../../WidgetManager/utils/init';
import { uuidv4 } from 'utils/utils';

const NameI18N = {
  zh: '卡片',
  en: 'Card',
};

const cardI18N = {
  zh: {},
  en: {},
};

export const widgetMeta: WidgetMeta = {
  icon: 'card-widget',
  originalType: ORIGINAL_TYPE_MAP.card,
  canWrapped: false,
  controllable: false,
  linkable: false,
  canFullScreen: true,
  singleton: false,

  i18ns: [
    {
      lang: 'zh-CN',
      translation: {
        desc: '卡片 容器组件可以切换',
        widgetName: NameI18N.zh,
        action: {},
        title: TitleI18N.zh,
        background: { backgroundGroup: '背景' },
        padding: PaddingI18N.zh,
        loopFetch: LoopFetchI18N.zh,
        border: { borderGroup: '边框' },
        card: cardI18N.zh,
      },
    },
    {
      lang: 'en-US',
      translation: {
        desc: 'Card container',
        widgetName: NameI18N.en,
        action: {},
        title: TitleI18N.en,
        background: { backgroundGroup: 'Background' },
        padding: PaddingI18N.en,
        loopFetch: LoopFetchI18N.en,
        border: { borderGroup: 'Border' },
        card: cardI18N.en,
      },
    },
  ],
};

export const initCardTpl = () => {
  return {
    // label: 'card.tabGroup',
    // key: 'tabGroup',
    // comType: 'group',
    // rows: [
    //   {
    //     label: 'tab.alignTitle',
    //     key: 'align',
    //     default: 'start',
    //     value: 'start',
    //     comType: 'select',
    //     options: {
    //       translateItemLabel: true,
    //       items: [
    //         { label: 'viz.common.enum.alignment.start', value: 'start' },
    //         { label: 'viz.common.enum.alignment.center', value: 'center' },
    //         { label: 'viz.common.enum.alignment.end', value: 'end' },
    //       ],
    //     },
    //   },
    //   {
    //     label: 'tab.position',
    //     key: 'position',
    //     default: 'top',
    //     value: 'top',
    //     comType: 'select',
    //     options: {
    //       translateItemLabel: true,
    //       items: [
    //         { label: 'viz.common.enum.position.top', value: 'top' },
    //         { label: 'viz.common.enum.position.bottom', value: 'bottom' },
    //         { label: 'viz.common.enum.position.left', value: 'left' },
    //         { label: 'viz.common.enum.position.right', value: 'right' },
    //       ],
    //     },
    //   },
    // ],
  };
};

export type CardToolkit = WidgetToolkit & {
  getCustomConfig: (props) => {
    align: string;
    position: string;
  };
};
export const widgetToolkit: CardToolkit = {
  create: opt => {
    const widget = widgetTpl();
    widget.parentId = opt.parentId || '';
    widget.datachartId = opt.datachartId || '';
    widget.viewIds = opt.viewIds || [];
    widget.relations = opt.relations || [];
    widget.config.originalType = widgetMeta.originalType;
    widget.config.type = 'container';
    widget.config.name = opt.name || '';

    widget.config.customConfig.props = [
      { ...initCardTpl() },
      { ...initTitleTpl() },
      { ...initPaddingTpl() },
      { ...initBackgroundTpl(WHITE) },
      { ...initBorderTpl() },
    ];
    return widget;
  },
  getName(key) {
    return initWidgetName(NameI18N, key);
  },
  getDropDownList(...arg) {
    const list: WidgetActionListItem<widgetActionType>[] = [
      {
        key: 'edit',
        renderMode: ['edit'],
      },
      {
        key: 'delete',
        renderMode: ['edit'],
      },
      {
        key: 'lock',
        renderMode: ['edit'],
      },
      {
        key: 'group',
        renderMode: ['edit'],
      },
    ];
    return list;
  },
  edit() {},
  save() {},
  // lock() {},
  // unlock() {},
  // copy() {},
  // paste() {},
  // delete() {},
  // changeTitle() {},
  // getMeta() {},
  // getWidgetName() {},
  // //
  getCustomConfig(props) {
    const [align, position] = getJsonConfigs(
      props,
      ['tabGroup'],
      ['align', 'position'],
    );
    return {
      align,
      position,
    };
  },
};

const tabProto: WidgetProto = {
  originalType: widgetMeta.originalType,
  meta: widgetMeta,
  toolkit: widgetToolkit,
};
export default tabProto;
