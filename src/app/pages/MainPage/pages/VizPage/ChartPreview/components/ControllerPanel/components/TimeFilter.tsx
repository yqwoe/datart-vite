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
import { FC, memo, useState } from 'react';
import { DatePicker } from 'app/components/Antd';
import moment, { Moment } from 'moment';
import { updateBy } from 'app/utils/mutation';
import { PresentControllerFilterProps } from '.';

const TimeFilter: FC<PresentControllerFilterProps> = memo(
  ({ condition, onConditionChange }) => {
    const [stringTime, setStringTime] = useState<string | undefined>(
      String(condition?.value || ''),
    );

    function onChange(time: Moment | null) {
      const newCondition = updateBy(condition!, draft => {
        draft.value = time?.toString() || '';
      });
      onConditionChange(newCondition);
      setStringTime(newCondition.value as string);
    }
    return <DatePicker value={moment(stringTime)} onChange={onChange} />;
  },
);

export default TimeFilter;
