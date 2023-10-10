/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BarChartOutlined,
  DeleteOutlined,
  EditOutlined,
  FieldStringOutlined,
  FilterOutlined,
  SortDescendingOutlined,
  StopOutlined,
} from '@ant-design/icons';
import type { IMenuOptions, NsEdgeCmd, NsGraph, NsNodeCmd } from '@antv/xflow';
import {
  createCtxMenuConfig,
  IconStore,
  MenuItemType,
  XFlowEdgeCommands,
  XFlowNodeCommands,
} from '@antv/xflow';

{
  /* <Tooltip placement="topLeft" title={t('button.aggregate')}>
                <Button type='text' disabled={selectedNodes?.length <= 0} icon={<BarChartOutlined />} onClick={onAggregateClick} />
              </Tooltip>
              <Tooltip placement="topLeft" title={t('button.complex')}>
                <Button type='text' disabled={selectedNodes?.length <= 0} icon={<FieldStringOutlined />} onClick={onComplexClick} />
              </Tooltip>
              <Tooltip placement="topLeft" title={t('button.filter')}>
                <Button type='text' disabled={selectedNodes?.length <= 0} icon={<FilterOutlined />} onClick={onFilterClick} />
              </Tooltip>
              <Tooltip placement="topLeft" title={t('button.sort')}>
                <Button type='text' disabled={selectedNodes?.length <= 0} icon={<SortDescendingOutlined />} onClick={onSortClick} />
              </Tooltip> */
}
/** menuitem 配置 */
export namespace NsMenuItemConfig {
  /** 注册菜单依赖的icon */
  IconStore.set('DeleteOutlined', DeleteOutlined);
  IconStore.set('EditOutlined', EditOutlined);
  IconStore.set('StopOutlined', StopOutlined);
  IconStore.set('BarChartOutlined', BarChartOutlined);
  IconStore.set('FieldStringOutlined', FieldStringOutlined);
  IconStore.set('FilterOutlined', FilterOutlined);
  IconStore.set('SortDescendingOutlined', SortDescendingOutlined);

  export const DELETE_EDGE: IMenuOptions = {
    id: XFlowEdgeCommands.DEL_EDGE.id,
    label: '删除边',
    iconName: 'DeleteOutlined',
    onClick: async ({ target, commandService }) => {
      commandService.executeCommand<NsEdgeCmd.DelEdge.IArgs>(
        XFlowEdgeCommands.DEL_EDGE.id,
        {
          edgeConfig: target.data as NsGraph.IEdgeConfig,
        },
      );
    },
  };

  export const DELETE_NODE: IMenuOptions = {
    id: XFlowNodeCommands.DEL_NODE.id,
    label: '删除节点',
    iconName: 'DeleteOutlined',
    onClick: async ({ target, commandService }) => {
      commandService.executeCommand<NsNodeCmd.DelNode.IArgs>(
        XFlowNodeCommands.DEL_NODE.id,
        {
          nodeConfig: { id: target?.data?.id as string },
        },
      );
    },
  };

  export const EMPTY_MENU: IMenuOptions = {
    id: 'EMPTY_MENU_ITEM',
    label: '暂无可用',
    isEnabled: false,
    iconName: 'DeleteOutlined',
  };

  export const RENAME_NODE: IMenuOptions = {
    id: 'MODIFY_NODE_NAME',
    label: '重命名',
    isVisible: true,
    iconName: 'EditOutlined',
    onClick: async ({ target, commandService }) => {
      const nodeConfig = target.data as NsGraph.INodeConfig;
    },
  };

  export const AGGREGATE_NODE: IMenuOptions = {
    id: 'AGGREGATE_NODE',
    label: '聚合',
    isVisible: true,
    iconName: 'BarChartOutlined',
    onClick: async ({ target, commandService }) => {
      const nodeConfig = target.data as NsGraph.INodeConfig;
    },
  };

  export const FILTER_NODE: IMenuOptions = {
    id: 'FILTER_NODE',
    label: '过滤',
    isVisible: true,
    iconName: 'FilterOutlined',
    onClick: async ({ target, commandService }) => {
      const nodeConfig = target.data as NsGraph.INodeConfig;
    },
  };

  export const COMPLEX_NODE: IMenuOptions = {
    id: 'COMPLEX_NODE',
    label: '计算字段',
    isVisible: true,
    iconName: 'FieldStringOutlined',
    onClick: async ({ target, commandService }) => {
      const nodeConfig = target.data as NsGraph.INodeConfig;
    },
  };
  export const SEPARATOR: IMenuOptions = {
    id: 'separator',
    type: MenuItemType.Separator,
  };
}

export const useMenuConfig = createCtxMenuConfig(config => {
  config.setMenuModelService(async (target, model, modelService, toDispose) => {
    const { type, cell }: any = target;
    switch (type) {
      /** 节点菜单 */
      case 'node':
        model.setValue({
          id: 'root',
          type: MenuItemType.Root,
          // submenu: [NsMenuItemConfig.DELETE_NODE, NsMenuItemConfig.RENAME_NODE],
          submenu: [NsMenuItemConfig.DELETE_NODE],
        });
        break;
      /** 边菜单 */
      case 'edge':
        model.setValue({
          id: 'root',
          type: MenuItemType.Root,
          submenu: [NsMenuItemConfig.DELETE_EDGE],
        });
        break;
      /** 画布菜单 */
      case 'blank':
        model.setValue({
          id: 'root',
          type: MenuItemType.Root,
          submenu: [NsMenuItemConfig.EMPTY_MENU],
        });
        break;
      /** 默认菜单 */
      default:
        model.setValue({
          id: 'root',
          type: MenuItemType.Root,
          submenu: [NsMenuItemConfig.EMPTY_MENU],
        });
        break;
    }
  });
});
