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
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import ChartManager from 'app/models/ChartManager';
import { useAppSlice } from 'app/slice';
import styled from 'styled-components';
import ChartEditor, { ChartEditorBaseProps } from 'app/components/ChartEditor';
import BoardEditor from '../DashBoardPage/pages/BoardEditor';
import { ConfirmInvitePage } from './pages/ConfirmInvitePage';
import { ExtractPage } from './pages/ExtractPage';
import { ExtractMain } from './pages/ExtractPage/Main';
import { MemberPage } from './pages/MemberPage';
import { MemberDetailPage } from './pages/MemberPage/pages/MemberDetailPage';
import { RoleDetailPage } from './pages/MemberPage/pages/RoleDetailPage';
import { OrgSettingPage } from './pages/OrgSettingPage';
import { PermissionPage } from './pages/PermissionPage';
import { ResourceTypes } from './pages/PermissionPage/constants';
import { Main as PermissionMain } from './pages/PermissionPage/Main';
import { ResourceMigrationPage } from './pages/ResourceMigrationPage';
import { SchedulePage } from './pages/SchedulePage';
import { EditorPage } from './pages/SchedulePage/EditorPage';
import { SourcePage } from './pages/SourcePage';
import { SourceDetailPage } from './pages/SourcePage/SourceDetailPage';
import { VariablePage } from './pages/VariablePage';
import { ViewPage } from './pages/ViewPage';
import { useViewSlice } from './pages/ViewPage/slice';
import { VizPage } from './pages/VizPage';
import { useVizSlice } from './pages/VizPage/slice';
import { initChartPreviewData } from './pages/VizPage/slice/thunks';
import useMount from 'app/hooks/useMount';
import { NotFoundPage } from '../NotFoundPage';
import { StoryEditor } from '../StoryBoardPage/Editor';
import { StoryPlayer } from '../StoryBoardPage/Player';
import { AccessRoute } from './AccessRoute';
import { Background } from './Background';
import { Navbar } from './Navbar';
import { useMainSlice } from './slice';
import { selectOrgId } from './slice/selectors';
import {
  getDataProviders,
  getLoggedInUserPermissions,
  getUserSettings,
} from './slice/thunks';

