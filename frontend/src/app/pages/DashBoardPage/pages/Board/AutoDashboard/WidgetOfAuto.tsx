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
import React from 'react';
import { Collapse } from 'antd';
import styled from 'styled-components';
import { WidgetMapper } from 'app/pages/DashBoardPage/components/WidgetMapper/WidgetMapper';
import BaseConfigProvider from 'app/BaseConfigProvider';

const { Panel } = Collapse;

export const WidgetOfAuto: React.FC = React.memo(() => {
  return (
    <BaseConfigProvider>
      <Wrapper className="widget">
        <WidgetMapper boardEditing={false} hideTitle={false} />
      </Wrapper>
    </BaseConfigProvider>
  );
});
export default WidgetOfAuto;

const Wrapper = styled.div<{}>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;
