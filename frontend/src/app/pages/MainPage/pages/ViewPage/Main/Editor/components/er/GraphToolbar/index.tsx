import React from 'react';
import { Button, Divider, Tooltip } from 'antd';
import {
  BarChartOutlined,
  DeleteOutlined,
  FieldStringOutlined,
  FilterOutlined,
  PlusSquareOutlined,
  SortDescendingOutlined,
} from '@ant-design/icons';
import { MODELS, useXFlowApp } from '@antv/xflow';
import './index.less?inline';

interface Props {
  onAddNodeClick: () => void;
  onDeleteNodeClick: () => void;
  onConnectEdgeClick: () => void;
}

const GraphToolbar = (props: Props) => {
  const { onAddNodeClick, onDeleteNodeClick, onConnectEdgeClick } = props;
  const [selectedNodes, setSelectedNodes] = React.useState<any[]>([]);

  /** 监听画布中选中的节点 */
  const useWatchModelService = async () => {
    const appRef = useXFlowApp();
    const modelService = appRef && appRef?.modelService;
    if (modelService) {
      const model = await MODELS.SELECTED_NODES.getModel(modelService);
      model.watch(async () => {
        const nodes = await MODELS.SELECTED_NODES.useValue(modelService);
        setSelectedNodes(nodes);
      });
    }
  };

  useWatchModelService();

  return (
    <div className="xflow-er-solution-toolbar">
      <Tooltip placement="topLeft" title="添加数据表">
        <Button
          type="text"
          icon={<PlusSquareOutlined />}
          onClick={onAddNodeClick}
        />
      </Tooltip>
      <Divider type="vertical" />

      <Tooltip placement="topLeft" title="数据聚合">
        <Button
          type="text"
          icon={<BarChartOutlined />}
          onClick={onConnectEdgeClick}
        />
      </Tooltip>

      <Tooltip placement="topLeft" title="计算字段">
        <Button
          type="text"
          icon={<FieldStringOutlined />}
          onClick={onConnectEdgeClick}
        />
      </Tooltip>

      <Tooltip placement="topLeft" title="数据过滤">
        <Button
          type="text"
          icon={<FilterOutlined />}
          onClick={onConnectEdgeClick}
        />
      </Tooltip>

      <Tooltip placement="topLeft" title="数据排序">
        <Button
          type="text"
          icon={<SortDescendingOutlined />}
          onClick={onConnectEdgeClick}
        />
      </Tooltip>

      <Divider type="vertical" />
      <Tooltip placement="topLeft" title="删除">
        <Button
          type="text"
          disabled={selectedNodes?.length <= 0}
          icon={<DeleteOutlined />}
          onClick={onDeleteNodeClick}
        />
      </Tooltip>
    </div>
  );
};

export default GraphToolbar;
