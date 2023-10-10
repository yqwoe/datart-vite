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
import { memo } from 'react';
import { Dropdown, Menu } from 'antd';
import { SPACE_SM } from 'styles/StyleConstants';
import classnames from 'classnames';
import styled from 'styled-components';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { StructViewJoinType } from '../../../constants';

interface SelectJoinTypeProps {
  type: StructViewJoinType;
  onChange: (type) => void;
}

const SelectJoinType = memo(({ type, onChange }: SelectJoinTypeProps) => {
  const t = useI18NPrefix(`view.structView`);

  const menu = {
    items: [
      {
        key: StructViewJoinType.LeftJoin,
        label: t(StructViewJoinType.LeftJoin),
      },
      {
        key: StructViewJoinType.RightJoin,
        label: t(StructViewJoinType.RightJoin),
      },
      {
        key: StructViewJoinType.InnerJoin,
        label: t(StructViewJoinType.InnerJoin),
      },
    ],
    onClick: e => onChange(e.key),
    selectedKeys: [type],
  };

  return (
    <Dropdown trigger={['click']} placement="bottomLeft" menu={menu}>
      <Icon
        className={classnames('iconfont', {
          'icon-join_inner': type === StructViewJoinType.InnerJoin,
          'icon-join_right': type === StructViewJoinType.RightJoin,
          'icon-join_left': type === StructViewJoinType.LeftJoin,
        })}
      ></Icon>
    </Dropdown>
  );
});

const Icon = styled.i`
  margin: 0 ${SPACE_SM};
  color: ${p => p.theme.blue};
  cursor: pointer;
`;

export default SelectJoinType;
