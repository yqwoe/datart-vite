import React, { CSSProperties, useState } from 'react';
import { Avatar as AntdAvatar, AvatarProps } from 'antd';
import styled from 'styled-components';
import endsWith from 'lodash/endsWith';

export function Avatar(props: AvatarProps) {
  const style: CSSProperties = {};
  const { src, size, ...rest } = props;
  const [safeSrc, setSafeSrc] = useState<React.ReactNode>(src);

  if (typeof size === 'number') {
    style.fontSize = `${size * 0.375}px`;
  }
  if (
    typeof safeSrc === 'string' &&
    (endsWith(safeSrc,'null') || endsWith(safeSrc,'undefined'))
  ) {
    setSafeSrc('');
  }

  return (
    <StyledAvatar {...rest} src={safeSrc} size={size} style={style}>
      {props.children}
    </StyledAvatar>
  );
}

const StyledAvatar = styled(AntdAvatar)`
  &.ant-avatar {
    color: ${p => p.theme.textColorLight};
    background-color: ${p => p.theme.emphasisBackground};
  }
`;
