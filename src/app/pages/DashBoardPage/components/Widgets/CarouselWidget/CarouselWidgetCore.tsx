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
import { Carousel, Tabs } from 'antd';
import { TabWidgetContent } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { memo, useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { PRIMARY } from 'styles/StyleConstants';
import { uuidv4 } from 'utils/utils';
import { editBoardStackActions } from '../../../pages/BoardEditor/slice';
import { WidgetActionContext } from '../../ActionProvider/WidgetActionProvider';
import { BoardContext } from '../../BoardProvider/BoardProvider';
import { DropHolder } from '../../WidgetComponents/DropHolder';
import { WidgetMapper } from '../../WidgetMapper/WidgetMapper';
import { WidgetInfoContext } from '../../WidgetProvider/WidgetInfoProvider';
import { WidgetContext } from '../../WidgetProvider/WidgetProvider';
import { WidgetWrapProvider } from '../../WidgetProvider/WidgetWrapProvider';
import carouselProto, { CarouselToolkit } from './carouselConfig';

export const CarouselWidgetCore: React.FC<{}> = memo(() => {
  const dispatch = useDispatch();
  const widget = useContext(WidgetContext);
  const { autoplay, position } = (
    carouselProto.toolkit as CarouselToolkit
  ).getCustomConfig(widget.config.customConfig.props);
  const { editing } = useContext(WidgetInfoContext);
  const { onEditSelectWidget } = useContext(WidgetActionContext);
  const {
    boardType,
    editing: boardEditing,
    boardId,
  } = useContext(BoardContext);
  const { itemMap } = widget.config.content as TabWidgetContent;
  const tabsCons = Object.values(itemMap).sort((a, b) => a.index - b.index);
  const [activeKey, SetActiveKey] = useState<string | number>(
    tabsCons[0]?.index || 0,
  );
  useEffect(() => {
    const tab = tabsCons?.find(t => String(t.index) === String(activeKey));
    if (tab && editing) {
      onEditSelectWidget({
        multipleKey: false,
        id: tab.childWidgetId,
        selected: true,
      });
    }
  }, [activeKey, editing, onEditSelectWidget, tabsCons]);

  const onTabClick = useCallback((activeKey: any, event) => {
    SetActiveKey(activeKey);
  }, []);

  const tabAdd = useCallback(() => {
    const newTabId = `carousel_${uuidv4()}`;
    const maxIndex = tabsCons[tabsCons.length - 1]?.index || 0;
    const nextIndex = maxIndex + 1;
    dispatch(
      editBoardStackActions.tabsWidgetAddTab({
        parentId: widget.id,
        tabItem: {
          index: nextIndex,
          name: 'carousel',
          tabId: newTabId,
          childWidgetId: '',
        },
      }),
    );
    setImmediate(() => {
      SetActiveKey(nextIndex);
    });
  }, [dispatch, tabsCons, widget.id]);

  const tabRemove = useCallback(
    targetKey => {
      const tabId =
        tabsCons.find(tab => String(tab.index) === targetKey)?.tabId || '';
      dispatch(
        editBoardStackActions.tabsWidgetRemoveTab({
          parentId: widget.id,
          sourceTabId: tabId,
          mode: boardType,
        }),
      );
      setImmediate(() => {
        SetActiveKey(tabsCons[0].index);
      });
    },

    [dispatch, widget.id, boardType, tabsCons],
  );

  const tabEdit = useCallback(
    (targetKey, action: 'add' | 'remove') => {
      action === 'add' ? tabAdd() : tabRemove(targetKey);
    },
    [tabAdd, tabRemove],
  );

  console.log(editing, boardEditing, boardId,tabsCons);

  return (
    <CarouselContainer>
      {editing ? (
        <Tabs
          onTabClick={editing ? onTabClick : undefined}
          size="small"
          tabBarGutter={1}
          activeKey={editing ? String(activeKey) : undefined}
          tabBarStyle={{ fontSize: '16px' }}
          type={editing ? 'editable-card' : undefined}
          onEdit={editing ? tabEdit : undefined}
          destroyInactiveTabPane
          items={tabsCons.map(tab => ({
            key: tab.index.toString(),
            label: tab.name || 'tab',
            className: 'TabPane',
            forceRender: true,
            children: (
              <>
                {tab.childWidgetId ? (
                  <WidgetWrapProvider
                    id={tab.childWidgetId}
                    boardEditing={boardEditing}
                    boardId={boardId}
                  >
                    <MapWrapper>
                      <WidgetMapper
                        boardEditing={boardEditing}
                        hideTitle={true}
                      />
                    </MapWrapper>
                  </WidgetWrapProvider>
                ) : (
                  boardEditing && (
                    <DropHolder tabItem={tab} tabWidgetId={widget.id} />
                  )
                )}
              </>
            ),
          }))}
        />
      ) : (
        <CarouselBoxWrap dotPosition={position} autoplay={autoplay}>
          {tabsCons.map(tab => (
            <CarouselItemWrap key={tab.tabId} className="CarouselItem">
              <WidgetWrapProvider
                id={tab.childWidgetId}
                boardEditing={boardEditing}
                boardId={boardId}
              >
                <MapWrapper>
                  <WidgetMapper boardEditing={boardEditing} hideTitle={true} />
                </MapWrapper>
              </WidgetWrapProvider>
            </CarouselItemWrap>
          ))}
        </CarouselBoxWrap>
      )}
    </CarouselContainer>
  );
});
const CarouselContainer = styled.div`
  width: 100%;
  height: 100%;

  background: transparent;

  & .ant-tabs {
    width: 100%;
    height: 100%;
    background: none;
  }

  & .ant-tabs-content {
    width: 100%;
    height: 100%;
  }

  .ant-tabs-nav {
    margin: 0;
  }

  .ant-tabs-tab {
    padding: 0 !important;
    margin-right: 32px !important;
    color: ${p => p.theme.textColorSnd};
  }
  & .ant-tabs.ant-tabs-card.ant-tabs-card > .ant-tabs-nav .ant-tabs-tab {
    margin: 0 10px;
  }
  & .TabPane {
    width: 100%;
    height: 100%;
  }
  & .ant-tabs-tab-remove {
    background-color: ${PRIMARY};
  }

  & .ant-tabs > .ant-tabs-nav .ant-tabs-nav-add {
    padding: 0;
    /* color: ${PRIMARY}; */
    margin: 0 20px;
    background: none;
    border: none;
  }

  & .ant-tabs .ant-tabs-nav-wrap {
    justify-content: ${p => p.tabsAlign};

    & > .ant-tabs-nav-list {
      flex: none;
    }
  }

  & .ant-carousel {
    height: 100%;
  }
`;
const MapWrapper = styled.div`
  width: 100%;
  height: 100%;
`;
const CarouselBoxWrap = styled(Carousel)`
  height: 100%;
  border: 1px red solid;

  & .slick-list {
    height: 100%;
  }
  & .slick-track {
    height: 100% !important;
  }
  & .slick-slide {
    height: 100%;
    div {
      width: 100%;
      height: 100%;
    }
  }
`;

const CarouselItemWrap = styled.div`
  border: 1px blue solid;
  height: 100%;
`;
