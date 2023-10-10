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
import { createContext, FC, memo, useMemo } from 'react';

export interface GridLayoutContextProps {
  margin: number[];
  padding: number[];
  rowHeight: number;
}

export const GridLayoutContext = createContext<GridLayoutContextProps>(
  {} as GridLayoutContextProps,
);
export const GridLayoutProvider: FC<GridLayoutContextProps> = memo(
  ({ margin, padding, rowHeight, children }) => {
    const boardContextValue: GridLayoutContextProps = useMemo(() => {
      return {
        margin,
        padding,
        rowHeight,
      };
    }, [margin, padding, rowHeight]);

    return (
      <GridLayoutContext.Provider value={boardContextValue}>
        {children}
      </GridLayoutContext.Provider>
    );
  },
);
