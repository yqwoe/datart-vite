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
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useResolvedPath } from 'react-router-dom';
import { ListSwitch } from 'app/components';
import { SPACE_XS } from 'styles/StyleConstants';
import { TeamOutlined, UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { selectOrgId } from 'app/pages/MainPage/slice/selectors';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { MemberList } from './MemberList';
import { RoleList } from './RoleList';

export const Sidebar = memo(() => {
  const [selectedKey, setSelectedKey] = useState('');
  const history = useNavigate();
  const orgId = useSelector(selectOrgId);
  const { pathname } = useResolvedPath('');
  const t = useI18NPrefix('member.sidebar');

  useEffect(() => {
    const urlArr = pathname.split('/');
    setSelectedKey(urlArr[urlArr.length - 1]);
  }, [pathname]);

  const titles = useMemo(
    () => [
      { key: 'members', icon: <UserOutlined />, text: t('member') },
      {
        key: 'roles',
        icon: <TeamOutlined />,
        text: t('role'),
      },
    ],
    [t],
  );

  const switchSelect = useCallback(
    key => {
      history(`/organizations/${orgId}/${key}`);
    },
    [history, orgId],
  );

  return (
    <Wrapper>
      <ListSwitch
        titles={titles}
        selectedKey={selectedKey}
        onSelect={switchSelect}
      />
      {selectedKey === 'members' && <MemberList />}
      {selectedKey === 'roles' && <RoleList />}
    </Wrapper>
  );
});

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 320px;
  padding: ${SPACE_XS} 0;
  background-color: ${p => p.theme.componentBackground};
  border-right: 1px solid ${p => p.theme.borderColorSplit};
`;
