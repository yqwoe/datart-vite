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
import { ContainerOutlined } from '@ant-design/icons';
import { Dropdown, Tooltip } from 'antd';
import { ToolbarButton } from 'app/components';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import widgetManagerInstance from 'app/pages/DashBoardPage/components/WidgetManager';
import { LightWidgetType } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import React, { useCallback, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { ORIGINAL_TYPE_MAP } from '../../../../../constants';
import { addWidgetsToEditBoard } from '../../../slice/thunk';
import { BoardToolBarContext } from '../context/BoardToolBarContext';

export const AddContainer: React.FC<{}> = () => {
  const t = useI18NPrefix(`viz.board.action`);
  const dispatch = useDispatch();
  const { boardType } = useContext(BoardToolBarContext);
  const onSelectContainerWidget = useCallback(
    ({ key }) => {
      const widget = widgetManagerInstance.toolkit(key).create({
        boardType: boardType,
      });
      dispatch(addWidgetsToEditBoard([widget]));
    },
    [boardType, dispatch],
  );
  type ContainerWidgetItems = {
    name: string;
    icon: string;
    type: LightWidgetType;
    disabled?: boolean;
  };
  const containerWidgetTypes: ContainerWidgetItems[] = [
    {
      name: t('tab'),
      icon: '',
      type: 'tab',
    },
    {
      name: t('carousel'),
      icon: '',
      // disabled: true,
      type: 'carousel',
    },
  ];

  const containerWidgetItems = {
    onClick: onSelectContainerWidget,
    items: containerWidgetTypes.map(({ name, type, disabled }) => ({
      key: type,
      disabled,
      label: name,
    })),
  };
  return (
    <Dropdown
      menu={containerWidgetItems}
      placement="bottomLeft"
      trigger={['click']}
    >
      <Tooltip title={t('container')}>
        <ToolbarButton icon={<ContainerOutlined />}></ToolbarButton>
      </Tooltip>
    </Dropdown>
  );
};
