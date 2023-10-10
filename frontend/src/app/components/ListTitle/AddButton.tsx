import { PlusOutlined } from '@ant-design/icons';
import { Dropdown, Tooltip } from 'antd';
import { ToolbarButton } from 'app/components';
import { ReactElement } from 'react';

interface AddButtonProps {
  dataSource: {
    items: Array<{ key: string; text: string }>;
    icon?: ReactElement;
    callback: () => void;
  };
}

export function AddButton({
  dataSource: { items, icon, callback },
}: AddButtonProps) {
  return items.length < 2 ? (
    <Tooltip title={items[0].text} placement="bottom">
      <ToolbarButton
        size="small"
        icon={icon || <PlusOutlined />}
        onClick={callback}
      />
    </Tooltip>
  ) : (
    <Dropdown
      trigger={['click']}
      menu={{
        items: items.map(({ key, text: label }) => ({ key, label })),
        onClick: callback,
      }}
    >
      <ToolbarButton size="small" icon={icon || <PlusOutlined />} />
    </Dropdown>
  );
}
