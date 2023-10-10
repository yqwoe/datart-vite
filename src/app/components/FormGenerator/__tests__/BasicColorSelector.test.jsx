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
import BasicColorSelector from '../Basic/BasicColorSelector';

describe('<BasicColorSelector />', () => {
  let translator;
  beforeAll(() => {
    translator = label => `This is a ${label}`;
  });

  test('should render component correct', () => {
    const { container, getByText } = render(
      <BasicColorSelector
        translate={translator}
        data={{ label: 'Component Label', value: '#fafafa' }}
      />,
    );

    expect(getByText('This is a Component Label')).toBeInTheDocument();
    expect(container.querySelector('[color*="fafafa"]')).not.toBeNull();
  });

  test('should hide label when options hide label', () => {
    const { container } = render(
      <BasicColorSelector
        data={{
          label: 'Component Label',
          options: { hideLabel: true },
        }}
      />,
    );
    expect(container.querySelector('.ant-form-item-label label')).toBeNull();
  });
});
