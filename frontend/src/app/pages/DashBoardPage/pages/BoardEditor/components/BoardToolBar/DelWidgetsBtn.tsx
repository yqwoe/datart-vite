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
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { Tooltip } from 'antd';
import { ToolbarButton } from 'app/components';
import { DeleteOutlined } from '@ant-design/icons';
import { selectSelectedIds } from '../../slice/selectors';

export const DelWidgetsBtn: FC<{
  fn: () => void;
  title: string;
}> = ({ fn, title }) => {
  const selectedIds = useSelector(selectSelectedIds);
  return (
    <Tooltip title={title}>
      <ToolbarButton
        disabled={!selectedIds}
        onClick={fn}
        icon={<DeleteOutlined />}
      />
    </Tooltip>
  );
};