export function MainPage() {
  useAppSlice();
  const { actions } = useMainSlice();
  const { actions: vizActions } = useVizSlice();
  const { actions: viewActions } = useViewSlice();
  const dispatch = useDispatch();
  const organizationMatch = useParams();
  const orgId = useSelector(selectOrgId);
  const history = useNavigate();

  // loaded first time

  useMount(
    () => {
      ChartManager.instance()
        .load()
        .catch(err =>
          console.error('Fail to load customize charts with ', err),
        );
      dispatch(getUserSettings(organizationMatch?.orgId));
      dispatch(getDataProviders());
    },
    () => {
      dispatch(actions.clear());
    },
  );

  useEffect(() => {
    if (orgId) {
      dispatch(vizActions.clear());
      dispatch(viewActions.clear());
      dispatch(getLoggedInUserPermissions(orgId));
    }
  }, [dispatch, vizActions, viewActions, orgId]);

  const onSaveInDataChart = useCallback(
    (orgId: string, backendChartId: string) => {
      dispatch(
        initChartPreviewData({
          backendChartId,
          orgId,
        }),
      );
      history(`/organizations/${orgId}/vizs/${backendChartId}`);
    },
    [dispatch, history],
  );

  const ChartEditorRoute = res => {
    const location = useLocation();
    const hisSearch = new URLSearchParams(location.search);
    const hisState = {
      dataChartId: hisSearch.get('dataChartId') || '',
      chartType: hisSearch.get('chartType') || 'dataChart',
      container: hisSearch.get('container') || 'dataChart',
      defaultViewId: hisSearch.get('defaultViewId') || '',
    } as ChartEditorBaseProps;
    return (
      <AccessRoute module={ResourceTypes.Viz} key="chart-editor">
        <ChartEditor
          dataChartId={hisState.dataChartId}
          orgId={orgId}
          chartType={hisState.chartType}
          container={hisState.container}
          defaultViewId={hisState.defaultViewId}
          onClose={() => history(-1)}
          onSaveInDataChart={onSaveInDataChart}
        />
      </AccessRoute>
    );
  };

  const BoardEditorRoute = () => {
    const { vizId } = useParams();
    console.log(vizId);
    return <BoardEditor boardId={vizId} />;
  };

  return (
    <AppContainer>
      <Background />
      <Navbar />
      {orgId && (
        <Routes>
          <Route
            path="/"
            element={<Navigate to={`/organizations/${orgId}`} />}
          />
          <Route path="/confirminvite" element={<ConfirmInvitePage />} />
          <Route
            path="/organizations/:orgId"
            element={<Navigate to={`/organizations/${orgId}/vizs`} />}
          />

          <Route path="/organizations/:orgId/vizs">
            <Route path="chartEditor" element={<ChartEditorRoute />} />

            <Route path="storyPlayer/:storyId" element={<StoryPlayer />} />

            <Route path="storyEditor/:storyId" element={<StoryEditor />} />
            <Route
              path=":vizId?"
              element={
                <AccessRoute module={ResourceTypes.Viz} key="viz-show">
                  <VizPage />
                </AccessRoute>
              }
            >
              <Route path="boardEditor" element={<BoardEditorRoute />} />
            </Route>
          </Route>

          <Route
            path="/organizations/:orgId/views/:viewId?"
            element={
              <AccessRoute module={ResourceTypes.View} key="view-show">
                <ViewPage />
              </AccessRoute>
            }
          />
          <Route
            path="/organizations/:orgId/sources"
            element={
              <AccessRoute module={ResourceTypes.Source} key="sources">
                <SourcePage />
              </AccessRoute>
            }
          >
            <Route path=":sourceId" element={<SourceDetailPage />} />
          </Route>
          <Route
            path="/organizations/:orgId/schedules"
            element={
              <AccessRoute module={ResourceTypes.Schedule} key="schedules">
                <SchedulePage />
              </AccessRoute>
            }
          >
            <Route path=":scheduleId" element={<EditorPage />} />
          </Route>
          <Route
            path="/organizations/:orgId/members"
            element={
              <AccessRoute module={ResourceTypes.User} key="members">
                <MemberPage />
              </AccessRoute>
            }
          >
            <Route path=":memberId" element={<MemberDetailPage />} />
          </Route>
          <Route
            path="/organizations/:orgId/roles"
            element={
              <AccessRoute module={ResourceTypes.User} key="roles">
                <MemberPage />
              </AccessRoute>
            }
          >
            <Route path=":roleId" element={<RoleDetailPage />} />
          </Route>
          <Route
            path="/organizations/:orgId/permissions"
            element={
              <Navigate to={`/organizations/${orgId}/permissions/subject`} />
            }
          ></Route>

          <Route
            path="/organizations/:orgId/permissions/:viewpoint"
            element={
              <AccessRoute module={ResourceTypes.Manager} key="permissions">
                <PermissionPage />
              </AccessRoute>
            }
          >
            <Route path=":type/:id" element={<PermissionMain />} />
          </Route>
          <Route
            path="/organizations/:orgId/variables"
            element={
              <AccessRoute module={ResourceTypes.Manager} key="variables">
                <VariablePage />
              </AccessRoute>
            }
          />
          <Route
            path="/organizations/:orgId/orgSettings"
            element={
              <AccessRoute module={ResourceTypes.Manager} key="orgSettings">
                <OrgSettingPage />
              </AccessRoute>
            }
          />
          <Route
            path="/organizations/:orgId/resourceMigration"
            element={
              <AccessRoute
                module={ResourceTypes.Manager}
                key="resourceMigration"
              >
                <ResourceMigrationPage />
              </AccessRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      )}
    </AppContainer>
  );
}

const AppContainer = styled.main`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  background-color: ${p => p.theme.bodyBackground};
`;
