import React, { useState } from 'react';
import { Divider, Radio, Select, Space } from 'antd';

const DropdownSelect = ({
  value = {},
  onChange,
  children,
  dropdownOptions = [],
  ...props
}) => {
  const [selected, setSelected] = useState({});
  const [currentRadio, setCurrentRadio] = useState('');
  const onRadioChange = e => {
    if (!e) {
      setCurrentRadio(e);
    }
  };
  const onSelectChange = (v, options) => {
    if (!currentRadio) {
    }
    if (!selected[currentRadio]) {
      selected[currentRadio] = [];
    }
    selected[currentRadio].push(v);
    setSelected(selected);
    onChange?.(selected);
  };

  const getDefaultValue = () => {
    const values: any = [];
    Object.keys(value).forEach(key => {
      value[key].forEach(v => values.push(v));
    });
  };

  return (
    <Select
      {...props}
      onChange={onSelectChange}
      dropdownRender={menu => (
        <React.Fragment>
          <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
            <Radio.Group size="small" onChange={onRadioChange}>
              <Space>
                {dropdownOptions.map(v => (
                  <Radio.Button value={v}>{v}</Radio.Button>
                ))}
              </Space>
            </Radio.Group>
          </div>
          <Divider style={{ margin: '4px 0' }} />
          {menu}
        </React.Fragment>
      )}
    >
      {children}
    </Select>
  );
};

export default DropdownSelect;
