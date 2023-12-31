import React, { useState } from 'react';
import { Form, Input, Modal, Select } from 'antd';
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

const CreateRelationModal = (props: Props) => {
  const { visible, sourceEntity, targetEntity, onOk, onCancel } = props;
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  const handleOK = () => {
    form.validateFields().then(values => {
      setConfirmLoading(true);
      const cb = () => {
        setConfirmLoading(false);
      };
      onOk({ ...values, cb });
    });
  };

  return (
    <Modal
      title="关联模型"
      open={visible}
      confirmLoading={confirmLoading}
      wrapClassName="create-relation-container"
      okText="确定"
      cancelText="取消"
      onOk={handleOK}
      onCancel={onCancel}
      mask={false}
      centered
      destroyOnClose={true}
    >
      <Form form={form}>
        <Form.Item
          {...formItemLayout}
          name="source"
          label="主表"
          rules={[{ required: true }]}
          initialValue={sourceEntity?.entityId}
          // hidden
        >
          <Input readOnly />
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          name="target"
          label="附表"
          rules={[{ required: true }]}
          initialValue={targetEntity?.entityId}
          // hidden
        >
          <Input readOnly />
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          name="relationType"
          label="关联关系"
          rules={[{ required: true }]}
          initialValue={'N:1'}
        >
          <Select placeholder="请选择关联关系">
            <Select.Option value="N:1">多对一</Select.Option>
            <Select.Option value="1:N">一对多</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateRelationModal;
