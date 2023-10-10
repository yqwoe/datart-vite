/**
 * Datart
 *
 * Copyright  2023
 *
 * 河南国立软件技术有限公司
 *
 */

import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import BasicCheckbox from '../Basic/BasicCheckbox';

describe('<BasicCheckbox />', () => {
  let translator;
  beforeAll(() => {
    translator = label => `This is a ${label}`;
  });

  test('should render component correct', () => {
    const { getByText, getByRole } = render(
      <BasicCheckbox
        translate={translator}
        data={{ label: 'Component Label', value: true }}
      />,
    );
    expect(getByText('This is a Component Label')).toBeInTheDocument();
    expect(getByRole('checkbox')).toBeInTheDocument();
    expect(getByRole('checkbox')).toBeChecked();
  });

  test('should fire onChange event', async () => {
    const handleOnChangeEvent = jest.fn();
    const ancestors = [];
    const needRefresh = true;

    const { getByRole } = render(
      <BasicCheckbox
        ancestors={ancestors}
        onChange={handleOnChangeEvent}
        data={{
          label: 'Component Label',
          value: true,
          options: { needRefresh },
        }}
      />,
    );
    fireEvent.click(getByRole('checkbox'));
    expect(handleOnChangeEvent).toHaveBeenCalledWith(
      ancestors,
      false,
      needRefresh,
    );
  });

  test('should hide label when options hide label', () => {
    const { container } = render(
      <BasicCheckbox
        translate={translator}
        data={{
          label: 'Component Label',
          options: { hideLabel: true },
        }}
      />,
    );
    expect(container.querySelector('.ant-form-item-label label')).toBeNull();
  });
});
