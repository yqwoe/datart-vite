import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form } from 'antd';
import { CommonFormTypes, DEFAULT_DEBOUNCE_WAIT } from 'globalConstants';
import classnames from 'classnames';
import styled from 'styled-components';
import { RootState } from 'types';
import { ErForm } from './components/ErForm';
import { selectDataProviderDatabaseListLoading } from 'app/pages/MainPage/slice/selectors';
import { getDataProviderDatabases } from 'app/pages/MainPage/slice/thunks';
import { useSearchAndExpand } from 'app/hooks/useSearchAndExpand';
import { request2 } from 'utils/request';
import { errorHandle } from 'utils/utils';
import { ViewStatus, ViewViewModelStages } from '../../constants';
import { EditorContext } from '../../EditorContext';
import { SaveFormContext } from '../../SaveFormContext';
import { useViewSlice } from '../../slice';
import {
  selectCurrentEditingViewAttr,
  selectDatabases,
} from '../../slice/selectors';
import { saveView } from '../../slice/thunks';
import { Table } from '../../slice/types';
import { isNewView } from '../../utils';
import './index.less?inline';

const SQL = require('app/utils/sql').default;

const CustomEditor = memo(({}) => {
  const { actions } = useViewSlice();
  const { showSaveForm } = useContext(SaveFormContext);
  const [form] = Form.useForm();
  const config = useSelector(state =>
    selectCurrentEditingViewAttr(state, { name: 'config' }),
  );

  const id = useSelector(state =>
    selectCurrentEditingViewAttr(state, { name: 'id' }),
  ) as string;

  const stage = useSelector(state =>
    selectCurrentEditingViewAttr(state, { name: 'stage' }),
  );

  const status = useSelector(state =>
    selectCurrentEditingViewAttr(state, { name: 'status' }),
  );
  const {
    editorInstance,
    editorCompletionItemProviderRef,
    setEditor,
    initActions,
  } = useContext(EditorContext);
  const [skipsDiagramUpdate, setSkipsDiagramUpdate] = useState(false);
  const dispatch = useDispatch();

  const run = useCallback(() => {
    // const fragment = editorInstance
    //   ?.getModel()
    //   ?.getValueInRange(editorInstance.getSelection());
    // dispatch(runSql({ id, isFragment: true }));
  }, [dispatch, id, editorInstance]);

  const save = useCallback(
    (resolve?) => {
      dispatch(saveView({ resolve }));
    },
    [dispatch],
  );

  useEffect(() => {
    editorInstance?.layout();
    return () => {
      editorInstance?.dispose();
    };
  }, [editorInstance]);

  const callSave = useCallback(() => {
    if (
      status !== ViewStatus.Archived &&
      stage === ViewViewModelStages.Saveable
    ) {
      if (isNewView(id)) {
        showSaveForm({
          type: CommonFormTypes.Edit,
          visible: true,
          parentIdLabel: '目录',
          onSave: (values, onClose) => {
            dispatch(
              actions.changeCurrentEditingView({
                ...values,
                parentId: values.parentId || null,
              }),
            );
            save(onClose);
          },
        });
      } else {
        save();
      }
    }
  }, [dispatch, actions, stage, status, id, save, showSaveForm]);

  useEffect(() => {
    initActions({ onRun: run, onSave: callSave });
  }, [initActions, run, callSave]);

  const sourceId = useSelector<RootState>(state =>
    selectCurrentEditingViewAttr(state, { name: 'sourceId' }),
  ) as string;
  const databases = useSelector(state =>
    selectDatabases(state, { name: sourceId }),
  );

  const databaseListLoading = useSelector(
    selectDataProviderDatabaseListLoading,
  );

  const { filteredData, onExpand, debouncedSearch, expandedRowKeys } =
    useSearchAndExpand(
      databases,
      (keywords, data) => (data.title as string).includes(keywords),
      DEFAULT_DEBOUNCE_WAIT,
      true,
    );
  useEffect(() => {
    if (sourceId && !databases) {
      dispatch(getDataProviderDatabases(sourceId));
    }
  }, [dispatch, sourceId, databases]);

  const loadData = useCallback(
    ({ value }) =>
      new Promise<void>((resolve, reject) => {
        try {
          const [database, table] = value;
          if (!table) {
            request2<Table[]>(
              `/data-provider/${sourceId}/${database}/tableInfos`,
            ).then(({ data }) => {
              dispatch(
                actions.addTables({
                  sourceId,
                  databaseName: database,
                  tables: data.sort((a, b) =>
                    a?.name?.toLowerCase() < b?.name?.toLowerCase()
                      ? -1
                      : a?.name?.toLowerCase() > b?.name?.toLowerCase()
                      ? 1
                      : 0,
                  ),
                }),
              );
              resolve();
            });
          }
        } catch (error) {
          errorHandle(error);
          reject();
        }
      }),
    [dispatch, sourceId, actions],
  );
  return (
    <EditorWrapper
      className={classnames({
        archived: status === ViewStatus.Archived,
      })}
    >
      <ErForm loadData={loadData} filteredData={filteredData} />
    </EditorWrapper>
  );
});

const EditorWrapper = styled.div`
  position: relative;
  flex: 1;
  min-height: 0;

  &.archived {
    .view-lines {
      * {
        color: ${p => p.theme.textColorDisabled};
      }
    }
  }
`;

export default CustomEditor;
