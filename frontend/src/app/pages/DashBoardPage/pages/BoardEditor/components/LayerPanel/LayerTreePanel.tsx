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
import { FC, memo, useMemo } from 'react';
import { ListTitle } from 'app/components';
import styled from 'styled-components';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { LayerTree } from './LayerTree';

export const LayerTreePanel: FC<{}> = memo(() => {
  const t = useI18NPrefix(`viz.board.action`);
  const titleProps = useMemo(
    () => ({
      title: t('widgetList'),
      // search: true,
      // onSearch: null,
    }),
    [t],
  );

  return (
    <Panel>
      <ListTitle {...titleProps} />
      <LayerTree />
    </Panel>
  );
});
const Panel = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${p => p.theme.componentBackground};
  box-shadow: ${p => p.theme.shadowSider};
`;
