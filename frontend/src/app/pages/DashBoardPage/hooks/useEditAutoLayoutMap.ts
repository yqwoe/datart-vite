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
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectLayoutWidgetMap } from '../pages/BoardEditor/slice/selectors';

export default function useEditAutoLayoutMap(boardId: string) {
  const layoutWidgetMap = useSelector(selectLayoutWidgetMap);

  const sortedLayoutWidgets = useMemo(
    () =>
      Object.values(layoutWidgetMap).sort(
        (a, b) => a.config.index - b.config.index,
      ),
    [layoutWidgetMap],
  );
  return sortedLayoutWidgets;
}
