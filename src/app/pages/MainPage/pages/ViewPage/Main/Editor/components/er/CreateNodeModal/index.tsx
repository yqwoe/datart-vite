import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Modal, Radio, Tooltip, TreeSelect } from 'antd';
import { DataViewFieldType } from 'app/constants';
import { DEFAULT_DEBOUNCE_WAIT } from 'globalConstants';
import {
  CalendarOutlined,
  DatabaseOutlined,
  FieldNumberOutlined,
  FieldStringOutlined,
  TableOutlined,
} from '@ant-design/icons';
import map from 'lodash/map';
import { RootState } from 'types';
import { useViewSlice } from 'app/pages/MainPage/pages/ViewPage/slice';
import {
  selectCurrentEditingViewAttr,
  selectDatabases,
} from 'app/pages/MainPage/pages/ViewPage/slice/selectors';
import { Schema, Table } from 'app/pages/MainPage/pages/ViewPage/slice/types';
import { selectDataProviderDatabaseListLoading } from 'app/pages/MainPage/slice/selectors';
import { getDataProviderDatabases } from 'app/pages/MainPage/slice/thunks';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { useSearchAndExpand } from 'app/hooks/useSearchAndExpand';
import { request2 } from 'utils/request';
import { errorHandle } from 'utils/utils';
import { EntityType } from '../const';
import './index.less?inline';

const formItemLayout = {
  // labelCol: {
  //   xs: { span: 24 },
  //   sm: { span: 6 },
  // },
  // wrapperCol: {
  //   xs: { span: 24 },
  //   sm: { span: 16 },
  // },
};

interface Props {
  visible: boolean;
  onOk: Function;
  onCancel: Function;
}
const { TreeNode } = TreeSelect;
/** 创建模型弹窗 */
const CreateEntityModal = (props: Props) => {
  const { actions } = useViewSlice();
  const dispatch = useDispatch();
  const { visible, onOk, onCancel } = props;
  const [confirmLoading, setConfirmLoading] = React.useState<boolean>(false);
  const [currentEntityType, setCurrentEntityType] = React.useState<EntityType>(
    EntityType.FACT,
  );
  const [form] = Form.useForm();
  const t = useI18NPrefix(`view.editor.graphEditor.node`);
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

  useEffect(() => {
    form.resetFields();
    // dispatch(getDataProviderDatabases(sourceId));
  }, [visible]);

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
  const { properties, database, table } = form.getFieldsValue();
  const hanldeOk = () => {
    form.validateFields().then(values => {
      const callback = (result: any) => {
        setConfirmLoading(false);
        if (result) {
          onCancel();
        }
      };
      setConfirmLoading(true);
      onOk({
        ...values,
        cb: callback,
      });
    });
  };

  const renderIcon = useCallback(
    ({ value }) => {
      if (Array.isArray(value)) {
        switch (value.length) {
          case 1:
            return <DatabaseOutlined />;
          case 2:
            return <TableOutlined />;
        }
      } else {
        switch (value.type as DataViewFieldType) {
          case DataViewFieldType.STRING:
            return <FieldStringOutlined />;
          case DataViewFieldType.NUMERIC:
            return <FieldNumberOutlined />;
          case DataViewFieldType.DATE:
            return <CalendarOutlined />;
        }
      }
    },
    [filteredData],
  );

  const renderNode = useCallback(
    (data, isLeaf = false) => {
      return (
        data &&
        data.map((ele, index) => (
          <TreeNode
            value={ele?.value}
            title={`${ele?.title}`}
            // key={ele?.key}
            isLeaf={isLeaf}
            icon={renderIcon}
          >
            <Tooltip
              placement="topLeft"
              title={`${ele?.comment ? `-(${ele?.comment})` : ''}`}
              arrowPointAtCenter
            >
              {ele?.children &&
                ele?.children.length &&
                renderNode(ele.children, true)}
            </Tooltip>
          </TreeNode>
        ))
      );
    },
    [filteredData],
  );

  const handleTableChange = value => {
    const [database, table] = value || [null, null];
    form.setFieldsValue({ database, table });
    if (table) {
      request2<Schema[]>(
        `/data-provider/${sourceId}/${database}/${table}/columns`,
      ).then(({ data }) => {
        form.setFieldsValue({
          properties: data.sort(
            (a, b) => Number(b.primaryKey) - Number(a.primaryKey),
          ),
        });
      });
    }
  };

  return (
    <Modal
      title={t('title')}
      open={visible}
      confirmLoading={confirmLoading}
      wrapClassName="create-entity-container"
      okText={t('ok')}
      cancelText={t('cancel')}
      onOk={hanldeOk}
      onCancel={() => onCancel()}
      mask={false}
      centered
      destroyOnClose={true}
    >
      <Form form={form}>
        <Form.Item
          {...formItemLayout}
          name="entityType"
          label={t('entity.type')}
          rules={[{ required: true }]}
          initialValue={currentEntityType}
        >
          <Radio.Group>
            {map(EntityType, (type: EntityType) => {
              return (
                <Radio value={type} key={type}>
                  {t(`entity.${type}`)}
                </Radio>
              );
            })}
          </Radio.Group>
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          name="table"
          label={t('entity.table')}
          rules={[
            {
              required: true,
              message: `${t('entity.table')}${t('message.notNull')}`,
            },
          ]}
        >
          <TreeSelect
            treeDataSimpleMode
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder={t('title')}
            showSearch
            loadData={loadData}
            onChange={handleTableChange}
            treeNodeFilterProp="title"
            treeDefaultExpandAll
            treeIcon
          >
            {renderNode(filteredData)}
          </TreeSelect>
        </Form.Item>
        <Form.Item name="properties" hidden />
        <Form.Item name="database" hidden />
      </Form>
    </Modal>
  );
};

export default CreateEntityModal;
