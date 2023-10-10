/**
 * Datart
 *
 * Copyright  2023
 *
 * 河南国立软件技术有限公司
 *
 */

import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { ChartIFrameContainer } from '../index';

jest.mock('uuid/dist/umd/uuidv4.min');

describe('ChartIFrameContainer Test', () => {
  test('should render within iframe when enable use iframe', async () => {
    const { container } = render(
      <ChartIFrameContainer
        dataset={[]}
        chart={{ useIFrame: true }}
        config={{}}
      />,
    );
    expect(container.querySelector('iframe')).not.toBeNull();
  });

  test('should not render iframe when disable use iframe', async () => {
    const { container } = render(
      <ChartIFrameContainer
        dataset={[]}
        chart={{ useIFrame: false }}
        config={{}}
      />,
    );
    expect(container.querySelector('iframe')).toBeNull();
  });
});
