/**
 * Datart Vite
 *
 * Copyright 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Checkbox, Collapse, Form } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import styled from 'styled-components';
import { ControlOption } from 'app/pages/DashBoardPage/pages/BoardEditor/components/ControllerWidgetPanel/types';
import { WidgetActionContext } from '../../../ActionProvider/WidgetActionProvider';
import { WidgetContext } from '../../../WidgetProvider/WidgetProvider';
import { useGridWidgetHeight } from 'app/hooks/useGridWidgetHeight';
import { useCacheWidthHeight } from 'app/hooks/useCacheWidthHeight';
import { getBoardMarginPadding } from 'app/pages/DashBoardPage/utils/board';
import { BoardConfigValContext } from '../../../BoardProvider/BoardConfigProvider';
import { GridLayoutContext } from '../../../BoardProvider/GridLayoutProvider';

export interface CheckboxGroupControllerProps {
  options?: ControlOption[];
  value?: CheckboxValueType[];
  placeholder?: string;
  onChange: (values) => void;
  label?: React.ReactNode;
  name?: string;
  required?: boolean;
}

export const CheckboxGroupControllerForm: React.FC<CheckboxGroupControllerProps> =
  memo(({ label, name, required, ...rest }) => {
    return (
      <Form.Item
        name={name}
        validateTrigger={['onChange', 'onBlur']}
        rules={[{ required: false }]}
      >
        <CheckboxGroupSetter {...rest} label={label} />
      </Form.Item>
    );
  });
export const CheckboxGroupSetter: React.FC<CheckboxGroupControllerProps> = memo(
  ({ label, options, onChange, value = [] }) => {
    const renderOptions = useCallback(() => {
      return (options || []).map(o => ({
        label: o.label ?? o.value,
        value: o.value || '',
        key: o.label + o.value,
      }));
    }, [options]);
    const widget = useContext(WidgetContext);
    const { onUpdateWidgetConfigByKey, onRefreshWidgetsByController } =
      useContext(WidgetActionContext);
    const [collapsed, setCollapsed] = useState(false);
    const [tempHeight, _] = useState(widget.config.pRect.height);
    const ref = useRef(null);

    const checkAll = value.length === renderOptions().length;
    const indeterminate =
      value.length > 0 && value.length < renderOptions().length;
    const { rowHeight = 0, margin = [0, 0] } = useContext(GridLayoutContext);
    const handleResize = useCallback(
      height => {
        onUpdateWidgetConfigByKey({
          wid: widget.id,
          key: 'pRect',
          val: {
            ...widget.config.pRect,
            height,
          },
        });
      },
      [widget, onUpdateWidgetConfigByKey],
    );

    useEffect(() => {
      onRefreshWidgetsByController(widget);
    }, [widget]);

    useEffect(() => {
      if (ref.current) {
        const newHeight = Math.ceil(
          ref?.current?.scrollHeight / (rowHeight + margin?.[0]),
        );
        const height = !collapsed ? tempHeight : newHeight;
        handleResize(height);
      }
    }, [collapsed, ref, rowHeight, margin]);

    if (widget.config.boardType === 'free') {
      return (
        <Wrapper>
          <Checkbox.Group
            value={value}
            onChange={onChange}
            options={renderOptions()}
          />
        </Wrapper>
      );
    }

    return (
      <Wrapper>
        <Collapse
          expandIconPosition="end"
          ghost
          onChange={e => {
            setCollapsed(!!e.length);
          }}
          destroyInactivePanel
          size="small"
          items={[
            {
              key: widget.id,
              label,
              extra: (
                <Checkbox
                  indeterminate={indeterminate}
                  checked={checkAll}
                  onChange={e => {
                    onChange(
                      e.target.checked
                        ? renderOptions().map(op => op.value)
                        : [],
                    );
                  }}
                />
              ),
              collapsible: 'icon',
              ref,
              children: collapsed && (
                <Checkbox.Group
                  onChange={e => {
                    onChange(e);
                  }}
                  value={value}
                  style={{
                    display: 'flex',
                    flex: '1',
                    flexDirection: 'column',
                  }}
                >
                  {renderOptions().map(({ label, value }) => (
                    <p
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 28px 10px',
                      }}
                    >
                      {label}
                      <Checkbox value={value} />
                    </p>
                  ))}
                </Checkbox.Group>
              ),
            },
          ]}
        />
      </Wrapper>
    );
  },
);
const Wrapper = styled.div`
  display: grid;
`;
