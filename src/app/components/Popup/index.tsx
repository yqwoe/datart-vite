import React, {
  cloneElement,
  isValidElement,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Popover, PopoverProps } from 'antd';
import styled from 'styled-components';
import { mergeClassNames } from 'utils/utils';

export function Popup({
  content,
  overlayClassName,
  onOpenChange,
  ...rest
}: PopoverProps) {
  const [visible, setVisible] = useState(false);

  const visibleChange = useCallback(
    v => {
      setVisible(v);
      onOpenChange && onOpenChange(v);
    },
    [onOpenChange],
  );

  const onClose = useCallback(() => {
    setVisible(false);
  }, []);

  const injectedContent = useMemo(
    () =>
      isValidElement(content) ? cloneElement(content, { onClose }) : content,
    [content, onClose],
  );

  const className = mergeClassNames(overlayClassName, 'datart-popup');
  return (
    <Popover
      {...rest}
      overlayClassName={className}
      content={injectedContent}
      open={visible}
      onOpenChange={visibleChange}
    />
  );
}

export { MenuListItem } from './MenuListItem';
export { MenuWrapper } from './MenuWrapper';
