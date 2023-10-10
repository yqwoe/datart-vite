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
import { Dropdown, Tooltip } from 'antd';
import {
  ChartDataViewFieldCategory,
  ChartDataViewSubType,
  DataViewFieldType,
  DateFormat,
} from 'app/constants';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { ReactNode, memo } from 'react';
import { ColumnCategories } from '../constants';
import { Column } from '../slice/types';

interface SetFieldTypeProps {
  onChange: (keyPath: string[], name: string) => void;
  field: Column;
  icon: ReactNode;
  hasCategory?: boolean;
  hasFormat?: boolean;
}

const SetFieldType = memo(
  ({
    onChange,
    field,
    hasCategory,
    icon,
    hasFormat = true,
  }: SetFieldTypeProps) => {
    const t = useI18NPrefix('view.schemaTable');
    const tg = useI18NPrefix('global');
    return (
      <Dropdown
        trigger={['click']}
        menu={{
          items: Object.values(DataViewFieldType)
            .map(t => {
              if (t === DataViewFieldType.DATE && hasFormat) {
                return {
                  key: t,
                  label: tg(`columnType.${t.toLowerCase()}`),
                  popupClassName: 'datart-schema-table-header-menu',
                  children: Object.values(DateFormat).map(format => {
                    return { key: format, label: format };
                  }),
                };
              }
              return {
                key: t,
                label: tg(`columnType.${t.toLowerCase()}`),
              };
            })
            .concat(
              hasCategory
                ? [
                    {
                      type: 'divider',
                      key: '',
                    },
                    {
                      key: 'categories',
                      label: t('category'),
                      popupClassName: 'datart-schema-table-header-menu',
                      children: Object.values(ChartDataViewSubType).map(t => ({
                        key: `category-${t}`,
                        label: tg(`columnCategory.${t.toLowerCase()}`),
                      })),
                    },
                  ]
                : [],
            ),
          onClick: ({ keyPath }) => onChange(keyPath, field?.name),
          className: 'datart-schema-table-header-menu',
          selectedKeys: [
            field.type,
            `category-${field.category}`,
            field.dateFormat || '',
          ],
        }}
      >
        <Tooltip
          title={hasCategory ? t('typeAndCategory') : t('category')}
          placement="left"
        >
          {icon}
        </Tooltip>
      </Dropdown>
    );
  },
);
export default SetFieldType;
