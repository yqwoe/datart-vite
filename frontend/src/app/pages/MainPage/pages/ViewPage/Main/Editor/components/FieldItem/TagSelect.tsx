import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  AutoComplete,
  Button,
  Divider,
  Input,
  List,
  Popover,
  Radio,
  Select,
  Tag,
  Tooltip,
} from 'antd';
import { DataViewFieldType } from 'app/constants';
import {
  FONT_SIZE_SUBTITLE,
  FONT_WEIGHT_MEDIUM,
  SPACE,
  SPACE_SM,
  SPACE_TIMES,
} from 'styles/StyleConstants';
import {
  CalendarOutlined,
  FieldNumberOutlined,
  FieldStringOutlined,
  LeftOutlined,
  PlusOutlined,
  SearchOutlined,
  TableOutlined,
} from '@ant-design/icons';
import values from 'lodash/values';
import styled from 'styled-components';
import { selectVariables } from 'app/pages/MainPage/pages/VariablePage/slice/selectors';
import { Variable } from 'app/pages/MainPage/pages/VariablePage/slice/types';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { selectCurrentEditingViewAttr } from '../../../../slice/selectors';
import { VariableHierarchy } from '../../../../slice/types';
import './index.less?inline';
import { FilterTypes } from './types';

const { Item } = List;

const { Option, OptGroup } = Select;

interface OptionField {
  table?: string;
  column?: string;
  type?: string;
  name?: string;
}

