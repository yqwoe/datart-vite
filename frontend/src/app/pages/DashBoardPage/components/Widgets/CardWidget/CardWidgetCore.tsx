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
import { Card } from 'antd';
import { memo, useContext } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { WidgetActionContext } from '../../ActionProvider/WidgetActionProvider';
import { BoardContext } from '../../BoardProvider/BoardProvider';
import { WidgetMapper } from '../../WidgetMapper/WidgetMapper';
import { WidgetInfoContext } from '../../WidgetProvider/WidgetInfoProvider';
import { WidgetContext } from '../../WidgetProvider/WidgetProvider';
import { WidgetWrapProvider } from '../../WidgetProvider/WidgetWrapProvider';
import cardProto, { CardToolkit } from './cardConfig';
import { DropHolder } from '../../WidgetComponents/DropHolder';

export const CardWidgetCore: React.FC<{}> = memo(() => {
  const dispatch = useDispatch();
  const widget = useContext(WidgetContext);
  const { align, position } = (
    cardProto.toolkit as CardToolkit
  ).getCustomConfig(widget.config.customConfig.props);
  const { editing } = useContext(WidgetInfoContext);
  const { onEditSelectWidget } = useContext(WidgetActionContext);
  const {
    boardType,
    editing: boardEditing,
    boardId,
  } = useContext(BoardContext);
  return (
    <Card>
      {boardEditing ? (
        <DropHolder tabWidgetId={widget.id} />
      ) : (
        <WidgetWrapProvider boardEditing={boardEditing} boardId={boardId}>
          <MapWrapper>
            <WidgetMapper boardEditing={boardEditing} hideTitle={true} />
          </MapWrapper>
        </WidgetWrapProvider>
      )}
    </Card>
  );
});

const MapWrapper = styled.div`
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
`;
