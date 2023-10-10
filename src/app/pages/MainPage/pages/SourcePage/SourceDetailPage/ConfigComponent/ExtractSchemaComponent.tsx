import { useCallback, useState } from 'react';
import { Button, FormInstance, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { SchemaTable } from 'app/pages/MainPage/pages/ViewPage/components/SchemaTable';
import { Schema } from 'app/pages/MainPage/pages/ViewPage/slice/types';
import useI18NPrefix from 'app/hooks/useI18NPrefix';

interface SchemaProps {
  form?: FormInstance;
  value?: Schema[];
  dataSource?: object[];
  onChange?: (val?: Schema[]) => void;
}

export function ExtractSchemaComponent({
  form,
  value,
  dataSource,
  onChange,
}: SchemaProps) {
  const model = value
    ? value.reduce((m, c) => {
        m[c.name] = c;
        return m;
      }, {})
    : {};

  const schemaTypeChange = useCallback(
    name => keyPath => {
      onChange &&
        onChange(
          value?.map(v => (v.name === name ? { ...v, type: keyPath[0] } : v)),
        );
    },
    [value, onChange],
  );

  const [column, setColumn] = useState('');

  const t = useI18NPrefix('global');
  const ts = useI18NPrefix('source');

  const addColumn = useCallback(() => {
    const cols = Array.from(new Set(column.split(',')));
    const columns = cols.map(col => ({
      name: col,
      type: 'STRING',
      primaryKey: false,
      category: 'UNCATEGORIZED',
    }));
    form?.setFieldsValue({ config: { columns } });
    setColumn('');
  }, [form, column, value]);

  return (
    <EmptyWrapper>
      <LineWrapper>
        <Input.TextArea
          placeholder={ts('form.tableColumns')}
          allowClear
          onChange={e => {
            setColumn(e.target.value);
          }}
        />
        <Button type="text" icon={<PlusOutlined />} onClick={addColumn}>
          {t('button.add')}
        </Button>
      </LineWrapper>
      <SchemaTable
        hierarchy={model}
        width={600}
        height={400}
        model={model}
        dataSource={dataSource}
        loading={false}
        hasCategory={false}
        pagination={false}
        onSchemaTypeChange={schemaTypeChange}
        bordered
      />
    </EmptyWrapper>
  );
}

const EmptyWrapper = styled.div``;

const LineWrapper = styled.div`
  display: flex;
  align-items: center;
`;
