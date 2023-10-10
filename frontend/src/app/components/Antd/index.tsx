import { Calendar as AntdCalendar, DatePicker as AntdDatePicker } from 'antd';
import { PickerTimeProps } from 'antd/es/date-picker/generatePicker';
import type { Moment } from 'moment';
import momentGenerateConfig from 'rc-picker/lib/generate/moment';
import React from 'react';

export const DatePicker =
  AntdDatePicker.generatePicker<Moment>(momentGenerateConfig);

export type TimePickerProps = Omit<PickerTimeProps<Moment>, 'picker'>;

export const TimePicker = React.forwardRef<any, TimePickerProps>(
  (props, ref) => (
    <DatePicker {...props} picker="time" mode={undefined} ref={ref} />
  ),
);

TimePicker.displayName = 'TimePicker';

export const Calendar =
  AntdCalendar.generateCalendar<Moment>(momentGenerateConfig);
