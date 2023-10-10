import React, { useState } from 'react';
import { Form, Modal } from 'antd';
import {
  FieldStringOutlined,
  FilterOutlined,
  SortDescendingOutlined,
} from '@ant-design/icons';
import { MODELS, useXFlowApp } from '@antv/xflow';
import styled from 'styled-components';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { TagAggregate, TagSelect } from '../../FieldItem';
import type { EntityCanvasModel } from '../interface';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

interface Props {
  visible: boolean;
  onOk: (value: any) => void;
  onCancel: () => void;
  sourceEntity?: EntityCanvasModel;
  targetEntity?: EntityCanvasModel;
}

const CreateAggregateModal = (props: Props) => {
  const { visible, sourceEntity, targetEntity, onOk, onCancel } = props;
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const t = useI18NPrefix(`view.editor.graphEditor.aggregate`);
  const handleOK = () => {
    form.validateFields().then(values => {
      setConfirmLoading(true);
      const cb = () => {
        setConfirmLoading(false);
      };
      onOk({ ...values, cb });
    });
  };

  const [selectedNodes, setSelectedNodes] = React.useState<any[]>([]);

  /** 监听画布中选中的节点 */
  const useWatchModelService = async () => {
    const appRef = useXFlowApp();
    const modelService = appRef && appRef?.modelService;
    if (modelService) {
      const model = await MODELS.SELECTED_NODES.getModel(modelService);
      model.watch(async () => {
        const nodes = await MODELS.SELECTED_NODES.useValue(modelService);
        setSelectedNodes(nodes);
      });
    }
  };

  useWatchModelService();

  const categories = [
    { key: 'aggregate', title: t('aggregate'), icon: <FieldStringOutlined /> },
    { key: 'filter', title: t('filter'), icon: <FilterOutlined /> },
    { key: 'complex', title: t('complex'), icon: <FieldStringOutlined /> },
    { key: 'sort', title: t('sort'), icon: <SortDescendingOutlined /> },
  ];

  let categorieMap = {};

  categories.forEach(c => {
    categorieMap = { ...categorieMap, [c.key]: c.title };
  });

  const formLayout = {
    labelCol: {},
    wrapperCol: {},
  };

  const mapOptions = () => {
    return selectedNodes.map(no => {
      return {
        label: no?.data?.entityId,
        children: no?.data?.properties.map(pro => ({
          key: pro.propertyId,
          table: no?.data?.entityId,
          column: pro.propertyId,
          type: pro.visualType,
          name: pro.propertyName,
        })),
      };
    });
  };

  return (
    <Modal
      title={t('title')}
      width={800}
      open={visible}
      confirmLoading={confirmLoading}
      wrapClassName="create-relation-container"
      okText={t('ok')}
      cancelText={t('cancel')}
      onOk={handleOK}
      onCancel={onCancel}
      mask={false}
      centered
      destroyOnClose={true}
    >
      <Form form={form}>
        <Form.Item
          {...formItemLayout}
          label={t('aggregate')}
          name={['query', 'aggregate']}
          rules={[
            {
              required: false,
              message: `${t('aggregate')}${t('message.notNull')}`,
            },
          ]}
        >
          <TagAggregate options={mapOptions()} />
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label={t('filter')}
          name={['query', 'filter']}
          rules={[
            {
              required: false,
              message: `${t('filter')}${t('message.notNull')}`,
            },
          ]}
        >
          <TagSelect options={mapOptions()} />
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label={t('complex')}
          name={['query', 'complex']}
          rules={[
            {
              required: false,
              message: `${t('complex')}${t('message.notNull')}`,
            },
          ]}
        >
          <TagAggregate options={mapOptions()} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const OptSpanWrapper = styled.span`
  margin-right: 6px;
`;

const ButtonWrapper = styled.div`
  display: flex;
`;

export default CreateAggregateModal;
