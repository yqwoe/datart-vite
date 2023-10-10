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
import { ORIGINAL_TYPE_MAP } from 'app/pages/DashBoardPage/constants';
import type {
  WidgetActionListItem,
  widgetActionType,
  WidgetMeta,
  WidgetProto,
  WidgetToolkit,
} from 'app/pages/DashBoardPage/types/widgetTypes';
import {
  initBackgroundTpl,
  initBorderTpl,
  initPaddingTpl,
  initTitleTpl,
  initWidgetName,
  PaddingI18N,
  TitleI18N,
  widgetTpl,
} from '../../WidgetManager/utils/init';

const NameI18N = {
  zh: '图片',
  en: 'Image',
};
export const widgetMeta: WidgetMeta = {
  icon: 'image-widget',
  originalType: ORIGINAL_TYPE_MAP.image,
  canWrapped: true,
  controllable: false,
  linkable: false,
  singleton: false,
  canFullScreen: true,

  i18ns: [
    {
      lang: 'zh-CN',
      translation: {
        desc: 'img',
        widgetName: NameI18N.zh,
        action: {},
        title: TitleI18N.zh,
        background: { backgroundGroup: '图片编辑' },
        padding: PaddingI18N.zh,

        border: { borderGroup: '边框' },
      },
    },
    {
      lang: 'en-US',
      translation: {
        desc: 'img',
        widgetName: NameI18N.en,
        action: {},
        title: TitleI18N.en,
        background: { backgroundGroup: 'Image Setting' },
        padding: PaddingI18N.en,

        border: { borderGroup: 'Border' },
      },
    },
  ],
};

export type ImageToolkit = WidgetToolkit & {};
export const widgetToolkit: ImageToolkit = {
  create: opt => {
    const widget = widgetTpl();
    widget.id = widgetMeta.originalType + widget.id;
    widget.parentId = opt.parentId || '';
    widget.datachartId = opt.datachartId || '';
    widget.viewIds = opt.viewIds || [];
    widget.relations = opt.relations || [];
    widget.config.originalType = widgetMeta.originalType;
    widget.config.type = 'media';
    widget.config.name = opt.name || '';

    widget.config.customConfig.props = [
      { ...initBackgroundTpl() },
      { ...initTitleTpl() },
      { ...initPaddingTpl() },
      { ...initBorderTpl() },
    ];
    widget.config.customConfig.props?.forEach(ele => {
      if (ele.key === 'backgroundGroup') {
        ele.rows?.forEach(row => {
          if (row.key === 'background') {
            row.value.image =
              'data:image/png;base64,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';
          }
        });
      }
    });

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
};

const imageProto: WidgetProto = {
  originalType: widgetMeta.originalType,
  meta: widgetMeta,
  toolkit: widgetToolkit,
};
export default imageProto;
