import { useMemo } from 'react';
import { Form } from 'antd';
import styled from 'styled-components';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import {
  TagAggregate,
  TagSelect,
  TagTable,
  TagTableRelation,
} from '../FieldItem';

export const ErForm = props => {
  const { loadData, filteredData } = props;
  const [form] = Form.useForm();
  const t = useI18NPrefix(`view.editor.graphEditor.aggregate`);

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 },
    },
  };

  const mapOptions = useMemo(() => {
    return () => [];
  }, []);

  return (
    <FromContainner>
      <Form form={form}>
        <Form.Item
          {...formItemLayout}
          label={t('tables')}
          name={['query', 'tables']}
          rules={[
            {
              required: false,
              message: `${t('aggregate')}${t('message.notNull')}`,
            },
          ]}
        >
          <TagTable loadData={loadData} filteredData={filteredData} />
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label={t('releation')}
          name={['query', 'releation']}
          rules={[
            {
              required: false,
              message: `${t('releation')}${t('message.notNull')}`,
            },
          ]}
        >
          <TagTableRelation loadData={loadData} filteredData={filteredData} />
        </Form.Item>
        {form.getFieldsValue(['query', 'tables']) && (
          <>
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
          </>
        )}
      </Form>
    </FromContainner>
  );
};

const FromContainner = styled.div`
  flex: 1;
  padding: 20px;
  background-color: ${p => p.theme.componentBackground};
`;
