import { useCallback } from 'react';
import { Empty, FormInstance } from 'antd';
import styled from 'styled-components';
import { SchemaTable } from 'app/pages/MainPage/pages/ViewPage/components/SchemaTable';
import { Schema } from 'app/pages/MainPage/pages/ViewPage/slice/types';

interface SchemaProps {
  form?: FormInstance;
  value?: Schema[];
  dataSource?: object[];
  onChange?: (val?: Schema[]) => void;
}

export function SchemaComponent({
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

  return value ? (
    <SchemaTable
      width={600}
      height={400}
      model={model}
      hierarchy={model}
      dataSource={dataSource}
      loading={false}
      hasCategory={false}
      pagination={false}
      hasFormat={false}
      onSchemaTypeChange={schemaTypeChange}
      bordered
    />
  ) : (
    <EmptyWrapper>
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
    </EmptyWrapper>
  );
}

const EmptyWrapper = styled.div`
  border: 1px solid ${p => p.theme.borderColorBase};
`;
