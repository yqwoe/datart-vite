/**
 * Datart
 *
 * Copyright  2023
 *
 * 河南国立软件技术有限公司
 *
 */

import ChartIFrameContainerDispatcher from '../ChartIFrameContainerDispatcher';

describe('ChartIFrameContainerDispatcher Test', () => {
  test('should get new instance if not init', () => {
    const instance = ChartIFrameContainerDispatcher.instance();
    expect(instance).not.toBeNull();
  });

  test('should create new container and show current container if not exist', () => {
    const instance = ChartIFrameContainerDispatcher.instance();
    const chart = {};
    const dataset = {};
    const config = {};
    const style = {};
    const containers = instance.getContainers(
      'id=1',
      chart,
      dataset,
      config,
      style,
    );
    expect(containers.length).toEqual(1);
    expect(containers[0].props.style).toEqual({
      transform: 'none',
      position: 'relative',
    });
  });

  test('should switch new container if id matched', () => {
    const instance = ChartIFrameContainerDispatcher.instance();
    const chart = {};
    const dataset = {};
    const config = {};
    const style = {};
    instance.getContainers('id=1', chart, dataset, config, style);
    const containers = instance.getContainers(
      'id=2',
      chart,
      dataset,
      config,
      style,
    );
    expect(containers.length).toEqual(2);
    expect(containers[0].props.style).toEqual({
      transform: 'translate(-9999px, -9999px)',
      position: 'absolute',
    });
    expect(containers[1].props.style).toEqual({
      transform: 'none',
      position: 'relative',
    });
  });
});
