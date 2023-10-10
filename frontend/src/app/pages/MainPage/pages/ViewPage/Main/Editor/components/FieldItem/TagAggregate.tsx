import React, { memo, useEffect, useState } from 'react';
import { Divider, Input, Radio, Select, Space, Tag, Tooltip } from 'antd';
import {
  AggregateFieldSubAggregateType,
  ChartDataSectionFieldActionType,
  DataViewFieldType,
} from 'app/constants';
import {
  CalendarOutlined,
  CloseOutlined,
  FieldNumberOutlined,
  FieldStringOutlined,
  PlusOutlined,
  SearchOutlined,
  TableOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import './index.less?inline';
import { AggregateTypes } from './types';

const { Option, OptGroup } = Select;

interface OptionField {
  table?: string;
  column?: string;
  type?: string;
}

interface SelectValue {
  key: string;
  option: string;
  field: OptionField;
}

interface SelectOption {
  label?: string;
  children?: OptionField[];
}

interface TagAggregateProps {
  value?: SelectValue[];
  onChange?: (value: SelectValue[]) => void;
  options: SelectOption[];
}

export const TagAggregate = memo((props: TagAggregateProps) => {
  const { options, onChange, value } = props;
  const [visible, setVisible] = useState(false);
  const [tags, setTags] = useState<SelectValue[]>(value || []);
  const [current, setCurrent] = useState('');
  const [search, setSearch] = useState('');
  const [editIndex, setEditIndex] = useState(-1);
  const [editValue, setEditValue] = useState<SelectValue>();
  const t = useI18NPrefix(`viz.common.enum.aggregateTypes`);
  const tagSelect = useI18NPrefix(`view.editor.graphEditor.tagAggregate`);

  const renderColumnType = type => {
    switch (type as DataViewFieldType) {
      case DataViewFieldType.STRING:
        return <FieldStringOutlined />;
      case DataViewFieldType.NUMERIC:
        return <FieldNumberOutlined />;
      case DataViewFieldType.DATE:
        return <CalendarOutlined />;
    }
  };

  const renderChildrenOptions = children => {
    return children
      .filter(item => current && AggregateTypes[current]?.includes(item?.type))
      .filter(
        item =>
          !search ||
          item.column.toLowerCase().includes(search.toLowerCase()) ||
          item.name.toLowerCase().includes(search.toLowerCase()),
      )
      .map(item => (
        <Option value={item.column} {...item}>
          <div>
            <OptSpanWrapper role="img" aria-label={item.column}>
              {renderColumnType(item?.type)}
            </OptSpanWrapper>
            {`${item.column} (${item.name})`}
          </div>
        </Option>
      ));
  };

  const renderOptions = () => {
    if (options && options.length && !options[0]?.label) {
      return renderChildrenOptions(options);
    }

    return options.map(op => {
      return (
        <OptGroup
          label={
            <div>
              <OptSpanWrapper>
                <TableOutlined />
              </OptSpanWrapper>
              {op.label}
            </div>
          }
        >
          {renderChildrenOptions(op.children)}
        </OptGroup>
      );
    });
  };

  const handleChange = (e, option) => {
    if (!current) {
      return;
    }
    setTags(tags => {
      const { type, table, column } = option;
      let newTags: SelectValue[] = [];
      if (editIndex === -1) {
        newTags = [
          ...tags,
          {
            key: `${current}_${table}_${column}`,
            option: current,
            field: { type, table, column },
          },
        ];
      } else {
        newTags = tags.fill(
          {
            key: `${current}_${table}_${column}`,
            option: current,
            field: { type, table, column },
          },
          editIndex,
          editIndex + 1,
        );
      }
      return newTags;
    });
    setVisible(false);
    setCurrent('');
    setSearch('');
    setEditIndex(-1);
    setEditValue(undefined);
  };

  const handleRadioChange = e => {
    setCurrent(e.target.value);
  };

  useEffect(() => {
    onChange?.(tags);
  }, [tags]);

  const tagClick = tag => {
    const newTags = tags.filter(tg => tg.key != tag.key);
    setTags(newTags);
  };

  const handleClose = () => {
    setVisible(false);
    setCurrent('');
    setSearch('');
  };

  return (
    <Wrapper>
      {tags.map((tag, index) => {
        if (editIndex === index) {
          return (
            <Select
              style={{ width: 500 }}
              onBlur={e => {
                setEditIndex(-1);
                setCurrent('');
                setEditValue(undefined);
              }}
              defaultValue={editValue?.field?.column}
              onChange={handleChange}
              placeholder={tagSelect('aggregateOption')}
              optionLabelProp="value"
              dropdownRender={menu => (
                <React.Fragment>
                  <div
                    style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}
                  >
                    <a
                      style={{
                        flex: 'none',
                        paddingRight: '8px',
                        display: 'block',
                        cursor: 'pointer',
                      }}
                      onClick={handleClose}
                    >
                      <CloseOutlined color="#000" /> {tagSelect('close')}
                    </a>
                    <Radio.Group
                      size="small"
                      onChange={handleRadioChange}
                      defaultValue={editValue?.option}
                    >
                      <Space>
                        {AggregateFieldSubAggregateType[
                          ChartDataSectionFieldActionType.Aggregate
                        ]?.map(agg => (
                          <Radio.Button value={agg}>{t(agg)}</Radio.Button>
                        ))}
                      </Space>
                    </Radio.Group>
                  </div>
                  {current ? (
                    <>
                      <Divider style={{ margin: '4px 0' }} />
                      {menu}
                    </>
                  ) : null}
                </React.Fragment>
              )}
            >
              {renderOptions()}
            </Select>
          );
        } else {
          return (
            <Tag
              className="edit-tag"
              key={index}
              closable={index !== -1}
              onClose={e => tagClick(tag)}
            >
              <span
                onDoubleClick={e => {
                  if (index !== -1) {
                    setEditIndex(index);
                    setCurrent(tag.option);
                    setEditValue(tag);
                    e.preventDefault();
                  }
                }}
              >
                {`${t(tag?.option)}: ${tag.field?.column}`}
              </span>
            </Tag>
          );
        }
      })}
      {visible && (
        <Select
          style={{ width: 500 }}
          onChange={handleChange}
          placeholder={tagSelect('aggregateOption')}
          optionLabelProp="value"
          dropdownRender={menu => (
            <React.Fragment>
              <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                <a
                  style={{
                    flex: 'none',
                    paddingRight: '8px',
                    display: 'block',
                    cursor: 'pointer',
                  }}
                  onClick={handleClose}
                >
                  <CloseOutlined color="#000" /> {tagSelect('close')}
                </a>

                <Radio.Group size="small" onChange={handleRadioChange}>
                  <Space>
                    {AggregateFieldSubAggregateType[
                      ChartDataSectionFieldActionType.Aggregate
                    ]?.map(agg => (
                      <Radio.Button value={agg}>{t(agg)}</Radio.Button>
                    ))}
                  </Space>
                </Radio.Group>
              </div>
              {current ? (
                <>
                  <Divider style={{ margin: '4px 0' }} />
                  <div
                    style={{ display: 'flex', flexWrap: 'nowrap', padding: 0 }}
                  >
                    <Input
                      bordered={false}
                      placeholder={tagSelect('search')}
                      suffix={
                        <Tooltip title="Extra information">
                          <SearchOutlined
                            style={{ color: 'rgba(0,0,0,.45)' }}
                          />
                        </Tooltip>
                      }
                      onChange={e => setSearch(e.target.value)}
                    />
                  </div>
                  <Divider style={{ margin: '4px 0' }} />
                  {menu}
                </>
              ) : null}
            </React.Fragment>
          )}
        >
          {renderOptions()}
        </Select>
      )}

      {!visible && (
        <Tag className="site-tag-plus" onClick={e => setVisible(true)}>
          <PlusOutlined /> {tagSelect('addTag')}
        </Tag>
      )}
    </Wrapper>
  );
});

const Wrapper = styled.div``;

const OptSpanWrapper = styled.span`
  margin-right: 6px;
`;
