import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Input, Popover, Select, Tag, Tooltip, Tree } from 'antd';
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
import './index.less?inline';

const { TreeNode } = Tree;

const { Option, OptGroup } = Select;

interface OptionField {
  table?: string;
  column?: string;
  type?: string;
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

export const TagTableRelation = memo((props: TagTableProps) => {
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

  const stepRender = useMemo(() => {
    return () => (
      <PopoverWrapper>
        <HeaderWrapper>
          <Button
            type="text"
            onClick={handleClose}
            icon={<CloseOutlined />}
          ></Button>
          <Input
            placeholder={tagSelect('search')}
            suffix={
              <Tooltip title={tagSelect('search')}>
                <SearchOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
              </Tooltip>
            }
            onChange={e => setSearch(e.target.value)}
          />
        </HeaderWrapper>
        <Tree
          style={{ width: 300, maxHeight: 300, overflow: 'auto' }}
          // dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          loadData={loadData}
          showIcon
          defaultExpandAll
          onSelect={(keys, info) => {
            const [database, name] = keys[0].toString().split(/\x00/);
            handleChange?.(keys[0].toString(), { database, name });
          }}
        >
          {renderNode(filteredData)}
        </Tree>
      </PopoverWrapper>
    );
  }, [filteredData, search, editIndex, visible]);

  return (
    <Wrapper>
      {tags.map((tag, index) => {
        if (editIndex === index) {
          return (
            <Popover
              placement="bottomLeft"
              content={stepRender}
              visible={editIndex === index}
            >
              <Tag className="edit-tag" key={index}>
                {tag?.table?.name}
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
              <span
                onDoubleClick={e => {
                  if (index !== -1) {
                    setEditIndex(index);
                    e.preventDefault();
                  }
                }}
              >
                {tag?.table?.name}
              </span>
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
  min-height: 300px;
`;

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;
