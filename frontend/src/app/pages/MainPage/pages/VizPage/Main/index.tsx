import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Dropdown, Menu } from 'antd';
import { EmptyFiller, TabPane, Tabs } from 'app/components';
import { LEVEL_1 } from 'styles/StyleConstants';
import { CloseOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { selectOrgId } from 'app/pages/MainPage/slice/selectors';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { dispatchResize } from 'app/utils/dispatchResize';
import { useVizSlice } from '../slice';
import {
  selectArchivedDashboards,
  selectArchivedDatacharts,
  selectArchivedStoryboards,
  selectSelectedTab,
  selectStoryboards,
  selectTabs,
  selectVizs,
} from '../slice/selectors';
import { closeAllTabs, closeOtherTabs, removeTab } from '../slice/thunks';
import { ArchivedViz, Folder, Storyboard } from '../slice/types';
import { VizContainer } from './VizContainer';

export function Main({ sliderVisible }: { sliderVisible: boolean }) {
  const { actions } = useVizSlice();
  const dispatch = useDispatch();
  const history = useNavigate();
  const { vizId } = useParams<{ vizId: string }>();
  const location = useLocation();
  const vizs = useSelector(selectVizs);
  const storyboards = useSelector(selectStoryboards);
  const archivedDatacharts = useSelector(selectArchivedDatacharts);
  const archivedDashboards = useSelector(selectArchivedDashboards);
  const archivedStoryboards = useSelector(selectArchivedStoryboards);
  const tabs = useSelector(selectTabs);
  const selectedTab = useSelector(selectSelectedTab);
  const orgId = useSelector(selectOrgId);

  const t = useI18NPrefix('viz.main');

  useEffect(() => {
    if (vizId) {
      const viz =
        vizs.find(v => v.relId === vizId) ||
        storyboards.find(({ id }) => id === vizId) ||
        archivedDatacharts.find(({ id }) => id === vizId) ||
        archivedDashboards.find(({ id }) => id === vizId) ||
        archivedStoryboards.find(({ id }) => id === vizId);
      if (viz) {
        if ((viz as ArchivedViz).vizType) {
          const { id, name, vizType } = viz as ArchivedViz;
          dispatch(
            actions.addTab({
              id,
              type: vizType,
              name,
              search: location.search,
              parentId: null,
            }),
          );
        }
        if ((viz as Folder).relType) {
          const { id, name, relId, relType, parentId } = viz as Folder;
          dispatch(
            actions.addTab({
              id: relId,
              type: relType,
              name,
              search: location.search,
              parentId,
              permissionId: id,
            }),
          );
        } else {
          const { id, name } = viz as Storyboard;
          dispatch(
            actions.addTab({
              id,
              type: 'STORYBOARD',
              name,
              search: location.search,
              parentId: null,
            }),
          );
        }
      }
    }
  }, [
    dispatch,
    location,
    actions,
    vizs,
    storyboards,
    archivedDatacharts,
    archivedDashboards,
    archivedStoryboards,
    vizId,
  ]);

  useEffect(() => {
    if (selectedTab && !vizId) {
      history(`/organizations/${orgId}/vizs/${selectedTab.id}`);
    }
  }, [history, selectedTab, orgId, vizId]);

  const tabChange = useCallback(
    activeKey => {
      const activeTab = tabs.find(v => v.id === activeKey);
      if (activeTab) {
        history(
          `/organizations/${orgId}/vizs/${activeKey}${activeTab.search || ''}`,
        );
      }
      setTimeout(() => {
        dispatchResize();
      }, 500);
    },
    [history, orgId, tabs],
  );

  const tabEdit = useCallback(
    (targetKey, action) => {
      switch (action) {
        case 'remove':
          dispatch(
            removeTab({
              id: targetKey,
              resolve: activeKey => {
                const activeTab = tabs.find(v => v.id === activeKey);
                if (activeTab) {
                  history(
                    `/organizations/${orgId}/vizs/${activeKey}${
                      activeTab.search || ''
                    }`,
                  );
                } else {
                  history(`/organizations/${orgId}/vizs`);
                }
              },
            }),
          );
          break;
        default:
          break;
      }
    },
    [dispatch, history, orgId, tabs],
  );

  const handleClickMenu = (e: any, id: string) => {
    e.domEvent.stopPropagation();
    if (e.key === 'CLOSE_ALL') {
      dispatch(
        closeAllTabs({
          resolve() {
            history(`/organizations/${orgId}/vizs`);
          },
        }),
      );
      return;
    }
    dispatch(
      closeOtherTabs({
        id,
        resolve: activeKey => {
          const activeTab = tabs.find(v => v.id === activeKey);
          if (activeTab) {
            history(
              `/organizations/${orgId}/vizs/${activeKey}${
                activeTab.search || ''
              }`,
            );
          } else {
            history(`/organizations/${orgId}/vizs`);
          }
        },
      }),
    );
  };

  const menu = (id: string) => ({
    items: [
      {
        key: 'CLOSE_OTHER',
        label: <span>{t('closeOther')}</span>,
      },
      {
        key: 'CLOSE_ALL',
        label: <span>{t('closeAll')}</span>,
      },
    ],
    onClick: e => handleClickMenu(e, id),
  });

  const Tab = (id: string, name: string) => (
    <span>
      <Dropdown menu={menu(id)} trigger={['contextMenu']}>
        <span className="ant-dropdown-link">{name}</span>
      </Dropdown>
    </span>
  );

  return (
    <Wrapper className={sliderVisible ? 'close datart-viz' : 'datart-viz'}>
      <TabsWrapper>
        <Tabs
          hideAdd
          mode="dashboard"
          type="editable-card"
          activeKey={selectedTab?.id}
          onChange={tabChange}
          onEdit={tabEdit}
          items={tabs.map(({ id, name }) => ({
            key: id,
            label: Tab(id, name),
            closeIcon: (
              <CloseIconWrapper>
                <CloseOutlined />
              </CloseIconWrapper>
            ),
          }))}
        />
      </TabsWrapper>
      {tabs.map(tab => (
        <VizContainer
          key={tab.id}
          tab={tab}
          orgId={orgId}
          vizs={vizs}
          selectedId={selectedTab?.id}
        />
      ))}
      {!tabs.length && <EmptyFiller title={t('empty')} />}
      <Outlet />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  &.close {
    width: calc(100% - 30px) !important;
    min-width: calc(100% - 30px) !important;
    padding-left: 30px;
  }
`;

const TabsWrapper = styled.div`
  z-index: ${LEVEL_1};
  flex-shrink: 0;
`;

const CloseIconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 12px;
`;
