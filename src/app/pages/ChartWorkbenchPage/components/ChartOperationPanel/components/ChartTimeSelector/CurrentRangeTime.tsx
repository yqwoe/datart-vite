/**
 * Datart Vite
 *
 * Copyright 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { FC, memo } from 'react';
import moment from 'moment';
import { DatePicker } from 'app/components/Antd';

const { RangePicker } = DatePicker;

const CurrentRangeTime: FC<{ times?: [string, string]; disabled?: boolean }> =
  memo(({ times, disabled = true }) => {
    return (
      <RangePicker
        showTime
        disabled={disabled}
        value={[moment(times?.[0]), moment(times?.[1])]}
      />
    );
  });

export default CurrentRangeTime;
