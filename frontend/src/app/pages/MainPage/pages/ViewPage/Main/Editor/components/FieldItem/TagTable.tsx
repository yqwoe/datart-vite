import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  Checkbox,
  Divider,
  Input,
  Popover,
  Select,
  Space,
  Tag,
  Tooltip,
  Tree,
} from 'antd';
import { DataNode } from 'antd/lib/tree';
import { DataViewFieldType } from 'app/constants';
import {
  CalendarOutlined,
  CloseOutlined,
  DatabaseOutlined,
  FieldNumberOutlined,
  FieldStringOutlined,
  PlusOutlined,
  SearchOutlined,
  TableOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { Schema } from '../../../../slice/types';
import './index.less?inline';

const { TreeNode } = Tree;

const { Option, OptGroup } = Select;
const CheckboxGroup = Checkbox.Group;

interface OptionField extends Schema {
  checked?: boolean | true;
}

interface TableInfo {
  name?: string;
  columns?: OptionField[];
  comment?: string;
  database?: string;
}

interface SelectValue {
  key: string;
  table: TableInfo;
}

interface SelectOption {
  label?: string;
  children?: OptionField[];
}

interface TagTableProps {
  value?: SelectValue[];
  onChange?: (value: SelectValue[]) => void;
  filteredData?: DataNode[];
  loadData?: ({ value }: any) => Promise<void>;
}

export const TagTable = memo((props: TagTableProps) => {
  const { onChange, value, filteredData, loadData } = props;
  const [visible, setVisible] = useState(false);
  const [tags, setTags] = useState<SelectValue[]>(value || []);
  const [search, setSearch] = useState('');
  const [editIndex, setEditIndex] = useState(-1);
  const t = useI18NPrefix(`view.editor.graphEditor.node`);
  const tagSelect = useI18NPrefix(`view.editor.graphEditor.tagTable`);

  useEffect(() => {
    onChange?.(tags);
  }, [tags]);

  const tagClick = tag => {
    const newTags = tags.filter(tg => tg.key != tag.key);
    setTags(newTags);
  };

  const renderIcon = useCallback(
    ({ value }) => {
      if (!value) {
        return null;
      }
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
            // value={ele?.value}
            {...ele}
            title={
              isLeaf ? (
                <Tooltip
                  placement="topLeft"
                  title={`${
                    ele?.comment ? `${ele?.title}  ${ele?.comment}` : ele?.title
                  }`}
                >
                  <span>{`${ele?.title}`}</span>
                </Tooltip>
              ) : (
                `${ele?.title}`
              )
            }
            key={ele?.key}
            isLeaf={isLeaf}
            icon={renderIcon}
          >
            {ele?.children &&
              ele?.children.length &&
              renderNode(
                ele.children.filter(
                  row =>
                    !search ||
                    row.title
                      .toLocaleLowerCase()
                      .includes(search.toLocaleLowerCase()),
                ),
                true,
              )}
          </TreeNode>
        ))
      );
    },
    [filteredData, search],
  );

  const handleChange = (key, table) => {
    setVisible(false);
    setEditIndex(-1);
    setSearch('');
    setTags(tags => {
      let newTags: SelectValue[] = [];
      if (editIndex === -1) {
        newTags = [...tags.filter(({ key: k }) => key !== k), { key, table }];
      } else {
        newTags = tags.fill({ key, table }, editIndex, editIndex + 1);
      }
      return newTags;
    });
  };

  const handleClose = e => {
    setVisible(false);
    setEditIndex(-1);
    setSearch('');
  };

  const [checkList, setCheckList] = useState<string[]>([]);
  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);

  useEffect(() => {
    if (editIndex > -1) {
      const tag = tags[editIndex];
      const keys: string[] =
        tag.table?.columns?.filter(s => s.checked).map(s => s.name) || [];
      const columnLength: number = tag.table.columns?.length || 0;
      setCheckList(keys);
      setCheckAll(keys.length === columnLength);
      setIndeterminate(!!keys.length && keys.length < columnLength);
    }
  }, [editIndex]);

  const handleCheckAllChange = useCallback(
    e => {
      const tag = tags[editIndex];
      const columns =
        tag.table.columns?.map(s => ({ ...s, checked: e.target.checked })) ||
        [];
      const newTag = { ...tag, table: { ...tag.table, columns: columns } };
      setTags(tags.fill(newTag, editIndex, editIndex + 1));
      setCheckList(e.target.checked ? columns.map(s => s.name) : []);
      setIndeterminate(false);
      setCheckAll(e.target.checked);
    },
    [tags, editIndex],
  );

  const handleCheckChange = useCallback(
    list => {
      const tag = tags[editIndex];
      const columnLength: number = tag.table.columns?.length || 0;
      const newTag = {
        ...tag,
        table: {
          ...tag.table,
          columns: tag.table.columns?.map(s => ({
            ...s,
            checked: list.includes(s.name),
          })),
        },
      };
      setTags(tags.fill(newTag, editIndex, editIndex + 1));
      setCheckList(list);
      setIndeterminate(!!list.length && list.length < columnLength);
      setCheckAll(list.length === columnLength);
    },
    [tags, editIndex],
  );

  const stepRender = useMemo(() => {
    return () => (
      <PopoverWrapper>
        <HeaderWrapper>
          <Input
            placeholder={tagSelect('search')}
            suffix={
              <Tooltip title={tagSelect('search')}>
                <SearchOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
              </Tooltip>
            }
            onChange={e => setSearch(e.target.value)}
          />
          <Button
            type="text"
            onClick={handleClose}
            icon={<CloseOutlined />}
          ></Button>
        </HeaderWrapper>
        <Tree
          style={{ width: 300, maxHeight: 300, overflow: 'auto' }}
          // dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          loadData={loadData}
          showIcon
          defaultExpandAll
          onSelect={(keys, info) => {
            const [database, name] = keys[0].toString().split(/\x00/);
            handleChange?.(keys[0].toString(), {
              database,
              name,
              columns:
                info.node &&
                info.node['columns'].map(s => ({ ...s, checked: true })),
            });
          }}
        >
          {renderNode(filteredData)}
        </Tree>
      </PopoverWrapper>
    );
  }, [filteredData, search, editIndex, visible, tags]);

  const fieldsRender = useMemo(() => {
    const tag = tags[editIndex];
    return () => (
      <PopoverWrapper>
        <HeaderWrapper>
          <Checkbox
            indeterminate={indeterminate}
            onChange={handleCheckAllChange}
            checked={checkAll}
          >
            {tagSelect('checkAll')}
          </Checkbox>
          <Button
            type="text"
            onClick={handleClose}
            icon={<CloseOutlined />}
          ></Button>
        </HeaderWrapper>
        <Divider style={{ margin: '10px 0' }} />
        <CheckBoxWrapper>
          <CheckboxGroup onChange={handleCheckChange} value={checkList}>
            <Space direction="vertical" size={0}>
              {tag.table.columns?.map(s => (
                <Checkbox key={s.name} value={s.name}>
                  {s.name}
                </Checkbox>
              ))}
            </Space>
          </CheckboxGroup>
        </CheckBoxWrapper>
      </PopoverWrapper>
    );
  }, [filteredData, search, editIndex, visible, tags, checkList]);

  return (
    <Wrapper>
      {tags.map((tag, index) => {
        if (editIndex === index) {
          return (
            <Popover
              placement="bottomLeft"
              content={fieldsRender}
              visible={editIndex === index}
              key={index}
            >
              <Tag className="edit-tag">
                <TagTableWrapper>
                  <span>
                    <TableOutlined />
                  </span>
                  <span>{tag?.table?.name}</span>
                </TagTableWrapper>
              </Tag>
            </Popover>
          );
        } else {
          return (
            <Tag
              className="edit-tag"
              key={index}
              closable={index !== -1}
              onClose={e => tagClick(tag)}
            >
              <TagTableWrapper
                onClick={e => {
                  if (index !== -1) {
                    setEditIndex(index);
                    e.preventDefault();
                  }
                }}
              >
                <span>
                  <TableOutlined />
                </span>
                <span>{tag?.table?.name}</span>
              </TagTableWrapper>
            </Tag>
          );
        }
      })}
      {
        <Popover
          placement="bottomLeft"
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

const Wrapper = styled.div``;

const OptSpanWrapper = styled.span`
  margin-right: 6px;
`;

const PopoverWrapper = styled.div`
  min-width: 200px;
  max-height: 300px;
  overflow-y: auto;
`;

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const TagTableWrapper = styled.span`
  width: 100%;
  user-select: none;
  border: 1px dashed #fafafa;
  span {
    padding-left: 5px;
  }
`;

const CheckBoxWrapper = styled.div`
  min-width: 200px;
  height: 300px;
  overflow-y: auto;
`;