interface SelectValue {
  key: string;
  option: string;
  variable: VariableHierarchy | Variable | any;
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

const mockVal = (str: string, repeat = 1) => ({
  value: str.repeat(repeat),
});

export const TagSelect = memo((props: TagAggregateProps) => {
  const { options, onChange, value } = props;
  const [visible, setVisible] = useState(false);
  const [tags, setTags] = useState<SelectValue[]>(value || []);
  const variables = useSelector(state =>
    selectCurrentEditingViewAttr(state, { name: 'variables' }),
  ) as VariableHierarchy[];

  const publicVariables = useSelector(selectVariables);
  const [current, setCurrent] = useState<string>();
  const [field, setField] = useState<OptionField>();
  const [variable, setVariable] = useState<
    VariableHierarchy | Variable | any
  >();
  const [variableOptions, setVariableOptions] = useState<
    Array<VariableHierarchy | Variable | any>
  >([]);
  const [editIndex, setEditIndex] = useState(-1);
  const [active, setActive] = useState(-1);
  const [search, setSearch] = useState('');
  const t = useI18NPrefix(`viz.common.enum.aggregateTypes`);
  const tagSelect = useI18NPrefix(`view.editor.graphEditor.tagSelect`);

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
    return children.map(item => (
      <Option value={item.column} {...item} disabled={!current}>
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

  const renderListItems = () => {
    const items: any = [];
    options.forEach(op => {
      items.push(
        <ItemWrapper className="title">
          <TableOutlined />
          <span>{op.label}</span>
        </ItemWrapper>,
      );

      op.children
        ?.filter(
          child =>
            !search ||
            child.column
              ?.toLocaleLowerCase()
              .includes(search.toLocaleLowerCase()),
        )
        .forEach((child, index) => {
          items.push(
            <ItemWrapper
              onClick={e => {
                setField(child);
              }}
              className={`item ${active === index ? 'item-active' : ''}`}
              onMouseOver={e => setActive(index)}
              onMouseOut={e => setActive(-1)}
            >
              {renderColumnType(child?.type)}
              <span> {`${child?.column} (${child?.name})`}</span>
            </ItemWrapper>,
          );
        });
    });
    return items;
  };

  const handleChange = (e, option) => {
    if (!current) {
      return;
    }
    // const { type, table, column } = option
    // const newTags = [...tags, { key: `${current}_${table}_${column}`, option: current, field: { type, table, column } }];
    // setTags(newTags);
    // setVisible(false);
    // setCurrent('');
  };

  useEffect(() => {
    onChange?.(tags);
  }, [tags]);

  const handleRadioChange = e => {
    setCurrent(e.target.value);
  };

  const tagClick = tag => {
    setTags(tags.filter(tg => tg.key !== tag.key));
  };

  useEffect(() => {
    const vars = ([] as Array<VariableHierarchy | Variable>)
      .concat(variables)
      .concat(publicVariables);
    setVariableOptions(vars);
  }, [variables, publicVariables]);

  const handleCurrentChange = useCallback(
    (value, option) => {
      setCurrent(value);
    },
    [visible],
  );
  const handleCurrentBack = useCallback(() => {
    setCurrent('');
  }, [current]);

  const handleFieldChange = useCallback(
    (value, option) => {
      setField({ ...option });
    },
    [current],
  );

  const handleFieldBack = useCallback(() => {
    setField(undefined);
  }, [variable]);

  const handleVariableChange = useCallback(
    (value, option) => {
      setVariable({ ...option });
    },
    [current],
  );

  const handleVariableSearch = useCallback(
    value => {
      setVariableOptions(
        !value ? [] : [{ label: value, value }, ...variableOptions],
      );
    },
    [current],
  );

  const handleAddTag = useCallback(
    (value, option) => {
      setVariable({ ...option });
    },
    [current],
  );

  const handleCreateTag = useCallback(() => {
    if (current && field && variable) {
      const newTags: SelectValue[] = [
        ...tags,
        {
          key: `${current}_${field?.table}_${field?.column}`,
          option: current,
          field: field,
          variable,
        },
      ];
      setTags(newTags);
      setCurrent('');
      setField(undefined);
      setVariable(undefined);
      setVisible(false);
    }
  }, [current, field, variable]);

  const stepRender = useMemo((): JSX.Element => {
    if (!field) {
      return (
        <ContentWrapper>
          <Input
            placeholder={tagSelect('search')}
            suffix={
              <Tooltip title="Extra information">
                <SearchOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
              </Tooltip>
            }
            onChange={e => setSearch(e.target.value)}
          />
          <ListContainer>
            <List>{renderListItems()}</List>
          </ListContainer>
        </ContentWrapper>
      );
    }
    if (field) {
      return (
        <ContentWrapper>
          <Header>
            <div className="title" onClick={handleFieldBack}>
              <LeftOutlined />
              {field?.table} - {field?.column}
            </div>
            <Select
              style={{ width: 200 }}
              placeholder={tagSelect('filterOption')}
              onChange={handleCurrentChange}
              dropdownStyle={{ width: 500 }}
            >
              {FilterTypes[field?.type as DataViewFieldType]?.map(agg => (
                <Select.Option value={agg}>{tagSelect(agg)}</Select.Option>
              ))}
            </Select>
          </Header>
          <Divider style={{ margin: '10px 0' }} />
          <AutoComplete
            placeholder={tagSelect('placeholder')}
            style={{ width: '100%' }}
            onSelect={handleVariableChange}
            onSearch={handleVariableSearch}
            options={variableOptions?.map(agg => ({
              label: agg.name,
              value: agg.name,
              ...agg,
            }))}
          >
            {/* <Input.Search size="large" placeholder="input here" enterButton /> */}
          </AutoComplete>
          <Divider style={{ margin: '10px 0' }} />
          <Button
            type="primary"
            disabled={!current && !variable}
            onClick={handleCreateTag}
          >
            添加过滤
          </Button>
        </ContentWrapper>
      );
    }
    return <>{tagSelect('tooltip')}</>;
  }, [options, search, active, field, variable, current, variableOptions]);

  return (
    <Wrapper>
      {tags.map((tag, index) => {
        if (editIndex === index) {
          return (
            <Select
              style={{ width: 500 }}
              autoFocus
              onBlur={e => setEditIndex(-1)}
              onChange={handleChange}
              optionLabelProp="value"
              dropdownRender={menu => (
                <React.Fragment>
                  <div
                    style={{ display: 'flex', flexWrap: 'nowrap', padding: 2 }}
                  >
                    <Radio.Group onChange={handleRadioChange}>
                      {FilterTypes[field?.type as DataViewFieldType]?.map(
                        agg => (
                          <Radio.Button value={agg}>
                            {tagSelect(agg)}
                          </Radio.Button>
                        ),
                      )}
                    </Radio.Group>
                  </div>
                  {current && (
                    <>
                      <Divider style={{ margin: '4px 0' }} />
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'nowrap',
                          padding: 8,
                        }}
                      >
                        <Select>
                          {variableOptions.map(agg => (
                            <Select.Option value={agg.name} {...agg}>
                              {agg.name}
                            </Select.Option>
                          ))}
                        </Select>
                      </div>
                    </>
                  )}

                  {current && variable ? (
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
                  if (index !== 0) {
                    setEditIndex(index);
                    e.preventDefault();
                  }
                }}
              >
                {`${tag.field?.column} ${tagSelect(tag?.option)} ${tag?.variable
                  ?.label}`}
              </span>
            </Tag>
          );
        }
      })}
      {
        <Popover
          content={stepRender}
          trigger="click"
          open={visible}
          onOpenChange={setVisible}
        >
          <Tag className="site-tag-plus">
            <PlusOutlined /> {tagSelect('addTag')}
          </Tag>
        </Popover>
      }
    </Wrapper>
  );
});

const Wrapper = styled.div`
  user-select: none;
`;

const OptSpanWrapper = styled.span`
  margin-right: 6px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 300px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  user-select: none;
  .title {
    padding-right: 20px;
    font-size: 16px;
    font-weight: 600;
  }
`;

const ListContainer = styled.div`
  flex: 1;
  height: 280px;
  overflow-y: auto;
`;

const ItemWrapper = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  padding: ${SPACE_TIMES(0.5)} ${SPACE} ${SPACE_TIMES(0.5)} ${SPACE_SM};
  font-size: ${FONT_SIZE_SUBTITLE};
  font-weight: ${FONT_WEIGHT_MEDIUM};
  color: ${p => p.theme.textColorSnd};
  cursor: pointer;
  user-select: none;
  &.item-active {
    background-color: #f8f9fa;
  }

  &.title {
    font-size: 16px;
    font-weight: blod;
    span {
      padding-right: 5px;
    }
  }
  &.item {
    span {
      padding-right: 5px;
    }
  }
`;
